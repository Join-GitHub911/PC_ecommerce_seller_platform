import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Steps, 
  Button, 
  Typography, 
  message, 
  Spin, 
  Empty, 
  Descriptions,
  Timeline,
  Divider,
  Row,
  Col,
  List,
  Avatar,
  Tag,
  Statistic,
  Alert
} from 'antd';
import { 
  CarOutlined, 
  ShopOutlined, 
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { getOrderById } from '../api/order';
import { getOrderTracking, queryTracking } from '../api/logistics';
import './Logistics.css';

// 导入默认产品图片
import pinliDefaultImage from '../assets/品利1.png';
import deyaDefaultImage from '../assets/德亚酸奶1.png';
import qingbiDefaultImage from '../assets/倩碧1.png';
import iphoneDefaultImage from '../assets/iPhone6s玫瑰金.png';

const { Step } = Steps;
const { Text, Title, Paragraph } = Typography;

// 处理产品图片路径
const getProductImagePath = (imagePath: string | undefined, productName: string = ''): string => {
  // 返回空字符串
  return '';
};

interface TrackingPoint {
  time: string;
  location: string;
  content: string;
}

interface ProductInfo {
  id: string;
  name: string;
  image: string;
  quantity: number;
}

interface TrackingInfo {
  trackingNumber: string;
  trackingCompany: string;
  status: string;
  productInfo?: ProductInfo[];
  traces: TrackingPoint[];
  estimatedDeliveryTime?: string;
  deliveryAddress?: {
    province: string;
    city: string;
    district: string;
    detail: string;
  };
  sourceAddress?: {
    province: string;
    city: string;
    district: string;
    detail: string;
  };
  courierInfo?: {
    name: string;
    phone: string;
  };
}

const Logistics: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [trackingLoading, setTrackingLoading] = useState<boolean>(true);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [directQuery, setDirectQuery] = useState<boolean>(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  
  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
      fetchTrackingInfo(orderId);
    }
  }, [orderId]);
  
  const fetchOrderDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await getOrderById(id);
      if (response?.data?.data) {
        setOrderDetail(response.data.data);
      } else if (response?.data) {
        setOrderDetail(response.data);
      } else {
        message.error('获取订单信息失败');
      }
    } catch (error) {
      message.error('获取订单信息失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTrackingInfo = async (id: string) => {
    try {
      setTrackingLoading(true);
      setTrackingError(null);
      
      const response = await getOrderTracking(id);
      if (response?.data?.data) {
        setTrackingInfo(response.data.data);
      } else if (response?.data) {
        setTrackingInfo(response.data);
      } else {
        message.error('获取物流信息失败');
        setTrackingError('无法获取物流信息，可能订单尚未发货');
      }
    } catch (error) {
      message.error('获取物流信息失败');
      console.error(error);
      setTrackingError('获取物流信息失败，请稍后再试');
    } finally {
      setTrackingLoading(false);
    }
  };
  
  // 添加直接查询物流信息的方法
  const queryLogisticsDirectly = async () => {
    if (!orderDetail?.trackingNumber || !orderDetail?.trackingCompany) {
      message.error('物流单号或物流公司信息不完整');
      return;
    }
    
    try {
      setTrackingLoading(true);
      setTrackingError(null);
      setDirectQuery(true);
      
      const response = await queryTracking(
        orderDetail.trackingNumber,
        orderDetail.trackingCompany
      );
      
      if (response?.data) {
        setTrackingInfo(response.data);
        message.success('成功获取最新物流信息');
      } else {
        message.error('获取物流信息失败');
        setTrackingError('无法从物流服务商获取信息');
      }
    } catch (error) {
      message.error('查询物流信息失败');
      console.error(error);
      setTrackingError('查询物流信息失败，请稍后再试');
    } finally {
      setTrackingLoading(false);
    }
  };
  
  const refreshTracking = () => {
    if (orderId) {
      if (directQuery && orderDetail?.trackingNumber && orderDetail?.trackingCompany) {
        queryLogisticsDirectly();
      } else {
        setTrackingLoading(true);
        fetchTrackingInfo(orderId);
      }
    }
  };
  
  const getStatusStep = (status: string) => {
    if (status === '已送达' || status === 'delivered') return 4;
    if (status === '运输中' || status === 'shipping') return 2;
    return 1;
  };
  
  // 计算预计送达时间的显示
  const renderEstimatedDelivery = () => {
    if (!trackingInfo?.estimatedDeliveryTime) return null;
    
    const estimatedDate = new Date(trackingInfo.estimatedDeliveryTime);
    const now = new Date();
    const diffTime = estimatedDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let statusColor = 'green';
    let statusText = '';
    
    if (diffDays <= 0) {
      statusColor = 'red';
      statusText = '(已超时)';
    } else if (diffDays === 1) {
      statusColor = 'orange';
      statusText = '(即将送达)';
    } else {
      statusText = `(预计${diffDays}天内)`;
    }
    
    return (
      <div className="estimated-delivery">
        <Statistic 
          title="预计送达时间" 
          value={estimatedDate.toLocaleDateString()} 
          prefix={<ClockCircleOutlined />}
          suffix={<Tag color={statusColor}>{statusText}</Tag>}
        />
      </div>
    );
  };
  
  // 渲染快递员信息
  const renderCourierInfo = () => {
    if (!trackingInfo?.courierInfo) return null;
    
    return (
      <div className="courier-info">
        <Descriptions title="配送信息" column={1} size="small" bordered>
          <Descriptions.Item label="快递员">
            <UserOutlined /> {trackingInfo.courierInfo.name}
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            <PhoneOutlined /> {trackingInfo.courierInfo.phone}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };
  
  // 渲染物流查询结果
  const renderTrackingResult = () => {
    if (trackingError) {
      return (
        <Alert
          message="物流查询失败"
          description={trackingError}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
        />
      );
    }
    
    if (!trackingInfo) {
      return (
        <Empty
          description="暂无物流信息"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }
    
    // 现在 trackingInfo 肯定不为 null
    const { trackingCompany, trackingNumber, status, traces, productInfo } = trackingInfo;
    
    return (
      <>
        <div className="tracking-summary">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Descriptions column={{ xs: 1, sm: 2 }} size="small">
                <Descriptions.Item label="物流公司">{trackingCompany}</Descriptions.Item>
                <Descriptions.Item label="运单编号">{trackingNumber}</Descriptions.Item>
                <Descriptions.Item label="物流状态">
                  <Tag color={status === '已送达' ? 'green' : 'blue'}>
                    {status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={12}>
              {renderEstimatedDelivery()}
            </Col>
          </Row>
        </div>
        
        <div className="tracking-progress">
          <Steps current={getStatusStep(status)}>
            <Step title="待揽收" icon={<ShopOutlined />} />
            <Step title="已揽收" icon={<CarOutlined />} />
            <Step title="运输中" icon={<CarOutlined />} />
            <Step title="派送中" icon={<CarOutlined />} />
            <Step title="已送达" icon={<EnvironmentOutlined />} />
          </Steps>
        </div>
        
        {productInfo && productInfo.length > 0 && (
          <>
            <Divider orientation="left">商品信息</Divider>
            <List
              itemLayout="horizontal"
              dataSource={productInfo}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`数量: ${item.quantity}`}
                  />
                </List.Item>
              )}
            />
          </>
        )}
        
        {renderCourierInfo()}
        
        <Divider orientation="left">物流详情</Divider>
        
        <div className="tracking-timeline">
          <Timeline
            mode="left"
            items={traces.map((point, index) => ({
              label: point.time ? new Date(point.time).toLocaleString() : '',
              color: index === 0 ? 'green' : 'blue',
              children: (
                <div className="timeline-item">
                  <Text strong>{point.location}</Text>
                  <Paragraph>{point.content}</Paragraph>
                </div>
              )
            }))}
          />
        </div>
      </>
    );
  };
  
  if (loading) {
    return <div className="loading-container"><Spin size="large" /></div>;
  }
  
  if (!orderDetail) {
    return (
      <Empty
        description="订单不存在或已被删除"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary" onClick={() => navigate('/orders')}>
          返回订单列表
        </Button>
      </Empty>
    );
  }
  
  return (
    <div className="logistics-container">
      <Card className="logistics-header">
        <div className="logistics-title">
          <Title level={4}>物流跟踪</Title>
          <Text type="secondary">订单编号: {orderDetail.orderNumber}</Text>
        </div>
        
        <div className="logistics-actions">
          <Button type="primary" onClick={refreshTracking}>
            刷新物流信息
          </Button>
          <Button onClick={() => navigate(`/order/${orderId}`)}>
            返回订单详情
          </Button>
        </div>
      </Card>
      
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="物流跟踪" className="tracking-card">
            {trackingLoading ? (
              <div className="tracking-loading">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                <Text type="secondary">正在获取最新物流信息...</Text>
              </div>
            ) : renderTrackingResult()}
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="收货信息" className="delivery-info">
            <div className="address-info">
              <p><UserOutlined /> {orderDetail.address?.name || orderDetail.address?.recipientName}</p>
              <p><PhoneOutlined /> {orderDetail.address?.phone || orderDetail.address?.recipientPhone}</p>
              <p><EnvironmentOutlined /> {orderDetail.address?.province} {orderDetail.address?.city} {orderDetail.address?.district} {orderDetail.address?.detail || orderDetail.address?.detailAddress}</p>
            </div>
          </Card>
          
          {trackingInfo && (
            <Card title="物流查询" className="tracking-query">
              <div className="query-options">
                <div className="query-option">
                  <div className="option-icon">
                    <img src="/src/assets/express_icon.png" alt="官网查询" onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/40x40?text=官网'}} />
                  </div>
                  <div className="option-info">
                    <Text strong>官网查询</Text>
                    <Text type="secondary">前往{trackingInfo.trackingCompany}官网查询</Text>
                  </div>
                  <Button type="link" href={`https://www.example.com/tracking?number=${trackingInfo.trackingNumber}`} target="_blank">
                    前往
                  </Button>
                </div>
                
                <Divider />
                
                <div className="query-option">
                  <div className="option-icon">
                    <img src="/src/assets/cainiao_icon.png" alt="菜鸟查询" onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/40x40?text=菜鸟'}} />
                  </div>
                  <div className="option-info">
                    <Text strong>菜鸟查询</Text>
                    <Text type="secondary">前往菜鸟查询物流信息</Text>
                  </div>
                  <Button type="link" href={`https://global.cainiao.com/detail.htm?mailNoList=${trackingInfo.trackingNumber}`} target="_blank">
                    前往
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          <Card title="常见问题" className="faq-card">
            <div className="faq-list">
              <div className="faq-item">
                <Text strong>物流多久能更新？</Text>
                <Paragraph type="secondary">物流信息一般在揽收后24小时内更新，请耐心等待。</Paragraph>
              </div>
              
              <div className="faq-item">
                <Text strong>如何联系快递员？</Text>
                <Paragraph type="secondary">可以通过物流公司客服或APP查询快递员联系方式。</Paragraph>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Logistics; 