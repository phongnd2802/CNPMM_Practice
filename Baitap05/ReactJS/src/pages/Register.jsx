import { useState } from "react";
import { Button, Col, Form, Input, Row, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { createUserApi } from "../util/api.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ name, email, password }) => {
    setLoading(true);
    const res = await createUserApi(name, email, password);
    setLoading(false);

    if (res && res.id) {
      notification.success({
        message: "REGISTER",
        description: "Tạo tài khoản thành công",
      });
      navigate("/login");
    } else {
      notification.error({
        message: "REGISTER",
        description: res?.EM || "Đăng ký thất bại",
      });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: 15, margin: 5 }}>
          <legend>Register</legend>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input placeholder="you@example.com" />
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
                Create account
              </Button>
            </Form.Item>
          </Form>
          <div>
            <span>Đã có tài khoản? </span>
            <Link to="/login">Đăng nhập</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
}
