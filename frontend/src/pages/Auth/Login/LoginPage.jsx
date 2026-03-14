import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../../../api/axios"; // ✅
import { toast } from "react-toastify";

import { Form, Input, Button, Card, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", values); // ✅
      login(res.data.token);
      toast.success(`Xosh keldińiz, ${res.data.name}!`);

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "superadmin") navigate("/superadmin");
      else navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Kiriwde qátelik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 relative p-4">
      <Link
        to="/"
        className="absolute top-8 left-8 text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-all hover:gap-3"
      >
        <ArrowLeftOutlined /> Bas betke
      </Link>

      <Card className="w-full max-w-[420px] shadow-2xl border-0 rounded-3xl backdrop-blur-xl bg-white/80">
        <div className="text-center mb-8">
          <Title level={2} style={{ marginBottom: 0 }}>
            <span className="text-slate-900">Nókis</span>{" "}
            <span className="text-blue-600">Ijara</span>
          </Title>
          <Text type="secondary">Davom etiw ushın kiriń</Text>
        </div>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email kiritilmedi!" },
              { type: "email", message: "Email durıs emes!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Email adresińiz"
              className="rounded-xl hover:border-blue-500 focus:border-blue-600"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Parol"
            rules={[{ required: true, message: "Parol kiritilmedi!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Parol"
              className="rounded-xl hover:border-blue-500 focus:border-blue-600"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="h-[48px] rounded-xl font-semibold
           bg-gradient-to-r from-blue-600 to-indigo-600
           hover:from-blue-700 hover:to-indigo-700
           text-white shadow-md hover:shadow-xl
           transition-all duration-300"
            >
              Kiriw
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text type="secondary">Ele dizimnen ótpedińiz be? </Text>
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Registraciya
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
