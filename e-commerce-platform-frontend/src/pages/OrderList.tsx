import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Tabs, message, Modal, Input, Spin, Badge, Row, Col, Input as AntdInput, Pagination, Empty } from 'antd';
import { getUserOrders, cancelOrder } from '../api/order';
import { useNavigate } from 'react-router-dom';
import type { TabsProps } from 'antd';
import { getProductImagePath } from '../utils/imageUtils';
import { 
  ShoppingOutlined, 
  ShoppingCartOutlined, 
  HeartOutlined, 
  SearchOutlined,
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  InboxOutlined,
  WalletOutlined,
  CommentOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  CarOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';
import './OrderList.css';
import SmartSearch from '../components/SmartSearch';

const { TextArea } = Input;
const { Search } = AntdInput;

// 订单状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  'pending_payment': { color: 'orange', text: '待支付' },
  'paid': { color: 'geekblue', text: '已支付' },
  'shipping': { color: 'blue', text: '已发货' },
  'delivered': { color: 'cyan', text: '已送达' },
  'completed': { color: 'green', text: '已完成' },
  'cancelled': { color: 'red', text: '已取消' },
  'refunding': { color: 'purple', text: '退款中' },
  'refunded': { color: 'magenta', text: '已退款' }
};

// 订单项目接口
interface OrderItem {
  id: string;
  productId: string;
  productName?: string;
  name?: string;
  price: number;
  quantity: number;
  productImage?: string;
  image?: string;
  attributes?: Record<string, string>;
  sku?: string;
}

