require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    // check user exist
    const user = await User.findOne({ where: { email } });

    if (user) {
      console.log(`>>> user exist, chọn 1 email khác: ${email}`);
      return null;
    }

    // hash user password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // save user to database
    let result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "User",
    });

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    // fetch user by email
    const user = await User.findOne({ where: { email } });

    if (user) {
      // compare password
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "Email/Password không hợp lệ",
        };
      } else {
        // create an access token
        const payload = {
          email: user.email,
          name: user.name,
        };

        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        return {
          EC: 0,
          access_token,
          user: {
            email: user.email,
            name: user.name,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password không hợp lệ",
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserService = async () => {
  try {
    const result = await User.findAll({
      attributes: { exclude: ["password"] }, // loại bỏ cột password
      raw: true, // trả mảng plain object
    });
    return result; // [] nếu không có user
  } catch (error) {
    console.error("getUserService error:", error);
    return null; // hoặc throw error để controller trả 500
  }
};

/**
 * Gửi link reset (stateless): tạo token ký bằng (JWT_SECRET + user.passwordHash)
 * KHÔNG lộ email tồn tại hay không. Token hết hạn sau 15 phút.
 */
const requestPasswordResetService = async (emailRaw) => {
  try {
    const email = String(emailRaw || "").trim().toLowerCase();
    const user = await User.findOne({ where: { email } });

    // Trả message chung để tránh dò email (dù tồn tại hay không)
    if (!user) {
      return { EC: 0, EM: "If this email exists, a reset link has been sent.", DT: null };
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("Missing JWT_SECRET");
    }
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

    // Bí mật động phụ thuộc mật khẩu hiện tại => token tự vô hiệu sau khi user đổi mật khẩu
    const secret = `${JWT_SECRET}.${user.password}`;

    // Chuẩn hóa payload + purpose để xác định loại token
    const payload = {
      sub: user.id,
      email: user.email,
      purpose: "password_reset",
    };

    const token = jwt.sign(payload, secret, { expiresIn: "15m" });

    const resetURL =
      `${CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`;

    // DEV: trả kèm link để test, PROD: chỉ trả message
    if (process.env.NODE_ENV !== "production") {
      console.log("🔗 Reset URL (DEV):", resetURL);
    }

    return {
      EC: 0,
      EM: "Reset link sent (if email exists).",
      DT: process.env.NODE_ENV !== "production" ? { resetURL } : null,
    };
  } catch (e) {
    console.error("requestPasswordResetService error:", e.message);
    return { EC: -1, EM: "Server error", DT: null };
  }
};

/**
 * Đặt mật khẩu mới bằng token stateless.
 * Kiểm tra: token hợp lệ, đúng purpose/email/id, mật khẩu mới >= 6 ký tự và khác mật khẩu cũ.
 */
const resetPasswordService = async ({ emailRaw, token, newPassword }) => {
  try {
    const email = String(emailRaw || "").trim().toLowerCase();
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Không lộ thông tin: trả lỗi chung
      return { EC: 1, EM: "Invalid or expired reset token.", DT: null };
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("Missing JWT_SECRET");
    }

    const secret = `${JWT_SECRET}.${user.password}`;

    let decoded;
    try {
      decoded = jwt.verify(String(token || ""), secret);
    } catch (_) {
      return { EC: 1, EM: "Invalid or expired reset token.", DT: null };
    }

    // Bảo đảm đúng loại token và đúng owner
    if (
      decoded.purpose !== "password_reset" ||
      String(decoded.email).toLowerCase() !== user.email.toLowerCase() ||
      Number(decoded.sub) !== Number(user.id)
    ) {
      return { EC: 1, EM: "Invalid or expired reset token.", DT: null };
    }

    // Ràng buộc mật khẩu
    if (!newPassword || String(newPassword).length < 6) {
      return { EC: 1, EM: "New password must be at least 6 characters.", DT: null };
    }
    // Không cho trùng mật khẩu cũ
    const sameAsOld = await bcrypt.compare(String(newPassword), user.password);
    if (sameAsOld) {
      return { EC: 1, EM: "New password must be different from the old password.", DT: null };
    }

    // Cập nhật mật khẩu => token cũ tự vô hiệu vì secret đã đổi (hash mới)
    const hash = await bcrypt.hash(String(newPassword), saltRounds);
    await user.update({ password: hash });

    return { EC: 0, EM: "Password has been reset.", DT: null };
  } catch (e) {
    console.error("resetPasswordService error:", e.message);
    return { EC: -1, EM: "Server error", DT: null };
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  requestPasswordResetService,
  resetPasswordService,
};
