import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Button, 
  Steps, 
  Divider, 
  List, 
  Avatar, 
  Tag, 
  message, 
  Modal, 
  Input, 
  Typography, 
  Space,
  Spin,
  Row,
  Col
} from 'antd';
import { 
  ShoppingCartOutlined, 
  CreditCardOutlined, 
  GiftOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined
} from '@ant-design/icons';
import { getOrderById, cancelOrder, confirmReceipt, getOrderTracking } from '../api/order';
import { getProductImagePath } from '../utils/imageUtils';
import './OrderDetail.css';

const { Step } = Steps;
const { Text, Title } = Typography;
const { TextArea } = Input;

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('');

  useEffect(() => {
    if (orderId && orderId !== 'list') {
      fetchOrderDetail(orderId);
      fetchTrackingInfo(orderId);
    } else {
      console.warn('无效的订单ID:', orderId);
      message.error('无效的订单ID');
      navigate('/orders');
    }
  }, [orderId, navigate]);

  const fetchOrderDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await getOrderById(id);
      
      // 处理不同的响应格式
      let apiResponse, orderData;
      
      if (response && response.data) {
        if (response.code !== undefined && response.data !== undefined) {
          // 格式1: response本身就是标准API响应格式
          apiResponse = response;
          orderData = response.data;
        } else if (response.data.code !== undefined && response.data.data !== undefined) {
          // 格式2: response.data是标准API响应格式
          apiResponse = response.data;
          orderData = response.data.data;
        } else {
          // 格式3: response.data直接是订单数据
          orderData = response.data;
          apiResponse = { code: 200, message: 'success', data: orderData };
        }
      }
      
      if (apiResponse?.code === 200 && orderData) {
        setOrderDetail(orderData);
        console.log('获取订单详情成功:', orderData.orderNumber);
      } else {
        console.warn('获取订单详情失败:', response);
        setOrderDetail(null);
        message.error('获取订单详情失败，请稍后重试');
      }
    } catch (error) {
      console.error('获取订单详情出错:', error);
      setOrderDetail(null);
      message.error('获取订单详情失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingInfo = async (id: string) => {
    try {
      const response = await getOrderTracking(id);
      
      // 处理不同的响应格式
      let apiResponse, trackingData;
      
      if (response && response.data) {
        if (response.code !== undefined && response.data !== undefined) {
          // 格式1: response本身就是标准API响应格式
          apiResponse = response;
          trackingData = response.data;
        } else if (response.data.code !== undefined && response.data.data !== undefined) {
          // 格式2: response.data是标准API响应格式
          apiResponse = response.data;
          trackingData = response.data.data;
        } else {
          // 格式3: response.data直接是物流数据
          trackingData = response.data;
          apiResponse = { code: 200, message: 'success', data: trackingData };
        }
      }
      
      if (apiResponse?.code === 200 && trackingData) {
        setTrackingInfo(trackingData);
        console.log('获取物流信息成功:', trackingData.trackingNumber);
      } else if (apiResponse?.code === 400 && apiResponse.message === '订单尚未发货') {
        // 订单未发货是预期的情况，不需要显示错误
        console.log('订单尚未发货，无物流信息');
        setTrackingInfo(null);
      } else {
        console.warn('获取物流信息失败:', response);
        setTrackingInfo(null);
        // 只在订单状态为已发货或已送达时显示错误提示
        if (orderDetail && ['shipping', 'delivered'].includes(orderDetail.status)) {
          message.warning('获取物流信息失败，请稍后重试');
        }
      }
    } catch (error) {
      console.error('获取物流信息出错:', error);
      setTrackingInfo(null);
      // 只在订单状态为已发货或已送达时显示错误提示
      if (orderDetail && ['shipping', 'delivered'].includes(orderDetail.status)) {
        message.warning('获取物流信息失败');
      }
    }
  };

  const handlePayment = () => {
    if (orderId) {
      navigate(`/payment/${orderId}`);
    }
  };

  const showCancelModal = () => {
    setCancelModalVisible(true);
  };

  const handleCancel = async () => {
    if (!cancelReason) {
      message.warning('请填写取消原因');
      return;
    }

    try {
      await cancelOrder(orderId as string, cancelReason);
      message.success('订单取消成功');
      setCancelModalVisible(false);
      setCancelReason('');
      fetchOrderDetail(orderId as string);
    } catch (error) {
      message.error('订单取消失败');
      console.error(error);
    }
  };

  const handleConfirmReceipt = async () => {
    Modal.confirm({
      title: '确认收货',
      content: '确认已收到商品吗？确认后订单将完成。',
      onOk: async () => {
        try {
          await confirmReceipt(orderId as string);
          message.success('确认收货成功');
          fetchOrderDetail(orderId as string);
        } catch (error) {
          message.error('确认收货失败');
          console.error(error);
        }
      }
    });
  };

  const handleAfterSale = () => {
    navigate(`/after-sale/${orderId}`);
  };

  const handleViewLogistics = () => {
    navigate(`/logistics/${orderId}`);
  };

  // 订单状态对应的步骤
  const getOrderStep = (status: string) => {
    const statusMap: Record<string, number> = {
      'pending_payment': 0,
      'paid': 1,
      'shipping': 2,
      'delivered': 3,
      'completed': 4,
      'cancelled': -1,
      'refunding': -2,
      'refunded': -3
    };
    return statusMap[status] || 0;
  };

  const renderOrderStatus = () => {
    if (!orderDetail) return null;
    
    const status = orderDetail.status;
    const step = getOrderStep(status);
    
    if (step < 0) {
      // 特殊状态：已取消/退款中/已退款
      return (
        <div className="special-status">
          {status === 'cancelled' && (
            <div className="cancelled-status">
              <CloseCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
              <Text type="danger">订单已取消</Text>
              <Text type="secondary">取消原因: {orderDetail.cancelReason || '用户取消'}</Text>
            </div>
          )}
          
          {status === 'refunding' && (
            <div className="refunding-status">
              <GiftOutlined style={{ fontSize: 48, color: '#722ed1' }} />
              <Text type="secondary">退款申请处理中</Text>
              <Text type="secondary">申请时间: {new Date(orderDetail.refundAppliedAt).toLocaleString()}</Text>
            </div>
          )}
          
          {status === 'refunded' && (
            <div className="refunded-status">
              <CheckCircleOutlined style={{ fontSize: 48, color: '#eb2f96' }} />
              <Text type="secondary">退款已完成</Text>
              <Text type="secondary">退款时间: {new Date(orderDetail.refundedAt).toLocaleString()}</Text>
            </div>
          )}
        </div>
      );
    }
    
    // 正常订单流程
    return (
      <Steps current={step} className="order-steps">
        <Step title="待付款" icon={<ShoppingCartOutlined />} description={orderDetail.createdAt && new Date(orderDetail.createdAt).toLocaleString()} />
        <Step title="待发货" icon={<CreditCardOutlined />} description={orderDetail.paidAt && new Date(orderDetail.paidAt).toLocaleString()} />
        <Step title="待收货" icon={<CarOutlined />} description={orderDetail.shippedAt && new Date(orderDetail.shippedAt).toLocaleString()} />
        <Step title="已收货" icon={<GiftOutlined />} description={orderDetail.deliveredAt && new Date(orderDetail.deliveredAt).toLocaleString()} />
        <Step title="已完成" icon={<CheckCircleOutlined />} description={orderDetail.completedAt && new Date(orderDetail.completedAt).toLocaleString()} />
      </Steps>
    );
  };

  if (loading) {
    return <div className="loading-container"><Spin size="large" /></div>;
  }
  
  if (!orderDetail) {
    return <div className="not-found">订单不存在或已被删除</div>;
  }

  return (
    <div className="order-detail-container">
      <Card className="order-header">
        <div className="order-title">
          <Title level={4}>订单详情</Title>
          <Text type="secondary">订单编号: {orderDetail.orderNumber}</Text>
        </div>
        
        <div className="order-status">
          <Tag color={
            orderDetail.status === 'completed' ? 'green' : 
            orderDetail.status === 'cancelled' ? 'red' : 
            orderDetail.status === 'pending_payment' ? 'orange' : 
            orderDetail.status === 'shipping' ? 'blue' : 
            orderDetail.status === 'refunding' ? 'purple' : 
            'default'
          }>
            {
              orderDetail.status === 'pending_payment' ? '待付款' : 
              orderDetail.status === 'paid' ? '待发货' : 
              orderDetail.status === 'shipping' ? '待收货' : 
              orderDetail.status === 'delivered' ? '已送达' : 
              orderDetail.status === 'completed' ? '已完成' : 
              orderDetail.status === 'cancelled' ? '已取消' : 
              orderDetail.status === 'refunding' ? '退款中' : 
              orderDetail.status === 'refunded' ? '已退款' : 
              orderDetail.status
            }
          </Tag>
        </div>
      </Card>
      
      <Card className="order-progress">
        {renderOrderStatus()}
      </Card>
      
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="商品信息" className="product-list">
            <List
              itemLayout="horizontal"
              dataSource={orderDetail.items || []}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={`/product/${item.productId}`}>{item.productName || item.name}</a>}
                    description={
                      <div>
                        <Text type="secondary">{item.specifications ? Object.entries(item.specifications).map(([key, value]) => `${key}: ${value}`).join(', ') : (item.sku || '默认规格')}</Text>
                        <div className="item-price">
                          <Text>¥{item.price.toFixed(2)}</Text>
                          <Text type="secondary">x {item.quantity}</Text>
                        </div>
                      </div>
                    }
                  />
                  <div className="item-subtotal">
                    <Text>小计: ¥{(item.price * item.quantity).toFixed(2)}</Text>
                  </div>
                </List.Item>
              )}
            />
            
            <Divider />
            
            <div className="order-total">
              <div className="total-item">
                <Text>商品总价:</Text>
                <Text>¥{orderDetail.subtotal?.toFixed(2)}</Text>
              </div>
              <div className="total-item">
                <Text>运费:</Text>
                <Text>¥{orderDetail.shippingFee?.toFixed(2)}</Text>
              </div>
              {orderDetail.discount > 0 && (
                <div className="total-item">
                  <Text>优惠金额:</Text>
                  <Text type="danger">-¥{orderDetail.discount?.toFixed(2)}</Text>
                </div>
              )}
              <Divider />
              <div className="total-item order-final-total">
                <Text strong>实付金额:</Text>
                <Text strong style={{ fontSize: '18px', color: '#ff4d4f' }}>
                  ¥{orderDetail.totalAmount?.toFixed(2)}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="收货信息" className="delivery-info">
            <div className="address-info">
              <p><UserOutlined /> {orderDetail.address?.recipientName}</p>
              <p><PhoneOutlined /> {orderDetail.address?.recipientPhone}</p>
              <p><EnvironmentOutlined /> {orderDetail.address?.province} {orderDetail.address?.city} {orderDetail.address?.district} {orderDetail.address?.detailAddress}</p>
            </div>
          </Card>
          
          <Card title="订单信息" className="order-info">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="下单时间">{new Date(orderDetail.createdAt).toLocaleString()}</Descriptions.Item>
              {orderDetail.paidAt && (
                <Descriptions.Item label="付款时间">{new Date(orderDetail.paidAt).toLocaleString()}</Descriptions.Item>
              )}
              {orderDetail.shippedAt && (
                <Descriptions.Item label="发货时间">{new Date(orderDetail.shippedAt).toLocaleString()}</Descriptions.Item>
              )}
              {orderDetail.deliveredAt && (
                <Descriptions.Item label="收货时间">{new Date(orderDetail.deliveredAt).toLocaleString()}</Descriptions.Item>
              )}
              {orderDetail.completedAt && (
                <Descriptions.Item label="完成时间">{new Date(orderDetail.completedAt).toLocaleString()}</Descriptions.Item>
              )}
              <Descriptions.Item label="支付方式">{orderDetail.paymentMethod || '-'}</Descriptions.Item>
              <Descriptions.Item label="配送方式">{orderDetail.deliveryMethod || '快递'}</Descriptions.Item>
              {orderDetail.trackingNumber && (
                <Descriptions.Item label="物流单号">{orderDetail.trackingNumber}</Descriptions.Item>
              )}
              {orderDetail.remark && (
                <Descriptions.Item label="订单备注">{orderDetail.remark}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
          
          <Card className="order-actions-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              {orderDetail.status === 'pending_payment' && (
                <>
                  <Button type="primary" block onClick={handlePayment}>
                    立即付款
                  </Button>
                  <Button danger block onClick={showCancelModal}>
                    取消订单
                  </Button>
                </>
              )}
              
              {orderDetail.status === 'shipping' && (
                <Button type="primary" block onClick={handleViewLogistics}>
                  查看物流
                </Button>
              )}
              
              {orderDetail.status === 'delivered' && (
                <>
                  <Button type="primary" block onClick={handleConfirmReceipt}>
                    确认收货
                  </Button>
                  <Button block onClick={handleViewLogistics}>
                    查看物流
                  </Button>
                </>
              )}
              
              {(['completed', 'delivered'].includes(orderDetail.status)) && (
                <Button type="primary" ghost block onClick={handleAfterSale}>
                  申请售后
                </Button>
              )}
              
              <Button block onClick={() => navigate('/orders')}>
                返回订单列表
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
      
      <Modal
        title="取消订单"
        open={cancelModalVisible}
        onOk={handleCancel}
        onCancel={() => {
          setCancelModalVisible(false);
          setCancelReason('');
        }}
      >
        <p>请填写取消原因：</p>
        <TextArea
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="请输入取消订单的原因"
        />
      </Modal>
    </div>
  );
};

export default OrderDetail; 