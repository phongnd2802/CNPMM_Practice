import { useState } from "react";
import { Button, Col, Form, Input, Row, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { forgotPasswordApi } from "../util/api.js";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email }) => {
    setLoading(true);
    try {
      const res = await forgotPasswordApi(email);
      if (res?.EC === 0) {
        notification.success({
          message: "FORGOT PASSWORD",
          description:
            res?.EM || "If this email exists, a reset link has been sent.",
        });
        if (res?.DT?.resetURL) {
          try {
            const url = new URL(res.DT.resetURL);
            navigate(`${url.pathname}${url.search}`, { replace: true });
          } catch {
            const mToken = res.DT.resetURL.match(/token=([^&]+)/);
            const mEmail = res.DT.resetURL.match(/email=([^&]+)/);
            if (mToken && mEmail) {
              navigate(
                `/reset-password?token=${mToken[1]}&email=${mEmail[1]}`,
                { replace: true }
              );
            }
          }
        }
      } else {
        notification.error({
          message: "FORGOT PASSWORD",
          description: res?.EM || "Request failed",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: 15, margin: 5 }}>
          <legend>Forgot Password</legend>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Send reset link
              </Button>
            </Form.Item>
          </Form>
          <Link to="/">
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>
        </fieldset>
      </Col>
    </Row>
  );
}
