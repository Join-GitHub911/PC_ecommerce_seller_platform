import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { 
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  YoutubeOutlined 
} from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const AppFooter: React.FC = () => {
  return (
    <Footer style={{ background: '#001529', color: '#fff', padding: '40px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <Row gutter={[40, 40]}>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Title level={4} style={{ color: '#fff' }}>电商平台</Title>
            <Text style={{ color: '#ccc' }}>
              专业的电子商务平台，为您提供优质的购物体验。我们致力于为客户提供高品质的商品和卓越的服务。
            </Text>
            <Space direction="vertical" style={{ marginTop: 20 }}>
              <Space>
                <EnvironmentOutlined /> 
                <Text style={{ color: '#ccc' }}>北京市朝阳区</Text>
              </Space>
              <Space>
                <PhoneOutlined /> 
                <Text style={{ color: '#ccc' }}>400-123-4567</Text>
              </Space>
              <Space>
                <MailOutlined /> 
                <Text style={{ color: '#ccc' }}>support@ecommerce.com</Text>
              </Space>
            </Space>
          </Col>

          <Col xs={12} sm={12} md={8} lg={6}>
            <Title level={4} style={{ color: '#fff' }}>快速链接</Title>
            <Space direction="vertical">
              <Link href="/" style={{ color: '#ccc' }}>首页</Link>
              <Link href="/products" style={{ color: '#ccc' }}>商品</Link>
              <Link href="/categories" style={{ color: '#ccc' }}>分类</Link>
              <Link href="/about" style={{ color: '#ccc' }}>关于我们</Link>
              <Link href="/contact" style={{ color: '#ccc' }}>联系我们</Link>
            </Space>
          </Col>

          <Col xs={12} sm={12} md={8} lg={6}>
            <Title level={4} style={{ color: '#fff' }}>帮助中心</Title>
            <Space direction="vertical">
              <Link href="/faq" style={{ color: '#ccc' }}>常见问题</Link>
              <Link href="/shipping" style={{ color: '#ccc' }}>配送信息</Link>
              <Link href="/returns" style={{ color: '#ccc' }}>退换货政策</Link>
              <Link href="/privacy" style={{ color: '#ccc' }}>隐私政策</Link>
              <Link href="/terms" style={{ color: '#ccc' }}>使用条款</Link>
            </Space>
          </Col>

          <Col xs={24} sm={24} md={8} lg={6}>
            <Title level={4} style={{ color: '#fff' }}>关注我们</Title>
            <Space size="large">
              <FacebookOutlined style={{ fontSize: 24, color: '#ccc' }} />
              <TwitterOutlined style={{ fontSize: 24, color: '#ccc' }} />
              <InstagramOutlined style={{ fontSize: 24, color: '#ccc' }} />
              <YoutubeOutlined style={{ fontSize: 24, color: '#ccc' }} />
            </Space>
            <div style={{ marginTop: 20 }}>
              <Title level={5} style={{ color: '#fff' }}>订阅我们的通讯</Title>
              <div style={{ display: 'flex', marginTop: 10 }}>
                <input 
                  type="email" 
                  placeholder="您的电子邮箱" 
                  style={{ 
                    padding: '8px 12px', 
                    border: 'none', 
                    borderRadius: '4px 0 0 4px', 
                    width: '70%' 
                  }} 
                />
                <button 
                  style={{ 
                    background: '#1890ff', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '8px 12px', 
                    borderRadius: '0 4px 4px 0', 
                    cursor: 'pointer' 
                  }}
                >
                  订阅
                </button>
              </div>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#333', margin: '24px 0' }} />
        
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#ccc' }}>© {new Date().getFullYear()} 电商平台 保留所有权利</Text>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter; 