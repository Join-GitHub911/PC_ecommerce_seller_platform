import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Radio, 
  Button, 
  Descriptions, 
  message, 
  Spin, 
  Result, 
  Typography, 
  Space,
  Modal,
  Divider,
  Row,
  Col,
  Alert
} from 'antd';
import { 
  AlipayCircleOutlined, 
  WechatOutlined, 
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { getOrderById, payOrder, getPaymentStatus, simulatePayment } from '../api/order';
import './Payment.css';

const { Text, Title } = Typography;
const { Group: RadioGroup } = Radio;

const Payment: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('alipay');
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [paymentModalVisible, setPaymentModalVisible] = useState<boolean>(false);
  const [pollingPaymentStatus, setPollingPaymentStatus] = useState<boolean>(false);
  
  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId]);
  
  const fetchOrderDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await getOrderById(id);
      const orderData = response.data.data;
      
      if (orderData.status !== 'pending_payment') {
        message.info('订单状态已更新，正在跳转到订单详情页');
        navigate(`/order/${id}`);
        return;
      }
      
      setOrderDetail(orderData);
    } catch (error) {
      message.error('获取订单信息失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
  };
  
  const handlePayment = async () => {
    try {
      setPaymentModalVisible(true);
      const response = await payOrder(orderId as string, paymentMethod);
      const paymentData = response.data.data;
      startPollingPaymentStatus();
    } catch (error) {
      message.error('支付请求失败');
      console.error(error);
      setPaymentModalVisible(false);
    }
  };
  
  const startPollingPaymentStatus = () => {
    setPollingPaymentStatus(true);
    
    const checkInterval = setInterval(async () => {
      try {
        const response = await getPaymentStatus(orderId as string);
        const status = response.data.data.status;
        
        setPaymentStatus(status);
        
        if (status === 'success' || status === 'failed') {
          clearInterval(checkInterval);
          setPollingPaymentStatus(false);
          
          if (status === 'success') {
            message.success('支付成功');
            setTimeout(() => {
              navigate(`/order/${orderId}`);
            }, 2000);
          }
        }
      } catch (error) {
        console.error('获取支付状态失败', error);
        clearInterval(checkInterval);
        setPollingPaymentStatus(false);
      }
    }, 2000);
  };
  
  const handleSimulatePayment = async () => {
    try {
      await simulatePayment(orderId as string);
      setPaymentStatus('success');
      message.success('支付成功（模拟）');
      setTimeout(() => {
        navigate(`/order/${orderId}`);
      }, 2000);
    } catch (error) {
      message.error('支付失败');
      console.error(error);
    }
  };
  
  const handleCancel = () => {
    setPaymentModalVisible(false);
    setPaymentStatus('pending');
    setPollingPaymentStatus(false);
  };
  
  const renderPaymentModal = () => {
    return (
      <Modal
        title="支付确认"
        open={paymentModalVisible}
        footer={null}
        closable={!pollingPaymentStatus}
        maskClosable={!pollingPaymentStatus}
        onCancel={handleCancel}
        width={500}
      >
        {paymentStatus === 'pending' && (
          <div className="payment-modal-content">
            <div className="payment-qrcode">
              <div className="qrcode-placeholder">
                {pollingPaymentStatus ? (
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                ) : (
                  <img 
                    src="https://via.placeholder.com/200x200?text=Payment+QR+Code" 
                    alt="支付二维码" 
                  />
                )}
              </div>
              <Text type="secondary">
                请使用
                {paymentMethod === 'alipay' 
                  ? '支付宝' 
                  : paymentMethod === 'wechat' 
                    ? '微信' 
                    : '银联'
                }
                扫码支付
              </Text>
            </div>
            
            <Divider />
            
            <div className="payment-info">
              <div className="payment-amount">
                <Text type="secondary">支付金额</Text>
                <Text strong style={{ fontSize: '24px', color: '#ff4d4f' }}>
                  ¥{orderDetail?.totalAmount?.toFixed(2)}
                </Text>
              </div>
              
              <div className="payment-order-number">
                <Text type="secondary">订单编号: {orderDetail?.orderNumber}</Text>
              </div>
            </div>
            
            <Space style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
              <Button onClick={handleCancel} disabled={pollingPaymentStatus}>
                取消支付
              </Button>
              <Button type="primary" onClick={handleSimulatePayment}>
                模拟支付(仅测试)
              </Button>
            </Space>
          </div>
        )}
        
        {paymentStatus === 'success' && (
          <Result
            status="success"
            title="支付成功"
            subTitle={`订单编号: ${orderDetail?.orderNumber}`}
            extra={[
              <Button type="primary" key="detail" onClick={() => navigate(`/order/${orderId}`)}>
                查看订单详情
              </Button>,
              <Button key="home" onClick={() => navigate('/')}>
                返回首页
              </Button>,
            ]}
          />
        )}
        
        {paymentStatus === 'failed' && (
          <Result
            status="error"
            title="支付失败"
            subTitle="请检查您的支付账户或选择其他支付方式重试"
            extra={[
              <Button type="primary" key="retry" onClick={handlePayment}>
                重新支付
              </Button>,
              <Button key="back" onClick={() => navigate(`/order/${orderId}`)}>
                返回订单详情
              </Button>,
            ]}
          />
        )}
      </Modal>
    );
  };
  
  if (loading) {
    return <div className="loading-container"><Spin size="large" /></div>;
  }
  
  if (!orderDetail) {
    return (
      <Result
        status="404"
        title="订单不存在"
        subTitle="您查看的订单不存在或已被删除"
        extra={
          <Button type="primary" onClick={() => navigate('/orders')}>
            返回订单列表
          </Button>
        }
      />
    );
  }

  return (
    <div className="payment-container">
      <Title level={3} className="payment-page-title">订单支付</Title>
      
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="选择支付方式" className="payment-method-card">
            <RadioGroup onChange={handlePaymentMethodChange} value={paymentMethod}>
              <div className="payment-method-options">
                <Radio value="alipay" className="payment-option">
                  <div className="payment-method-logo">
                    <AlipayCircleOutlined style={{ color: '#1677FF', fontSize: '24px' }} />
                    <span className="payment-method-name">支付宝</span>
                  </div>
                </Radio>
                
                <Radio value="wechat" className="payment-option">
                  <div className="payment-method-logo">
                    <WechatOutlined style={{ color: '#07C160', fontSize: '24px' }} />
                    <span className="payment-method-name">微信支付</span>
                  </div>
                </Radio>
                
                <Radio value="unionpay" className="payment-option">
                  <div className="payment-method-logo">
                    <CreditCardOutlined style={{ color: '#D9232E', fontSize: '24px' }} />
                    <span className="payment-method-name">银联支付</span>
                  </div>
                </Radio>
              </div>
            </RadioGroup>
            
            <Alert
              message="测试环境提示"
              description="当前为测试环境，可使用模拟支付按钮来模拟支付过程，无需真实付款。"
              type="info"
              showIcon
              style={{ marginTop: '16px' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="订单信息" className="order-summary-card">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="订单编号">{orderDetail.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{new Date(orderDetail.createdAt).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="商品数量">{orderDetail.items?.length || 0} 件</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <div className="order-price-summary">
              <div className="price-item">
                <Text>商品总价:</Text>
                <Text>¥{orderDetail.subtotal?.toFixed(2)}</Text>
              </div>
              <div className="price-item">
                <Text>运费:</Text>
                <Text>¥{orderDetail.shippingFee?.toFixed(2)}</Text>
              </div>
              {orderDetail.discount > 0 && (
                <div className="price-item">
                  <Text>优惠金额:</Text>
                  <Text type="danger">-¥{orderDetail.discount?.toFixed(2)}</Text>
                </div>
              )}
              <Divider />
              <div className="price-item total-price">
                <Text strong>应付金额:</Text>
                <Text strong style={{ fontSize: '20px', color: '#ff4d4f' }}>
                  ¥{orderDetail.totalAmount?.toFixed(2)}
                </Text>
              </div>
            </div>
            
            <div className="payment-actions">
              <Button type="primary" size="large" block onClick={handlePayment}>
                立即支付
              </Button>
              <Button block onClick={() => navigate(`/order/${orderId}`)} style={{ marginTop: '8px' }}>
                返回订单详情
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      
      {renderPaymentModal()}
    </div>
  );
};

export default Payment; 