import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Typography,
  Result,
  Space
} from 'antd';
import { 
  LockOutlined,
  EyeInvisibleOutlined, 
  EyeTwoTone,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import '../styles/Login.css';

const { Title, Paragraph, Text } = Typography;

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    // 检查URL参数是否包含token
    if (!token) {
      message.error('重置密码令牌无效或已过期');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleSubmit = async (values: any) => {
    if (!token) {
      message.error('重置密码令牌无效');
      return;
    }

    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword({
        token,
        password: values.password
      });
      
      if (result && result.data && result.data.data && result.data.data.success) {
        setSuccess(true);
        message.success('密码重置成功');
      }
    } catch (error) {
      console.error('重置密码失败:', error);
      message.error('重置密码失败，请检查令牌是否有效');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="login-content">
          <div className="login-card">
            <Result
              status="success"
              title="密码重置成功"
              subTitle="您的密码已成功重置，现在可以使用新密码登录。"
              extra={[
                <Button type="primary" key="login" onClick={() => navigate('/login')} size="large">
                  前往登录
                </Button>
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <Space align="center">
              <Link to="/forgot-password">
                <ArrowLeftOutlined style={{ fontSize: '16px', marginRight: '10px' }} />
              </Link>
              <Title level={2} className="login-title">重置密码</Title>
            </Space>
            <Paragraph className="login-subtitle">请设置您的新密码</Paragraph>
          </div>

          <Form
            name="reset_password"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入新密码"
                size="large"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请确认新密码"
                size="large"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
                className="login-button"
              >
                重置密码
              </Button>
            </Form.Item>
          </Form>

          <div className="login-options">
            <Space style={{ justifyContent: 'center', width: '100%' }}>
              <Link to="/login">返回登录</Link>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 