import { useContext, useState } from "react";
import { Button, Col, Form, Input, Row, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context.jsx";
import { loginApi } from "../util/api.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email, password }) => {
    setLoading(true);
    const res = await loginApi(email, password);
    setLoading(false);

    if (res?.EC === 0 && res?.access_token) {
      localStorage.setItem("access_token", res.access_token);
      setAuth({
        isAuthenticated: true,
        user: { email: res?.user?.email, name: res?.user?.name },
      });
      notification.success({
        message: "LOGIN",
        description: "Đăng nhập thành công",
      });
      navigate("/");
    } else {
      notification.error({
        message: "LOGIN",
        description: res?.EM || "Email/Password không hợp lệ",
      });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: 15, margin: 5 }}>
          <legend>Login</legend>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input placeholder="you@example.com" autoFocus />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Link to="/register">Đăng ký</Link>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
}
