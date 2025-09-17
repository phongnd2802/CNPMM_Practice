const {
  createUserService,
  loginService,
  getUserService,
  requestPasswordResetService,
  resetPasswordService,
} = require("../services/userService");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(data);
};

const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data);
};

const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email)
      return res.status(400).json({ EC: 1, EM: "Email is required", DT: null });
    // Service đã tạo token stateless dựa trên JWT_SECRET + password hash hiện tại
    const result = await requestPasswordResetService(email);
    return res.status(200).json(result);
  } catch (e) {
    console.error("forgotPassword error:", e);
    return res.status(500).json({ EC: -1, EM: "Server error", DT: null });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body || {};
    if (!email || !token || !newPassword) {
      return res.status(400).json({ EC: 1, EM: "Missing fields", DT: null });
    }
    const result = await resetPasswordService({
      emailRaw: email,
      token,
      newPassword,
    });
    return res.status(200).json(result);
  } catch (e) {
    console.error("resetPassword error:", e);
    return res.status(500).json({ EC: -1, EM: "Server error", DT: null });
  }
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
  resetPassword,
};