// 订单接口
interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  paymentId?: string;
  shippingAddress?: any;
  billingAddress?: any;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  discount?: number;
  tax?: number;
  cancelReason?: string;
  refundAppliedAt?: string;
  refundedAt?: string;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [pendingPaymentCount, setPendingPaymentCount] = useState<number>(0);
  const [pendingReceiptCount, setPendingReceiptCount] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchParams, setSearchParams] = useState<any>({});
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  const navigate = useNavigate();
  const userId = 'current_user_id'; // 用户ID，通常从认证状态获取

  const fetchOrders = async (status: string = '') => {
    setLoading(true);
    try {
      const params = status && status !== 'all' ? { status } : {};
      
      if (Object.keys(searchParams).length > 0) {
        Object.assign(params, searchParams);
      }
      
      const response = await getUserOrders(params);
      
      if (response && response.data) {
        const orderData = response.data.data || [] as Order[];
        setOrders(orderData);
        
        // 计算待付款和待收货订单数量
        const pending = orderData.filter((order: Order) => order.status === 'pending_payment').length;
        const shipping = orderData.filter((order: Order) => order.status === 'shipping').length;
        
        setPendingPaymentCount(pending);
        setPendingReceiptCount(shipping);
      } else {
        console.warn('获取订单列表接口返回空数据或接口不存在');
        setOrders([]);
        message.warning('订单数据暂时无法获取，请稍后再试');
      }
    } catch (error) {
      message.error('获取订单列表失败');
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (searchValue) {
      const filtered = orders.filter((order: Order) => {
        const orderNumber = order.orderNumber.toLowerCase();
        const search = searchValue.toLowerCase();
        
        // 搜索订单号
        if (orderNumber.includes(search)) return true;
        
        // 搜索商品名称
        const hasMatchingItem = order.items.some((item: OrderItem) => {
          const productName = (item.productName || item.name || '').toLowerCase();
          return productName.includes(search);
        });
        
        return hasMatchingItem;
      });
      
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchValue, orders]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSearchValue('');
  };

  const handleViewDetail = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  const handlePayment = (orderId: string) => {
    navigate(`/payment/${orderId}`);
  };

  const showCancelModal = (orderId: string) => {
    setCurrentOrderId(orderId);
    setCancelModalVisible(true);
  };

  const handleCancel = async () => {
    if (!cancelReason) {
      message.warning('请填写取消原因');
      return;
    }

    try {
      await cancelOrder(currentOrderId, cancelReason);
      message.success('订单取消成功');
      setCancelModalVisible(false);
      setCancelReason('');
      fetchOrders(activeTab);
    } catch (error) {
      message.error('订单取消失败');
      console.error(error);
    }
  };

  const handleSearch = (value: string, option?: any) => {
    let params = {};
    
    if (option?.orderNumber) {
      // 搜索特定订单号
      params = { orderNumber: option.orderNumber };
    } else if (option?.status) {
      // 搜索特定状态的订单
      params = { status: option.status };
    } else {
      // 通用关键词搜索
      params = { keyword: value };
    }
    
    // 更新搜索参数并获取订单
    setSearchParams(params);
    fetchOrders(activeTab);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const columns = [
    {
      title: '商品',
      key: 'items',
      dataIndex: 'items',
      render: (items: any[]) => {
        if (!items || items.length === 0) return null;
        const firstItem = items[0];
        return (
          <div className="order-item-preview">
            <div className="item-info">
              <div className="item-name">{firstItem.productName || firstItem.name}</div>
              <div className="item-count">{items.length > 1 ? `等${items.length}件商品` : ''}</div>
            </div>
          </div>
        );
      }
    },
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: '下单时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusMap[status]?.color || 'default'}>
          {statusMap[status]?.text || status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: any) => (
        <div className="order-actions">
          <Button type="link" onClick={() => handleViewDetail(record.id)}>
            查看详情
          </Button>
          
          {record.status === 'pending_payment' && (
            <>
              <Button type="primary" onClick={() => handlePayment(record.id)}>
                去支付
              </Button>
              <Button danger onClick={() => showCancelModal(record.id)}>
                取消订单
              </Button>
            </>
          )}
          
          {record.status === 'shipping' && (
            <Button type="primary" onClick={() => navigate(`/logistics/${record.id}`)}>
              查看物流
            </Button>
          )}
          
          {record.status === 'delivered' && (
            <Button type="primary" onClick={() => navigate(`/confirm-receipt/${record.id}`)}>
              确认收货
            </Button>
          )}
          
          {['completed', 'delivered'].includes(record.status) && (
            <Button type="primary" onClick={() => navigate(`/after-sale/${record.id}`)}>
              申请售后
            </Button>
          )}
        </div>
      ),
    },
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: 'all',
      label: '全部订单',
    },
    {
      key: 'pending_payment',
      label: (
        <Badge count={pendingPaymentCount} offset={[5, 0]} color="#ff8c00">
          待支付
        </Badge>
      ),
    },
    {
      key: 'paid',
      label: '待发货',
    },
    {
      key: 'shipping',
      label: (
        <Badge count={pendingReceiptCount} offset={[5, 0]} color="#ff8c00">
          待收货
        </Badge>
      ),
    },
    {
      key: 'completed',
      label: '已完成',
    },
    {
      key: 'refunding',
      label: '售后中',
    },
  ];

  // 订单搜索结果的自定义渲染
  const renderOrderSearchItem = (item: any) => {
    if (item.category === '订单') {
      if (item.orderNumber) {
        return (
          <div className="order-search-item">
            <FileSearchOutlined style={{ marginRight: 8 }} />
            <span>{item.value}</span>
            <span className="order-number">#{item.orderNumber}</span>
          </div>
        );
      } else if (item.status) {
        let statusIcon;
        switch (item.status) {
          case 'pending_payment':
            statusIcon = <WalletOutlined style={{ marginRight: 8, color: '#faad14' }} />;
            break;
          case 'paid':
            statusIcon = <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />;
            break;
          case 'shipping':
            statusIcon = <CarOutlined style={{ marginRight: 8, color: '#1890ff' }} />;
            break;
          case 'delivered':
            statusIcon = <InboxOutlined style={{ marginRight: 8, color: '#722ed1' }} />;
            break;
          case 'completed':
            statusIcon = <CheckSquareOutlined style={{ marginRight: 8, color: '#52c41a' }} />;
            break;
          case 'cancelled':
            statusIcon = <CloseCircleOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />;
            break;
          case 'refunding':
          case 'refunded':
            statusIcon = <RollbackOutlined style={{ marginRight: 8, color: '#faad14' }} />;
            break;
          default:
            statusIcon = <FileSearchOutlined style={{ marginRight: 8 }} />;
        }
        
        return (
          <div className="order-search-item">
            {statusIcon}
            <span>{item.value}</span>
          </div>
        );
      }
    }
    
    return (
      <div className="order-search-item">
        <SearchOutlined style={{ marginRight: 8 }} />
        <span>{item.value}</span>
      </div>
    );
  };

  return (
    <div className="order-list-container">
      {/* 顶部导航栏 */}
      <div className="order-nav-header">
        <div className="order-nav">
          <div className="order-nav-left">
            <h1 className="order-nav-title" onClick={() => handleNavigation('/')}>
              <span className="title-you">尤</span>
              <span className="title-hong">洪</span>
              <span className="title-mall">商城</span>
            </h1>
          </div>
          <div className="order-nav-right">
            <div className="nav-item" onClick={() => handleNavigation('/')}>
              <HomeOutlined />
              <span className="nav-item-text">首页</span>
            </div>
            <div className="nav-item" onClick={() => handleNavigation('/cart')}>
              <ShoppingCartOutlined />
              <span className="nav-item-text">购物车</span>
            </div>
            <div className="nav-item" onClick={() => handleNavigation('/orders')}>
              <InboxOutlined />
              <span className="nav-item-text">我的订单</span>
              {pendingPaymentCount + pendingReceiptCount > 0 && (
                <span className="nav-item-count">{pendingPaymentCount + pendingReceiptCount}</span>
              )}
            </div>
            <div className="nav-item" onClick={() => handleNavigation('/favorites')}>
              <HeartOutlined />
              <span className="nav-item-text">收藏夹</span>
            </div>
            <div className="nav-item" onClick={() => handleNavigation('/messages')}>
              <CommentOutlined />
              <span className="nav-item-text">消息</span>
            </div>
            <div className="nav-item" onClick={() => handleNavigation('/user/profile')}>
              <UserOutlined />
              <span className="nav-item-text">个人中心</span>
            </div>
            <SmartSearch 
              placeholder="搜索订单号或商品名称"
              hotKeywords={['待支付订单', '已发货', '待收货', '已完成', '退款中']}
              categories={['订单']}
              showHistory={true}
              pageKey="order_list"
              additionalParams={{
                userId: userId,
                searchScope: 'orders_only'
              }}
              onSearch={handleSearch}
              customRender={renderOrderSearchItem}
            />
          </div>
        </div>
      </div>
      
      {/* 页面标题和搜索框 */}
      <div className="page-header">
        <h1 className="page-title">我的订单</h1>
      </div>
      
      {/* 订单状态选项卡 */}
      <Tabs 
        activeKey={activeTab} 
        items={tabItems} 
        onChange={handleTabChange} 
        className="order-tabs"
      />
      
      {/* 订单列表 */}
      <Spin spinning={loading}>
        <Table 
          columns={columns} 
          dataSource={filteredOrders} 
          rowKey="id"
          pagination={{ 
            pageSize: pageSize, 
            total: total,
            current: currentPage,
            onChange: (page) => {
              setCurrentPage(page);
            }
          }}
          locale={{ emptyText: searchValue ? '没有找到匹配的订单' : '暂无订单数据' }}
          className="order-table"
        />
      </Spin>
      
      {/* 取消订单弹窗 */}
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

export default OrderList; 