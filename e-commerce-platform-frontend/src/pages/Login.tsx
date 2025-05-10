import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Checkbox, 
  message, 
  Row, 
  Col, 
  Tabs, 
  Divider, 
  Space, 
  Typography, 
  Carousel 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MobileOutlined, 
  MailOutlined,
  SafetyOutlined, 
  EyeTwoTone,
  EyeInvisibleOutlined,
  WechatOutlined,
  QqOutlined,
  WeiboOutlined,
  FireOutlined
} from '@ant-design/icons';
import { login, sendPhoneVerificationCode, phoneLogin, isAuthenticated } from '../api/auth';
import { isValidResponse } from '../api/responseFormat';
import '../styles/Login.css';

// 导入一些模拟产品图像
import product1 from '../assets/product1.png';
import product2 from '../assets/product2.png';

const { Title, Paragraph } = Typography;

// 定义登录类型
type LoginType = 'account' | 'phone' | 'email';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loginType, setLoginType] = useState<LoginType>('account');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // 获取重定向地址，如果有的话
  const from = location.state?.from?.pathname || "/";

  // 处理验证码倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // 检查是否已经登录
    if (isAuthenticated()) {
      message.success('您已登录，正在跳转...');
      navigate(from, { replace: true });
      return;
    }

    // 检查是否有存储的用户名和密码
    const lastLoginType = localStorage.getItem('lastLoginType') || 'account';
    if (lastLoginType) {
      setLoginType(lastLoginType as LoginType);
    }
    
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPhone = localStorage.getItem('rememberedPhone');
    
    if (savedUsername && savedPassword) {
      form.setFieldsValue({
        username: savedUsername,
        password: atob(savedPassword), // 使用base64解码
        rememberMe: true
      });
    } else if (savedEmail) {
      form.setFieldsValue({
        email: savedEmail,
        rememberMe: true
      });
    } else if (savedPhone) {
      form.setFieldsValue({
        phone: savedPhone,
        rememberMe: true
      });
    }
    
    // 如果还存储了自动登录，可以在此处理
    const autoLoginSaved = localStorage.getItem('autoLogin') === 'true';
    if (autoLoginSaved && savedUsername && savedPassword) {
      handleAutoLogin(savedUsername, atob(savedPassword));
    }
  }, [form, navigate, from]);

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
      await form.validateFields(['phone']);
      const phone = form.getFieldValue('phone');
      
      setSendingCode(true);
      await sendPhoneVerificationCode(phone);
      message.success('验证码已发送至您的手机');
      startCountdown();
    } catch (error) {
      console.error('发送验证码失败:', error);
      message.error('发送验证码失败，请检查手机号');
    } finally {
      setSendingCode(false);
    }
  };

  // 自动登录处理
  const handleAutoLogin = async (username: string, password: string) => {
    try {
      setLoading(true);
      await login({ username, password });
      
      message.success('自动登录成功，正在跳转...');
      // 清除登录失败计数
      sessionStorage.removeItem('loginFailCount');
      
      // 重定向到指定页面或首页
      setTimeout(() => {
        navigate(from);
      }, 1000);
    } catch (error) {
      console.error('自动登录失败:', error);
      // 不显示自动登录失败消息，静默失败
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      let response;
      if (loginType === 'phone' && values.verificationCode) {
        // 手机验证码登录
        response = await phoneLogin(values.phone, values.verificationCode);
      } else {
        // 账号密码登录
        const loginData: any = { password: values.password };
        
        if (loginType === 'account') {
          loginData.username = values.username;
        } else if (loginType === 'email') {
          loginData.email = values.email;
        }
        
        response = await login(loginData);
      }

      console.log('完整登录响应:', response);
      
      // 使用通用验证方法
      if (!isValidResponse(response)) {
        throw new Error('登录响应格式错误');
      }
      
      // 登录成功处理
      if (response.code === 200) {
        message.success('登录成功！');
        
        // 触发自定义事件，通知其他组件登录状态已改变
        window.dispatchEvent(new Event('login-status-change'));
        
        // 如果勾选了"记住我"，保存登录信息
        if (values.rememberMe) {
          localStorage.setItem('lastLoginType', loginType);
          
          if (loginType === 'account') {
            localStorage.setItem('rememberedUsername', values.username);
            localStorage.setItem('rememberedPassword', btoa(values.password));
          } else if (loginType === 'email') {
            localStorage.setItem('rememberedEmail', values.email);
          } else if (loginType === 'phone') {
            localStorage.setItem('rememberedPhone', values.phone);
          }
          
          if (values.autoLogin) {
            localStorage.setItem('autoLogin', 'true');
          }
        } else {
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPhone');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('autoLogin');
        }
        
        // 使用 setTimeout 确保状态更新后再跳转
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 300);
      } else {
        // 登录失败但响应格式正确
        throw new Error(response.message || '登录失败，未知错误');
      }
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(error.message || '登录失败，请检查输入信息');
    } finally {
      setLoading(false);
    }
  };

  const onTabChange = (key: string) => {
    setLoginType(key as LoginType);
    form.resetFields();
  };

  // 渲染验证码按钮
  const renderVerificationCodeButton = () => (
    <Button 
      type="link" 
      size="small"
      disabled={countdown > 0 || sendingCode} 
      loading={sendingCode}
      onClick={handleSendVerificationCode}
    >
      {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
    </Button>
  );

  // 定义 Tabs 的 items 属性
  const tabItems = [
    {
      key: 'account',
      label: '账号密码登录',
      children: (
        <Form
          name="login_account"
          form={form}
          onFinish={onFinish}
          initialValues={{ rememberMe: true }}
          autoComplete="off"
          layout="vertical"
          className="login-form"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名/手机号/邮箱' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名/手机号/邮箱"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item className="login-options">
            <Row justify="space-between" align="middle">
              <Col>
                <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Link to="/forgot-password" className="forgot-password">
                  忘记密码?
                </Link>
              </Col>
            </Row>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              block
              loading={loading}
              className="login-button"
            >
              登录
            </Button>
          </Form.Item>
          
          <Form.Item>
            <div className="login-links">
              <span>还没有账号？</span>
              <Link to="/register" className="register-link">立即注册</Link>
            </div>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'phone',
      label: '手机验证码登录',
      children: (
        <Form
          name="login_phone"
          form={form}
          onFinish={onFinish}
          initialValues={{ rememberMe: true }}
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
              prefix={<MobileOutlined />}
              placeholder="手机号"
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
              placeholder="验证码"
              size="large"
              suffix={renderVerificationCodeButton()}
            />
          </Form.Item>
          
          <Form.Item className="login-options">
            <Row justify="space-between" align="middle">
              <Col>
                <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Link to="/forgot-password" className="forgot-password">
                  忘记密码?
                </Link>
              </Col>
            </Row>
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary" 
              htmlType="submit" 
              size="large"
              block
              loading={loading}
              className="login-button"
            >
              登录
            </Button>
          </Form.Item>
          
          <Form.Item>
            <div className="login-links">
              <span>还没有账号？</span>
              <Link to="/register" className="register-link">立即注册</Link>
            </div>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'email',
      label: '邮箱登录',
      children: (
        <Form
          name="login_email"
          form={form}
          onFinish={onFinish}
          initialValues={{ rememberMe: true }}
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
              placeholder="邮箱"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item className="login-options">
            <Row justify="space-between" align="middle">
              <Col>
                <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Link to="/forgot-password" className="forgot-password">
                  忘记密码?
                </Link>
              </Col>
            </Row>
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="login-button"
            >
              登录
            </Button>
          </Form.Item>
          
          <Form.Item>
            <div className="login-links">
              <span>还没有账号？</span>
              <Link to="/register" className="register-link">立即注册</Link>
            </div>
          </Form.Item>
        </Form>
      )
    }
  ];

  return (
    <div className="login-container">
      <div className="login-content">
        <Row className="login-row" gutter={0}>
          {/* 登录页左侧Banner */}
          <Col xs={0} sm={0} md={12} lg={14} xl={16} className="login-banner">
            <div className="banner-content">
              <div className="banner-text">
                <div className="flash-sale-tag">
                  <FireOutlined /> 限时优惠
                </div>
                <h2>专属会员专享礼遇</h2>
                <p>每月惊喜好礼，享受专属会员特权，更多优惠随时掌握</p>
                
                {/* 热门商品轮播 */}
                <div className="hot-products-carousel">
                  <div className="carousel-title">
                    <FireOutlined /> 热门商品
                  </div>
                  <Carousel autoplay className="product-carousel">
                    <div>
                      <div className="carousel-item">
                        <div className="product-card">
                          <div className="product-image">
                            <img src={product1} alt="Product 1" />
                            <div className="product-discount">-20%</div>
                          </div>
                          <div className="product-info">
                            <div className="product-name">高级无线耳机</div>
                            <div className="product-price">¥499</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="carousel-item">
                        <div className="product-card">
                          <div className="product-image">
                            <img src={product2} alt="Product 2" />
                            <div className="product-discount">-15%</div>
                          </div>
                          <div className="product-info">
                            <div className="product-name">智能手表 2023款</div>
                            <div className="product-price">¥799</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Carousel>
                </div>
                
                {/* 会员特权 */}
                <div className="member-benefits">
                  <div className="benefit-item">
                    <div className="benefit-icon">🎁</div>
                    <div className="benefit-text">生日好礼</div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">🔥</div>
                    <div className="benefit-text">专享折扣</div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">🚚</div>
                    <div className="benefit-text">免费配送</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          
          {/* 登录表单区域 */}
          <Col xs={24} sm={24} md={12} lg={10} xl={8} className="login-form-column">
            <div className="login-card">
              <div className="login-header">
                <div className="login-logo">
                  <div className="logo-container">
                    <span className="you-text">尤</span>
                    <span className="hong-text">洪</span>
                  </div>
                </div>
                <Title level={2} className="login-title">欢迎回来</Title>
                <Paragraph className="login-subtitle">登录您的账号以继续</Paragraph>
              </div>
              
              <Tabs activeKey={loginType} onChange={onTabChange} className="login-tabs" items={tabItems} />
              
              <Divider className="login-divider">
                <span>其他登录方式</span>
              </Divider>
              
              <div className="third-party-login">
                <Button 
                  type="link" 
                  icon={<WechatOutlined className="wechat-icon" />} 
                  className="third-party-button"
                >
                  微信登录
                </Button>
                <Button 
                  type="link" 
                  icon={<QqOutlined className="qq-icon" />} 
                  className="third-party-button"
                >
                  QQ登录
                </Button>
                <Button 
                  type="link" 
                  icon={<WeiboOutlined className="weibo-icon" />} 
                  className="third-party-button"
                >
                  微博登录
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;