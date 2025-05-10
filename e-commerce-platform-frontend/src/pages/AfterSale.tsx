import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Radio, 
  Upload, 
  message, 
  Spin,
  Typography, 
  Space, 
  Divider, 
  Steps,
  Empty,
  InputNumber,
  Row,
  Col,
  Tag,
  Alert,
  Timeline,
  Modal,
  Tooltip,
  Descriptions
} from 'antd';
import { 
  PlusOutlined, 
  LoadingOutlined, 
  InboxOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { getOrderById } from '../api/order';
import { 
  applyRefund, 
  getRefundReasons, 
  cancelRefund, 
  getAfterSaleDetail 
} from '../api/aftersale';
import './AfterSale.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const AfterSale: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [refundType, setRefundType] = useState<string>('refund');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentRefund, setCurrentRefund] = useState<any>(null);
  const [reasonOptions, setReasonOptions] = useState<string[]>([]);
  const [reasonLoading, setReasonLoading] = useState<boolean>(false);
  const [refundDetailLoading, setRefundDetailLoading] = useState<boolean>(false);
  const [refundDetailVisible, setRefundDetailVisible] = useState<boolean>(false);
  const [refundDetail, setRefundDetail] = useState<any>(null);
  
  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId]);
  
  useEffect(() => {
    // 当退款类型改变时，获取对应的原因列表
    fetchRefundReasons(refundType);
  }, [refundType]);
  
  const fetchOrderDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await getOrderById(id);
      
      // 正确处理多种可能的响应格式
      let orderData;
      if (response && response.data) {
        // 处理模拟API可能返回的两种格式
        if (response.data.code !== undefined && response.data.data !== undefined) {
          // 格式1: { data: { code: 200, message: "success", data: {} } }
          orderData = response.data.data;
        } else {
          // 格式2: { data: {} } - 直接是订单数据
          orderData = response.data;
        }
      }
      
      if (orderData) {
        console.log('Successfully retrieved order data:', orderData.orderNumber);
        
        // 检查是否有正在进行的售后申请
        if (Array.isArray(orderData.refunds) && orderData.refunds.length > 0) {
          const lastRefund = orderData.refunds[orderData.refunds.length - 1];
          if (['pending', 'processing', 'approved'].includes(lastRefund.status)) {
            setCurrentRefund(lastRefund);
          }
        }
        
        setOrderDetail(orderData);
        
        // 初始化选中所有商品
        if (orderData.items?.length > 0) {
          const allItemIds = orderData.items.map((item: any) => item.id);
          setSelectedItems(allItemIds);
          form.setFieldsValue({ items: allItemIds });
        }
      } else {
        message.error('获取订单详情失败，服务器返回空数据');
        console.error('订单数据为空');
      }
    } catch (error) {
      message.error('获取订单信息失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取退款原因列表
  const fetchRefundReasons = async (type: string) => {
    try {
      setReasonLoading(true);
      const response = await getRefundReasons(type);
      
      if (response && response.data) {
        // 正确处理多种可能的响应格式
        let reasonData;
        if (response.data.code !== undefined && response.data.data !== undefined) {
          reasonData = response.data.data;
        } else {
          reasonData = response.data;
        }
        
        if (Array.isArray(reasonData)) {
          setReasonOptions(reasonData);
        } else {
          console.error('退款原因数据格式不正确:', reasonData);
          setReasonOptions(['商品质量问题', '不想要了', '其他原因']);
        }
      }
    } catch (error) {
      console.error('获取退款原因失败:', error);
      // 设置默认原因列表
      setReasonOptions(['商品质量问题', '不想要了', '其他原因']);
    } finally {
      setReasonLoading(false);
    }
  };
  
  // 获取售后详情
  const fetchRefundDetail = async (refundId: string) => {
    try {
      setRefundDetailLoading(true);
      const response = await getAfterSaleDetail(refundId);
      
      if (response && response.data) {
        // 正确处理多种可能的响应格式
        let detailData;
        if (response.data.code !== undefined && response.data.data !== undefined) {
          detailData = response.data.data;
        } else {
          detailData = response.data;
        }
        
        setRefundDetail(detailData);
        setRefundDetailVisible(true);
      } else {
        message.error('获取售后详情失败');
      }
    } catch (error) {
      message.error('获取售后详情失败');
      console.error(error);
    } finally {
      setRefundDetailLoading(false);
    }
  };
  
  const handleRefundTypeChange = (e: any) => {
    setRefundType(e.target.value);
  };
  
  const handleItemsChange = (values: string[]) => {
    setSelectedItems(values);
    
    // 计算退款金额
    if (orderDetail && orderDetail.items) {
      const selectedItemsData = orderDetail.items.filter((item: any) => values.includes(item.id));
      const refundAmount = selectedItemsData.reduce((sum: number, item: any) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      form.setFieldsValue({ amount: refundAmount.toFixed(2) });
    }
  };
  
  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };
  
  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
    }
    
    const isLessThan5M = file.size / 1024 / 1024 < 5;
    if (!isLessThan5M) {
      message.error('图片必须小于5MB!');
    }
    
    return isImage && isLessThan5M;
  };
  
  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  
  // 处理取消售后申请
  const handleCancelRefund = async () => {
    if (!currentRefund) return;
    
    Modal.confirm({
      title: '确认取消售后申请?',
      icon: <ExclamationCircleOutlined />,
      content: '取消后，如需售后服务需重新申请。',
      onOk: async () => {
        try {
          await cancelRefund(currentRefund.id);
          message.success('售后申请已取消');
          // 重新获取订单信息，更新状态
          fetchOrderDetail(orderId as string);
          setCurrentRefund(null);
        } catch (error) {
          message.error('取消申请失败');
          console.error(error);
        }
      }
    });
  };
  
  // 查看售后详情
  const handleViewRefundDetail = () => {
    if (!currentRefund) return;
    
    fetchRefundDetail(currentRefund.id);
  };
  
  // 跳转到客服页面
  const handleContactCustomerService = () => {
    navigate('/customer-service');
  };
  
  const handleSubmit = async (values: any) => {
    if (selectedItems.length === 0) {
      message.error('请至少选择一件商品');
      return;
    }
    
    try {
      setUploading(true);
      
      // 处理证据图片上传
      const images = fileList.map((file) => {
        if (file.response) {
          return file.response.url;
        }
        return null;
      }).filter(Boolean);
      
      // 构建退款申请数据
      const refundData = {
        ...values,
        type: refundType,
        images,
        orderId,
      };
      
      // 提交退款申请
      await applyRefund(orderId as string, refundData);
      message.success('售后申请提交成功');
      
      // 重新获取订单信息
      fetchOrderDetail(orderId as string);
    } catch (error) {
      message.error('申请提交失败');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  
  // 获取状态文本和颜色
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      'pending': { text: '审核中', color: 'blue' },
      'processing': { text: '处理中', color: 'orange' },
      'approved': { text: '已同意', color: 'green' },
      'rejected': { text: '已拒绝', color: 'red' },
      'completed': { text: '已完成', color: 'green' },
      'cancelled': { text: '已取消', color: 'gray' }
    };
    
    return statusMap[status] || { text: '未知状态', color: 'default' };
  };
  
  const renderRefundStatus = () => {
    if (!currentRefund) return null;
    
    const statusMap: Record<string, { step: number; text: string }> = {
      'pending': { step: 0, text: '审核中' },
      'processing': { step: 1, text: '处理中' },
      'approved': { step: 2, text: '已同意' },
      'rejected': { step: 3, text: '已拒绝' },
      'completed': { step: 4, text: '已完成' }
    };
    
    const status = statusMap[currentRefund.status] || { step: 0, text: '审核中' };
    
    return (
      <Card title="售后申请状态" className="refund-status-card">
        <Alert
          message={`您的${currentRefund.type === 'refund' ? '退款' : '退货退款'}申请正在处理中`}
          description={`申请时间: ${currentRefund.createdAt ? new Date(currentRefund.createdAt).toLocaleString() : '未知'}`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Steps current={status.step} direction="vertical">
          <Step 
            title="申请提交" 
            description={currentRefund.createdAt && `申请时间: ${new Date(currentRefund.createdAt).toLocaleString()}`} 
          />
          <Step 
            title="商家审核" 
            description={currentRefund.status === 'pending' ? '审核中，请耐心等待' : '商家正在处理您的申请'} 
          />
          <Step 
            title="退款处理" 
            description={currentRefund.status === 'approved' ? '商家已同意，正在处理退款' : 
              currentRefund.status === 'rejected' ? `申请被拒绝: ${currentRefund.rejectReason || '未符合退款条件'}` : 
              '等待处理'
            } 
          />
          <Step 
            title="退款完成" 
            description={currentRefund.status === 'completed' ? `退款金额 ¥${currentRefund.amount?.toFixed(2)} 已退回您的支付账户` : '等待完成'} 
          />
        </Steps>
        
        <Divider />
        
        <div className="refund-status-actions">
          {currentRefund.status === 'pending' && (
            <Button danger onClick={handleCancelRefund}>
              取消申请
            </Button>
          )}
          <Button type="primary" onClick={handleViewRefundDetail}>
            查看详情
          </Button>
          <Button onClick={handleContactCustomerService}>
            联系客服
          </Button>
          <Button onClick={() => navigate(`/order/${orderId}`)}>
            返回订单详情
          </Button>
        </div>
      </Card>
    );
  };
  
  // 渲染售后详情弹窗
  const renderRefundDetailModal = () => {
    return (
      <Modal
        title="售后申请详情"
        visible={refundDetailVisible}
        onCancel={() => setRefundDetailVisible(false)}
        footer={[
          <Button key="back" onClick={() => setRefundDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {refundDetailLoading ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin />
            <div style={{ marginTop: 8 }}>加载中...</div>
          </div>
        ) : refundDetail ? (
          <div className="refund-detail-content">
            <Descriptions title="基本信息" column={2} bordered>
              <Descriptions.Item label="申请编号">{refundDetail.id}</Descriptions.Item>
              <Descriptions.Item label="关联订单">{refundDetail.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="申请类型">
                {refundDetail.type === 'refund' ? '仅退款' : '退货退款'}
              </Descriptions.Item>
              <Descriptions.Item label="申请状态">
                <Tag color={getStatusInfo(refundDetail.status).color}>
                  {getStatusInfo(refundDetail.status).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="申请金额">¥{refundDetail.amount?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="申请时间">
                {refundDetail.createdAt ? new Date(refundDetail.createdAt).toLocaleString() : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="退款原因" span={2}>
                {refundDetail.reason}
              </Descriptions.Item>
              <Descriptions.Item label="详细说明" span={2}>
                {refundDetail.description || '-'}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Title level={5}>申请商品</Title>
            {refundDetail.items && refundDetail.items.length > 0 ? (
              <ul className="refund-items-list">
                {refundDetail.items.map((item: any) => (
                  <li key={item.id} className="refund-item">
                    <div className="refund-item-image">
                      <img src={item.productImage} alt={item.productName} />
                    </div>
                    <div className="refund-item-info">
                      <div className="refund-item-name">{item.productName}</div>
                      <div className="refund-item-meta">
                        <span>数量: {item.quantity}</span>
                        <span>单价: ¥{item.price?.toFixed(2)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty description="无商品信息" />
            )}
            
            <Divider />
            
            <Title level={5}>凭证图片</Title>
            {refundDetail.images && refundDetail.images.length > 0 ? (
              <div className="refund-images">
                {refundDetail.images.map((image: string, index: number) => (
                  <div key={index} className="refund-image-item">
                    <img src={image} alt={`凭证 ${index + 1}`} />
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="无凭证图片" />
            )}
            
            <Divider />
            
            <Title level={5}>处理进度</Title>
            {refundDetail.timeline && refundDetail.timeline.length > 0 ? (
              <Timeline>
                {refundDetail.timeline.map((item: any, index: number) => (
                  <Timeline.Item key={index}>
                    <div className="timeline-item">
                      <div className="timeline-time">
                        {item.time ? new Date(item.time).toLocaleString() : '-'}
                      </div>
                      <div className="timeline-content">{item.note}</div>
                      <div className="timeline-operator">操作人: {item.operator}</div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Empty description="无处理记录" />
            )}
          </div>
        ) : (
          <Empty description="获取售后申请详情失败" />
        )}
      </Modal>
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
  
  // 如果有进行中的售后申请，显示状态
  if (currentRefund) {
    return (
      <div className="aftersale-container">
        {renderRefundStatus()}
        {renderRefundDetailModal()}
      </div>
    );
  }
  
  return (
    <div className="aftersale-container">
      <Card title="申请售后服务" className="aftersale-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            reason: reasonOptions[0],
            type: 'refund'
          }}
        >
          <div className="form-section">
            <Title level={5}>订单信息</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="订单编号">
                  <Input value={orderDetail.orderNumber} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="订单金额">
                  <Input value={`¥${orderDetail.totalAmount?.toFixed(2)}`} disabled />
                </Form.Item>
              </Col>
            </Row>
          </div>
          
          <Divider />
          
          <div className="form-section">
            <Title level={5}>售后类型</Title>
            <Form.Item
              name="type"
              initialValue="refund"
            >
              <Radio.Group onChange={handleRefundTypeChange} value={refundType}>
                <Radio.Button value="refund">仅退款</Radio.Button>
                <Radio.Button value="return">退货退款</Radio.Button>
              </Radio.Group>
            </Form.Item>
            
            <Tooltip title="仅退款适用于未收到货或未使用的商品；退货退款需要将商品寄回">
              <Button type="link" icon={<QuestionCircleOutlined />}>
                选择帮助
              </Button>
            </Tooltip>
          </div>
          
          <Divider />
          
          <div className="form-section">
            <Title level={5}>选择商品</Title>
            <Form.Item
              name="items"
              rules={[{ required: true, message: '请选择至少一件商品' }]}
              initialValue={selectedItems}
            >
              <Select
                mode="multiple"
                placeholder="请选择申请售后的商品"
                onChange={handleItemsChange}
                style={{ width: '100%' }}
              >
                {orderDetail.items && orderDetail.items.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.productName || item.name} (¥{item.price?.toFixed(2)} x {item.quantity})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <Divider />
          
          <div className="form-section">
            <Title level={5}>退款信息</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="amount"
                  label="退款金额"
                  rules={[{ required: true, message: '请输入退款金额' }]}
                >
                  <InputNumber
                    min={0.01}
                    max={orderDetail.totalAmount}
                    style={{ width: '100%' }}
                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\¥\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="reason"
                  label="退款原因"
                  rules={[{ required: true, message: '请选择退款原因' }]}
                >
                  <Select placeholder="请选择退款原因" loading={reasonLoading}>
                    {reasonOptions.map((reason, index) => (
                      <Option key={index} value={reason}>{reason}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="description"
              label="问题描述"
              rules={[{ required: true, message: '请描述遇到的问题' }]}
            >
              <TextArea
                rows={4}
                placeholder="请详细描述您遇到的问题，以便我们更好地提供帮助"
              />
            </Form.Item>
          </div>
          
          {refundType !== 'refund' && (
            <>
              <Divider />
              <div className="form-section">
                <Title level={5}>退货信息</Title>
                <Alert
                  message="退货说明"
                  description="售后申请审核通过后，请按照系统提示退回商品。退货费用由买家承担，请保留快递单号。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              </div>
            </>
          )}
          
          <Divider />
          
          <div className="form-section">
            <Title level={5}>上传凭证</Title>
            <Form.Item
              name="images"
              label={
                <span>
                  问题凭证
                  <Tooltip title="请上传能够说明问题的照片，如商品破损照片等">
                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={() => {}}
                onChange={handleUploadChange}
                beforeUpload={beforeUpload}
                multiple
                maxCount={5}
              >
                {fileList.length >= 5 ? null : uploadButton}
              </Upload>
            </Form.Item>
            <Text type="secondary">最多上传5张图片，每张不超过5MB</Text>
          </div>
          
          <Divider />
          
          <Form.Item>
            <div className="form-actions">
              <Button type="primary" htmlType="submit" loading={uploading}>
                提交申请
              </Button>
              <Button onClick={() => navigate(`/order/${orderId}`)}>
                返回订单详情
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AfterSale; 