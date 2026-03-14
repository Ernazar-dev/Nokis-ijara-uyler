import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../../../api/axios"; // ✅
import { toast } from "react-toastify";

import { Form, Input, Button, Card, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", values); // ✅
      login(res.data.token);
      toast.success(`Xosh keldińiz, ${res.data.name}!`);
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registraciyada qátelik boldı!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 relative p-4">
      <Link
        to="/"
        className="absolute top-8 left-8 text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-all hover:gap-3"
      >
        <ArrowLeftOutlined /> Bas betke
      </Link>

      <Card className="w-full max-w-[440px] shadow-2xl border-0 rounded-3xl backdrop-blur-xl bg-white/80">
        <div className="text-center mb-6">
          <Title level={2} style={{ marginBottom: 0 }}>
            <span className="text-slate-900">Dizimnen</span>{" "}
            <span className="text-blue-600">ótiw</span>
          </Title>
          <Text type="secondary">Nókis Ijara sistemasına qosılıń</Text>
        </div>

        <Form
          name="register_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="name"
            label="Atıńız"
            rules={[{ required: true, message: "Atıńızdı kirgiziń!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Palenshe tolenshe"
              className="rounded-xl hover:border-blue-500 focus:border-blue-600"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email kiritilmedi!" },
              { type: "email", message: "Email durıs emes!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="name@company.com"
              className="rounded-xl hover:border-blue-500 focus:border-blue-600"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Parol"
            rules={[
              { required: true, message: "Parol kiritilmedi!" },
              { min: 6, message: "Parol eń keminde 6 belgi bolıwı kerek!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
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
              Dizimnen ótiw
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text type="secondary">Aldın dizimnen ótkensiz be? </Text>
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Kiriw
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
