import { Button, Col, Form, Input, Row, notification } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { resetPasswordApi } from "../util/api.js";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const token = search.get("token") || "";
  const email = search.get("email") || "";

  const onFinish = async ({ password }) => {
    const res = await resetPasswordApi(email, token, password);
    if (res?.EC === 0) {
      notification.success({
        message: "RESET PASSWORD",
        description: res?.EM || "Success",
      });
      navigate("/login");
    } else {
      notification.error({
        message: "RESET PASSWORD",
        description: res?.EM || "Invalid or expired reset token.",
      });
    }
  };

  if (!token || !email)
    return <div className="container">Invalid reset link</div>;

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: 15, margin: 5 }}>
          <legend>Reset Password</legend>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="New password"
              name="password"
              rules={[{ required: true }, { min: 6 }]}
              hasFeedback
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>
            <Form.Item
              label="Confirm password"
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                      return Promise.resolve();
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Repeat password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update password
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
