import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Tabs, 
  Typography,
  Space,
  Result
} from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined,
  SafetyOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, sendPhoneVerificationCode, sendEmailVerificationCode } from '../api/auth';
import '../styles/Login.css';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [activeTab, setActiveTab] = useState('email');
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const startCountdown = () => {
    let count = 60;
    setCountdown(count);
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
      }
    }, 1000);
  };

  const handleSendVerificationCode = async () => {
    try {
      const fieldsToValidate = activeTab === 'phone' 
        ? ['phone'] 
        : ['email'];
      
      await form.validateFields(fieldsToValidate);
      
      setSendingCode(true);
      
      if (activeTab === 'phone') {
        const phone = form.getFieldValue('phone');
        await sendPhoneVerificationCode(phone);
        message.success('验证码已发送至您的手机');
      } else {
        const email = form.getFieldValue('email');
        await sendEmailVerificationCode(email);
        message.success('验证码已发送至您的邮箱');
      }
      
      startCountdown();
    } catch (error) {
      console.error('发送验证码失败:', error);
      message.error('发送验证码失败，请检查输入是否正确');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 构建找回密码请求数据
      const requestData = {
        email: activeTab === 'email' ? values.email : undefined,
        phone: activeTab === 'phone' ? values.phone : undefined,
        verificationCode: values.verificationCode
      };

      const result = await forgotPassword(requestData);
      
      // API返回的数据结构可能是 result.data.data.resetToken
      if (result && result.data && result.data.data && result.data.data.resetToken) {
        const resetTokenValue = result.data.data.resetToken;
        setResetToken(resetTokenValue);
        setSuccess(true);
        message.success('验证成功，请重置您的密码');
        // 跳转到重置密码页面，并传递令牌
        navigate(`/reset-password?token=${resetTokenValue}`);
      }
    } catch (error) {
      console.error('找回密码请求失败:', error);
      message.error('验证失败，请检查输入是否正确');
    } finally {
      setLoading(false);
    }
  };

  const onTabChange = (key: string) => {
    setActiveTab(key);
    form.resetFields();
  };

  // 验证码按钮的渲染
  const renderVerificationCodeButton = () => (
    <Button 
      type="default" 
      disabled={countdown > 0 || sendingCode} 
      loading={sendingCode}
      onClick={handleSendVerificationCode}
      className="verification-code-button"
    >
      {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
    </Button>
  );

  if (success) {
    return (
      <div className="login-container">
        <div className="login-content">
          <div className="login-card">
            <Result
              status="success"
              title="验证成功"
              subTitle="我们已向您发送了重置密码的链接，请查收。"
              extra={[
                <Button type="primary" key="resetPassword" onClick={() => navigate(`/reset-password?token=${resetToken}`)} size="large">
                  重置密码
                </Button>,
                <Button key="login" onClick={() => navigate('/login')} size="large">
                  返回登录
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
              <Link to="/login">
                <ArrowLeftOutlined style={{ fontSize: '16px', marginRight: '10px' }} />
              </Link>
              <Title level={2} className="login-title">找回密码</Title>
            </Space>
            <Paragraph className="login-subtitle">请选择一种方式验证您的身份</Paragraph>
          </div>

          <Tabs activeKey={activeTab} onChange={onTabChange} className="login-tabs">
            <TabPane tab="邮箱验证" key="email">
              <Form
                name="forgot_password_email"
                form={form}
                onFinish={handleSubmit}
                autoComplete="off"
                layout="vertical"
                className="login-form"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '邮箱格式不正确' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="请输入您注册时使用的邮箱" 
                    size="large" 
                  />
                </Form.Item>

                <Form.Item
                  name="verificationCode"
                  rules={[
                    { required: true, message: '请输入验证码' },
                    { pattern: /^\d{6}$/, message: '验证码为6位数字' }
                  ]}
                >
                  <Input 
                    prefix={<SafetyOutlined />}
                    placeholder="请输入验证码" 
                    size="large"
                    suffix={renderVerificationCodeButton()}
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
                    验证
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="手机验证" key="phone">
              <Form
                name="forgot_password_phone"
                form={form}
                onFinish={handleSubmit}
                autoComplete="off"
                layout="vertical"
                className="login-form"
              >
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="请输入您注册时使用的手机号" 
                    size="large" 
                  />
                </Form.Item>

                <Form.Item
                  name="verificationCode"
                  rules={[
                    { required: true, message: '请输入验证码' },
                    { pattern: /^\d{6}$/, message: '验证码为6位数字' }
                  ]}
                >
                  <Input 
                    prefix={<SafetyOutlined />}
                    placeholder="请输入验证码" 
                    size="large"
                    suffix={renderVerificationCodeButton()}
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
                    验证
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>

          <div className="login-options">
            <Space style={{ justifyContent: 'center', width: '100%' }}>
              <Link to="/login">返回登录</Link>
              <span className="separator">|</span>
              <Link to="/register">注册新账号</Link>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 