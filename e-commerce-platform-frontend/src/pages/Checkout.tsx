import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Button,
  Steps,
  Form,
  Input,
  Radio,
  Space,
  Select,
  Table,
  message,
  Spin,
  Tag
} from 'antd';
import { ShoppingOutlined, EnvironmentOutlined, CreditCardOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

// 模拟结账商品数据
const mockCheckoutItems = [
  {
    id: '1',
    productId: 'p1',
    productName: '智能手机 Pro',
    price: 4999,
    quantity: 1,
    image: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: '2',
    productId: 'p2',
    productName: '无线蓝牙耳机',
    price: 299,
    quantity: 2,
    image: 'https://picsum.photos/200/200?random=2',
  }
];

// 模拟地址数据
const mockAddresses = [
  {
    id: '1',
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    address: '科技园路1号',
    isDefault: true
  },
  {
    id: '2',
    name: '李四',
    phone: '13900139000',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    address: '天河路12号',
    isDefault: false
  }
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('alipay');
  const [remark, setRemark] = useState('');

  // 模拟加载结算商品
  useEffect(() => {
    const loadCheckoutItems = async () => {
      setLoading(true);
      try {
        // 在实际项目中，应该从sessionStorage获取选中的购物车商品ID，然后调用API获取详情
        // 这里使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 800));
        setCheckoutItems(mockCheckoutItems);
        setAddresses(mockAddresses);
        
        // 默认选择默认地址
        const defaultAddress = mockAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        }
      } catch (error) {
        console.error('加载结算商品失败:', error);
        message.error('加载结算商品失败，请返回购物车重试');
      } finally {
        setLoading(false);
      }
    };
    
    loadCheckoutItems();
  }, []);

  // 计算总价
  const calculateTotal = () => {
    return checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // 提交订单
  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      message.warning('请选择收货地址');
      return;
    }

    try {
      setLoading(true);
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 在实际项目中，这里应该调用创建订单的API
      message.success('订单创建成功，即将跳转到支付页面');
      
      // 前进到支付步骤
      setCurrentStep(1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('创建订单失败:', error);
      message.error('创建订单失败，请稍后重试');
    }
  };

  // 处理支付
  const handlePayment = async () => {
    try {
      setLoading(true);
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 在实际项目中，这里应该调用支付API，然后重定向到支付网关
      message.success('支付成功！');
      
      // 前进到完成步骤
      setCurrentStep(2);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('支付失败:', error);
      message.error('支付失败，请稍后重试');
    }
  };

  // 返回购物车
  const handleReturnToCart = () => {
    navigate('/cart');
  };

  // 去订单中心
  const handleGoToOrders = () => {
    navigate('/user/orders');
  };

  // 返回首页
  const handleGoToHome = () => {
    navigate('/');
  };

  // 表格列配置
  const columns = [
    {
      title: '商品',
      dataIndex: 'product',
      key: 'product',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={record.image} 
            alt={record.productName} 
            style={{ width: 60, height: 60, marginRight: 10 }} 
          />
          <div>{record.productName}</div>
        </div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (_: any, record: any) => `¥${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  // 结算信息步骤
  const renderOrderConfirmation = () => (
    <div>
      <Card title="确认订单信息" style={{ marginBottom: 20 }}>
        <Table
          dataSource={checkoutItems}
          columns={columns}
          pagination={false}
          rowKey="id"
        />
      </Card>

      <Card title="收货地址" style={{ marginBottom: 20 }}>
        <Radio.Group 
          value={selectedAddress} 
          onChange={e => setSelectedAddress(e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {addresses.map(addr => (
              <Radio key={addr.id} value={addr.id}>
                <Card size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Text strong>{addr.name}</Text>
                      <Text style={{ marginLeft: 8 }}>{addr.phone}</Text>
                      {addr.isDefault && <Tag color="blue" style={{ marginLeft: 8 }}>默认</Tag>}
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {addr.province} {addr.city} {addr.district} {addr.address}
                  </div>
                </Card>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
        <Button type="link" style={{ padding: '10px 0' }}>
          <PlusOutlined /> 添加新地址
        </Button>
      </Card>

      <Card title="支付方式" style={{ marginBottom: 20 }}>
        <Radio.Group value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <Space direction="vertical">
            <Radio value="alipay">支付宝</Radio>
            <Radio value="wechat">微信支付</Radio>
            <Radio value="credit">银联支付</Radio>
          </Space>
        </Radio.Group>
      </Card>

      <Card title="订单备注" style={{ marginBottom: 20 }}>
        <TextArea 
          rows={4} 
          placeholder="有什么特殊要求可以在这里告诉我们"
          value={remark}
          onChange={e => setRemark(e.target.value)}
        />
      </Card>

      <Card>
        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: 10 }}>
            <Text>商品总计：</Text>
            <Text strong style={{ fontSize: 16 }}>¥{calculateTotal().toFixed(2)}</Text>
          </div>
          <div style={{ marginBottom: 10 }}>
            <Text>运费：</Text>
            <Text strong style={{ fontSize: 16 }}>¥0.00</Text>
          </div>
          <Divider />
          <div style={{ marginBottom: 20 }}>
            <Text>实付款：</Text>
            <Text type="danger" style={{ fontSize: 24 }}>¥{calculateTotal().toFixed(2)}</Text>
          </div>
          <Space>
            <Button onClick={handleReturnToCart}>返回购物车</Button>
            <Button type="primary" size="large" onClick={handleSubmitOrder}>
              提交订单
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );

  // 支付步骤
  const renderPayment = () => (
    <Card style={{ textAlign: 'center', padding: '40px 0' }}>
      <Title level={3}>订单提交成功，请尽快完成支付</Title>
      <Title level={2} type="danger">¥{calculateTotal().toFixed(2)}</Title>
      
      <div style={{ margin: '30px 0' }}>
        <Text>订单号：1234567890</Text>
        <br />
        <Text>支付方式：{paymentMethod === 'alipay' ? '支付宝' : paymentMethod === 'wechat' ? '微信支付' : '银联支付'}</Text>
      </div>
      
      <div style={{ margin: '30px 0' }}>
        {paymentMethod === 'alipay' && (
          <div>
            <img 
              src="https://picsum.photos/200/200?random=10" 
              alt="支付宝二维码" 
              style={{ width: 200, height: 200 }} 
            />
            <div style={{ marginTop: 10 }}>请使用支付宝扫描二维码完成支付</div>
          </div>
        )}
        
        {paymentMethod === 'wechat' && (
          <div>
            <img 
              src="https://picsum.photos/200/200?random=11" 
              alt="微信支付二维码" 
              style={{ width: 200, height: 200 }} 
            />
            <div style={{ marginTop: 10 }}>请使用微信扫描二维码完成支付</div>
          </div>
        )}
        
        {paymentMethod === 'credit' && (
          <div>
            <Button type="primary" size="large">前往银联支付</Button>
          </div>
        )}
      </div>
      
      <Button type="primary" size="large" onClick={handlePayment} style={{ marginTop: 20 }}>
        模拟完成支付
      </Button>
    </Card>
  );

  // 支付成功步骤
  const renderComplete = () => (
    <Card style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ marginBottom: 20 }}>
        <CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />
      </div>
      <Title level={2}>支付成功</Title>
      <Text style={{ fontSize: 16 }}>感谢您的购买！您的订单已支付成功</Text>
      
      <div style={{ margin: '40px 0' }}>
        <Space size="large">
          <Button type="primary" onClick={handleGoToOrders}>
            查看订单
          </Button>
          <Button onClick={handleGoToHome}>
            返回首页
          </Button>
        </Space>
      </div>
    </Card>
  );

  const steps = [
    {
      title: '确认订单',
      icon: <ShoppingOutlined />,
      content: renderOrderConfirmation,
    },
    {
      title: '支付',
      icon: <CreditCardOutlined />,
      content: renderPayment,
    },
    {
      title: '完成',
      icon: <CheckCircleOutlined />,
      content: renderComplete,
    },
  ];

  if (loading && checkoutItems.length === 0) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 50px' }}>
      <Title level={2}>订单结算</Title>
      <Divider />
      
      <Steps current={currentStep} style={{ marginBottom: 30 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>
      
      {steps[currentStep].content()}
    </div>
  );
};

export default Checkout; 