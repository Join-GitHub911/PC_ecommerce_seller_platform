import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Tabs, 
  Row, 
  Col, 
  Divider,
  Typography,
  Space,
  Checkbox
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  PhoneOutlined,
  EyeInvisibleOutlined, 
  EyeTwoTone,
  CheckCircleOutlined,
  WechatOutlined,
  AlipayOutlined,
  WeiboOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { register, sendPhoneVerificationCode, sendEmailVerificationCode } from '../api/auth';
import { isValidResponse } from '../api/responseFormat';
import '../styles/Register.css';

const { Title, Paragraph, Text } = Typography;

interface RegisterFormValues {
  username?: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  verificationCode?: string;
  agreement: boolean;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [activeTab, setActiveTab] = useState('username');
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
        const response = await sendPhoneVerificationCode(phone);
        
        // 使用统一响应验证
        if (!isValidResponse(response)) {
          throw new Error('发送验证码响应格式错误');
        }
        
        if (response.code === 200) {
          message.success('验证码已发送至您的手机');
          startCountdown();
        } else {
          throw new Error(response.message || '发送验证码失败');
        }
      } else {
        const email = form.getFieldValue('email');
        const response = await sendEmailVerificationCode(email);
        
        // 使用统一响应验证
        if (!isValidResponse(response)) {
          throw new Error('发送验证码响应格式错误');
        }
        
        if (response.code === 200) {
          message.success('验证码已发送至您的邮箱');
          startCountdown();
        } else {
          throw new Error(response.message || '发送验证码失败');
        }
      }
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      message.error(error.message || '发送验证码失败，请检查输入是否正确');
    } finally {
      setSendingCode(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    if (!values.agreement) {
      message.error('请阅读并同意用户协议');
      return;
    }
    
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      // 构建注册数据，确保至少有一个识别字段 (username, email, phone)
      let registerData: any = {
        password: values.password,
      };
      
      // 根据当前激活的标签页添加必要字段
      if (activeTab === 'username') {
        registerData.username = values.username || '';
        // 确保用户名不为空
        if (!registerData.username || registerData.username.trim() === '') {
          throw new Error('用户名不能为空');
        }
      } else if (activeTab === 'email') {
        registerData.email = values.email || '';
        registerData.username = `user_${Math.random().toString(36).substring(2, 8)}`;
        registerData.verificationCode = values.verificationCode;
      } else if (activeTab === 'phone') {
        registerData.phone = values.phone || '';
        registerData.username = `user_${Math.random().toString(36).substring(2, 8)}`;
        registerData.verificationCode = values.verificationCode;
      }

      console.log('注册数据:', registerData);

      const response = await register(registerData);
      console.log('完整注册响应:', response);
      
      // 使用统一响应验证
      if (!isValidResponse(response)) {
        throw new Error('注册响应格式错误');
      }
      
      if (response.code === 200 && response.data && response.data.token) {
        message.success('注册成功！即将自动登录...');
        
        // 触发自定义事件，通知其他组件登录状态已改变
        window.dispatchEvent(new Event('login-status-change'));
        
        // 跳转到首页而不是登录页
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        throw new Error(response.message || '注册失败，未知错误');
      }
    } catch (error: any) {
      console.error('注册失败:', error);
      message.error(error.message || '注册失败，请检查输入是否正确或换一个用户名');
    } finally {
      setLoading(false);
    }
  };

  const onTabChange = (key: string) => {
    setActiveTab(key);
    form.resetFields();
  };

  // 定义 Tabs 的 items 属性
  const tabItems = [
    {
      key: 'username',
      label: '用户名注册',
      children: (
        <Form
          name="register_username"
          form={form}
          onFinish={handleRegister}
          autoComplete="off"
          layout="vertical"
          className="register-form"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 4, message: '用户名至少4个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入用户名" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认密码' },
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
              placeholder="请确认密码"
              size="large"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议')) },
            ]}
          >
            <Checkbox>
              我已阅读并同意 <Link to="/terms">用户协议</Link> 和 <Link to="/privacy">隐私政策</Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'phone',
      label: '手机号注册',
      children: (
        <Form
          name="register_phone"
          form={form}
          onFinish={handleRegister}
          autoComplete="off"
          layout="vertical"
          className="register-form"
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
              placeholder="请输入手机号" 
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
            <div style={{ display: 'flex' }}>
              <Input 
                placeholder="请输入验证码" 
                size="large"
                style={{ flex: 1 }}
              />
              <Button 
                type="primary" 
                disabled={countdown > 0 || sendingCode} 
                loading={sendingCode}
                onClick={handleSendVerificationCode}
                className="verification-code-button"
              >
                {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认密码' },
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
              placeholder="请确认密码"
              size="large"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议')) },
            ]}
          >
            <Checkbox>
              我已阅读并同意 <Link to="/terms">用户协议</Link> 和 <Link to="/privacy">隐私政策</Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'email',
      label: '邮箱注册',
      children: (
        <Form
          name="register_email"
          form={form}
          onFinish={handleRegister}
          autoComplete="off"
          layout="vertical"
          className="register-form"
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
              placeholder="请输入邮箱" 
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
            <div style={{ display: 'flex' }}>
              <Input 
                placeholder="请输入验证码" 
                size="large"
                style={{ flex: 1 }}
              />
              <Button 
                type="primary" 
                disabled={countdown > 0 || sendingCode} 
                loading={sendingCode}
                onClick={handleSendVerificationCode}
                className="verification-code-button"
              >
                {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认密码' },
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
              placeholder="请确认密码"
              size="large"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议')) },
            ]}
          >
            <Checkbox>
              我已阅读并同意 <Link to="/terms">用户协议</Link> 和 <Link to="/privacy">隐私政策</Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ];

  return (
    <div className="register-container">
      {/* 左侧会员权益区域 */}
      <div className="register-left">
        <div className="register-benefits">
          <h2>尤洪会员专享权益</h2>
          <ul>
            <li><CheckCircleOutlined /> 新人首单立减50元</li>
            <li><CheckCircleOutlined /> 会员专享优惠券包</li>
            <li><CheckCircleOutlined /> 生日特权双倍积分</li>
            <li><CheckCircleOutlined /> 专属客服7×24小时服务</li>
            <li><CheckCircleOutlined /> VIP会员专享价格</li>
            <li><CheckCircleOutlined /> 每月会员日特别优惠</li>
          </ul>
        </div>
      </div>
      
      {/* 右侧注册表单 */}
      <div className="register-right">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-container">
              <span className="you-text">尤</span>
              <span className="hong-text">洪</span>
            </div>
          </div>
          <Title level={2} className="login-title">加入尤洪</Title>
          <Paragraph className="login-subtitle">成为会员，享受专属优惠</Paragraph>
        </div>

        <Tabs activeKey={activeTab} onChange={onTabChange} className="login-tabs" items={tabItems} />
        
        <div className="register-form-option">
          <span>已有账号？<Link to="/login">立即登录</Link></span>
        </div>
        
        <Divider className="register-divider">其他方式登录</Divider>
        
        <div className="third-party-login">
          <div className="third-party-login-item">
            <div className="icon-wrapper wechat">
              <WechatOutlined />
            </div>
            <span>微信</span>
          </div>
          <div className="third-party-login-item">
            <div className="icon-wrapper alipay">
              <AlipayOutlined />
            </div>
            <span>支付宝</span>
          </div>
          <div className="third-party-login-item">
            <div className="icon-wrapper weibo">
              <WeiboOutlined />
            </div>
            <span>微博</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 