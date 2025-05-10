import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  List, 
  Avatar, 
  Typography, 
  Tabs, 
  Form, 
  Select, 
  message,
  Divider,
  Badge,
  Space,
  Empty,
  Upload,
  Row,
  Col,
  Tag,
  Alert,
  Tooltip,
  Spin,
  Collapse,
  Modal,
  Descriptions
} from 'antd';
import { 
  SendOutlined, 
  CustomerServiceOutlined, 
  UserOutlined, 
  PaperClipOutlined,
  PictureOutlined,
  SmileOutlined,
  LoadingOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  PhoneOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {
  getChatHistory,
  sendMessage,
  getServiceTickets,
  createServiceTicket,
  getTicketDetail,
  replyTicket,
  checkCustomerServiceStatus,
  uploadChatImage,
  getFAQs
} from '../api/customerService';
import './CustomerService.css';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// 消息接口
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'service';
  timestamp: Date | string;
  images?: string[];
  read: boolean;
  type?: string;
}

// 工单接口
interface ServiceTicket {
  id: string;
  title: string;
  type: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  createdAt: Date | string;
  updatedAt: Date | string;
  content?: string;
  replies?: {
    id: string;
    content: string;
    sender: 'user' | 'service';
    timestamp: Date | string;
  }[];
}

// 常见问题接口
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// 客服状态接口
interface ServiceStatus {
  online: boolean;
  avgResponseTime: number;
}

const CustomerService: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loadingChat, setLoadingChat] = useState<boolean>(true);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    online: false,
    avgResponseTime: 5
  });
  const [fileList, setFileList] = useState<any[]>([]);
  const [ticketForm] = Form.useForm();
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [creatingTicket, setCreatingTicket] = useState<boolean>(false);
  const [ticketDetailVisible, setTicketDetailVisible] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null);
  const [ticketReply, setTicketReply] = useState<string>('');
  const [loadingTickets, setLoadingTickets] = useState<boolean>(true);
  const [replyingTicket, setReplyingTicket] = useState<boolean>(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  useEffect(() => {
    // 初始化数据
    fetchChatHistory();
    fetchServiceTickets();
    fetchFAQs();
    checkServiceStatus();
    
    // 定期检查客服状态
    const statusInterval = setInterval(() => {
      checkServiceStatus();
    }, 30000);
    
    // 查看是否有从其他页面传递过来的售后信息
    const params = new URLSearchParams(location.search);
    const orderId = params.get('orderId');
    const refundId = params.get('refundId');
    if (orderId || refundId) {
      setActiveTab('submitTicket');
      let initialMessage = '';
      if (orderId) initialMessage = `我想咨询订单 ${orderId} `;
      if (refundId) initialMessage += `的售后申请 ${refundId} `;
      
      ticketForm.setFieldsValue({
        title: `关于订单${orderId}的咨询`,
        content: initialMessage,
        type: 'order_issue'
      });
    }
    
    return () => clearInterval(statusInterval);
  }, [location.search]);
  
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 获取聊天历史
  const fetchChatHistory = async () => {
    setLoadingChat(true);
    try {
      const response = await getChatHistory();
      
      if (response && response.data && response.data.data) {
        const historyData = response.data.data.list;
        
        // 转换时间戳为Date对象
        const formattedMessages = historyData.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        setChatMessages(formattedMessages);
      }
    } catch (error) {
      console.error('获取聊天历史失败:', error);
      message.error('获取聊天历史失败');
    } finally {
      setLoadingChat(false);
    }
  };
  
  // 获取服务工单
  const fetchServiceTickets = async () => {
    setLoadingTickets(true);
    try {
      const response = await getServiceTickets();
      
      if (response && response.data && response.data.data) {
        setTickets(response.data.data.list);
      }
    } catch (error) {
      console.error('获取服务工单失败:', error);
    } finally {
      setLoadingTickets(false);
    }
  };
  
  // 获取常见问题
  const fetchFAQs = async () => {
    try {
      const response = await getFAQs();
      
      if (response && response.data && response.data.data) {
        setFaqs(response.data.data);
      }
    } catch (error) {
      console.error('获取常见问题失败:', error);
    }
  };
  
  // 检查客服状态
  const checkServiceStatus = async () => {
    try {
      const response = await checkCustomerServiceStatus();
      
      if (response && response.data && response.data.data) {
        setServiceStatus(response.data.data);
      }
    } catch (error) {
      console.error('获取客服状态失败:', error);
      // 默认设置为离线
      setServiceStatus({
        online: false,
        avgResponseTime: 5
      });
    }
  };
  
  // 处理图片上传
  const handleImageUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    try {
      const response = await uploadChatImage(file);
      if (response.success) {
        setUploadedImages(prev => [...prev, response.data.url]);
        onSuccess(response.data);
      } else {
        onError(new Error('上传失败'));
        message.error('图片上传失败');
      }
    } catch (error) {
      console.error('上传图片出错:', error);
      onError(new Error('上传出错'));
      message.error('上传图片出错');
    }
  };
  
  // 发送消息
  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && uploadedImages.length === 0) || sendingMessage) return;
    
    try {
      setSendingMessage(true);
      
      // 创建消息数据
      const messageData = {
        content: inputMessage,
        type: 'text',
        images: uploadedImages
      };
      
      // 发送消息
      const response = await sendMessage(messageData);
      
      if (response && response.data && response.data.data) {
        const { userMessage, serviceMessage } = response.data.data;
        
        // 添加用户消息
        const formattedUserMessage: Message = {
          ...userMessage,
          timestamp: new Date(userMessage.timestamp),
          sender: 'user',
          read: false,
          images: uploadedImages
        };
        
        setChatMessages(prev => [...prev, formattedUserMessage]);
        
        // 清空输入
        setInputMessage('');
        setUploadedImages([]);
        
        // 模拟客服回复延迟
        setTimeout(() => {
          const formattedServiceMessage: Message = {
            ...serviceMessage,
            timestamp: new Date(serviceMessage.timestamp),
            sender: 'service',
            read: false
          };
          
          setChatMessages(prev => [...prev, formattedServiceMessage]);
        }, 1000);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败，请稍后重试');
    } finally {
      setSendingMessage(false);
    }
  };
  
  // 渲染聊天消息
  const renderChatMessages = () => {
    if (loadingChat) {
      return (
        <div className="loading-messages">
          <Spin size="large" />
          <Text>加载聊天历史...</Text>
        </div>
      );
    }
    
    if (chatMessages.length === 0) {
      return (
        <Empty
          description="暂无聊天记录，发送消息开始对话"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }
    
    return (
      <>
        {chatMessages.map(msg => (
          <div 
            key={msg.id} 
            className={`message-item ${msg.sender === 'user' ? 'message-user' : 'message-service'}`}
          >
            <Avatar 
              className={`message-avatar ${msg.sender === 'user' ? 'user-avatar' : 'service-avatar'}`}
              icon={msg.sender === 'user' ? <UserOutlined /> : <CustomerServiceOutlined />}
            />
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">
                  {msg.sender === 'user' ? '我' : '客服'}
                </span>
                <span className="message-time">
                  {typeof msg.timestamp === 'string' 
                    ? new Date(msg.timestamp).toLocaleString() 
                    : msg.timestamp.toLocaleString()
                  }
                </span>
              </div>
              <div className="message-text">
                {msg.content}
              </div>
              {msg.images && msg.images.length > 0 && (
                <div className="message-images">
                  {msg.images.map((img, index) => (
                    <div key={index} className="message-image">
                      <img src={img} alt={`图片 ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </>
    );
  };
  
  // 渲染客服状态
  const renderServiceStatus = () => (
    <div className="chat-service-status">
      <Badge status={serviceStatus.online ? 'success' : 'default'} />
      <Text strong>客服{serviceStatus.online ? '在线' : '离线'}</Text>
      {!serviceStatus.online && (
        <Text type="secondary" className="offline-tip">
          客服目前不在线，可以留言，我们会尽快回复
        </Text>
      )}
      {serviceStatus.online && (
        <Text type="secondary" className="offline-tip">
          平均响应时间: {serviceStatus.avgResponseTime} 分钟
        </Text>
      )}
    </div>
  );
  
  // 渲染工单列表
  const renderTicketsList = () => {
    if (loadingTickets) {
      return <Spin tip="加载工单列表..." />;
    }
    
    if (tickets.length === 0) {
      return (
        <Empty 
          description="暂无工单记录" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }
    
    return (
      <List
        itemLayout="horizontal"
        dataSource={tickets}
        renderItem={(ticket) => {
          const statusInfo = getTicketStatusInfo(ticket.status);
          
          return (
            <List.Item
              actions={[
                <Button 
                  type="link" 
                  onClick={() => viewTicketDetail(ticket.id)}
                  icon={<FileTextOutlined />}
                >
                  查看详情
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar icon={<CommentOutlined />} style={{ backgroundColor: statusInfo.color }} />
                }
                title={<span>{ticket.title}</span>}
                description={
                  <Space direction="vertical" size={2}>
                    <div>
                      <Tag color={statusInfo.color} icon={statusInfo.icon}>{statusInfo.text}</Tag>
                      <Tag>{ticket.type === 'order_issue' ? '订单问题' : 
                            ticket.type === 'product_issue' ? '商品问题' : 
                            ticket.type === 'refund' ? '退款问题' : '其他问题'}</Tag>
                    </div>
                    <div>
                      <Text type="secondary">
                        <HistoryOutlined /> 创建时间: {new Date(ticket.createdAt).toLocaleString()}
                      </Text>
                    </div>
                  </Space>
                }
              />
            </List.Item>
          );
        }}
        locale={{ emptyText: <Empty description="暂无工单记录" /> }}
      />
    );
  };
  
  // 获取工单状态文本和颜色
  const getTicketStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; color: string; icon: React.ReactNode }> = {
      'pending': { text: '等待处理', color: 'orange', icon: <ClockCircleOutlined /> },
      'processing': { text: '处理中', color: 'blue', icon: <LoadingOutlined /> },
      'resolved': { text: '已解决', color: 'green', icon: <CheckCircleOutlined /> },
      'closed': { text: '已关闭', color: 'default', icon: <InfoCircleOutlined /> }
    };
    
    return statusMap[status] || { text: '未知状态', color: 'default', icon: <QuestionCircleOutlined /> };
  };
  
  // 查看工单详情
  const viewTicketDetail = async (id: string) => {
    try {
      const response = await getTicketDetail(id);
      if (response.success) {
        setSelectedTicket(response.data);
      } else {
        message.error('获取工单详情失败');
      }
    } catch (error) {
      console.error('获取工单详情出错:', error);
      message.error('获取工单详情出错');
    }
  };
  
  // 回复工单
  const handleReplyTicket = async () => {
    if (!selectedTicket || !ticketReply.trim()) return;
    
    setReplyingTicket(true);
    
    try {
      const response = await replyTicket(selectedTicket.id, ticketReply);
      if (response.success) {
        message.success('回复成功');
        setTicketReply('');
        setSelectedTicket(response.data);
      } else {
        message.error('回复工单失败');
      }
    } catch (error) {
      console.error('回复工单出错:', error);
      message.error('回复工单出错');
    } finally {
      setReplyingTicket(false);
    }
  };
  
  // 提交工单
  const handleSubmitTicket = async (values: any) => {
    setCreatingTicket(true);
    
    try {
      const response = await createServiceTicket(values);
      if (response.success) {
        message.success('工单提交成功');
        ticketForm.resetFields();
        // 切换到工单列表并刷新
        setActiveTab('tickets');
        fetchServiceTickets();
      } else {
        message.error('提交工单失败');
      }
    } catch (error) {
      console.error('提交工单出错:', error);
      message.error('提交工单出错');
    } finally {
      setCreatingTicket(false);
    }
  };
  
  // 渲染工单详情
  const renderTicketDetail = () => {
    if (!selectedTicket) return null;
    
    return (
      <Modal
        title="工单详情"
        open={!!selectedTicket}
        footer={null}
        onCancel={() => setSelectedTicket(null)}
        width={700}
      >
        <Card>
          <Title level={4}>{selectedTicket.title}</Title>
          <Space>
            <Tag color={
              selectedTicket.status === 'pending' ? 'blue' :
              selectedTicket.status === 'processing' ? 'orange' :
              selectedTicket.status === 'resolved' ? 'green' : 'default'
            }>
              {
                selectedTicket.status === 'pending' ? '待处理' :
                selectedTicket.status === 'processing' ? '处理中' :
                selectedTicket.status === 'resolved' ? '已解决' : '已关闭'
              }
            </Tag>
            <Text type="secondary">创建于 {new Date(selectedTicket.createdAt).toLocaleString()}</Text>
          </Space>
          <Divider />
          <Paragraph>{selectedTicket.content}</Paragraph>
          
          <Divider orientation="left">回复记录</Divider>
          {selectedTicket.replies && selectedTicket.replies.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={selectedTicket.replies}
              renderItem={reply => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={reply.sender === 'user' ? <UserOutlined /> : <CustomerServiceOutlined />}
                        style={{ backgroundColor: reply.sender === 'user' ? '#1677ff' : '#52c41a' }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{reply.sender === 'user' ? '我' : '客服'}</Text>
                        <Text type="secondary">{new Date(reply.timestamp).toLocaleString()}</Text>
                      </Space>
                    }
                    description={reply.content}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="暂无回复记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          
          {selectedTicket.status !== 'closed' && (
            <>
              <Divider orientation="left">添加回复</Divider>
              <Form layout="vertical">
                <Form.Item>
                  <TextArea
                    rows={4}
                    placeholder="请输入回复内容..."
                    value={ticketReply}
                    onChange={e => setTicketReply(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button 
                    type="primary" 
                    onClick={handleReplyTicket}
                    loading={replyingTicket}
                    disabled={!ticketReply.trim()}
                  >
                    提交回复
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </Card>
      </Modal>
    );
  };
  
  // 渲染常见问题
  const renderFAQContent = () => {
    return (
      <div className="faq-container">
        <Title level={5}>常见问题</Title>
        
        <Collapse accordion className="faq-collapse">
          {faqs.map(faq => (
            <Panel header={faq.question} key={faq.id}>
              <Paragraph>{faq.answer}</Paragraph>
            </Panel>
          ))}
        </Collapse>
        
        {faqs.length === 0 && (
          <Empty description="暂无常见问题" />
        )}
        
        <Divider />
        
        <div className="contact-info">
          <Title level={5}>联系我们</Title>
          <Paragraph>
            <PhoneOutlined /> 客服电话: 400-123-4567 (工作时间: 9:00-18:00)
          </Paragraph>
          <Paragraph>
            <MessageOutlined /> 客服邮箱: support@youhongshop.com
          </Paragraph>
        </div>
      </div>
    );
  };
  
  return (
    <div className="customer-service-container">
      <Card className="customer-service-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={key => setActiveTab(key)}
          className="service-tabs"
        >
          <TabPane 
            tab={<span><CustomerServiceOutlined />在线咨询</span>} 
            key="chat"
          >
            <div className="chat-container">
              {renderServiceStatus()}
              
              <div className="chat-messages">
                {renderChatMessages()}
              </div>
              
              <div className="chat-input">
                <div className="chat-tools">
                  <Upload
                    customRequest={handleImageUpload}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />} />
                  </Upload>
                </div>
                
                {uploadedImages.length > 0 && (
                  <div className="message-images">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="message-image">
                        <img src={img} alt={`上传图片 ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="input-area">
                  <TextArea
                    placeholder="请输入消息..."
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onPressEnter={e => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={3}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={sendingMessage}
                    disabled={(!inputMessage.trim() && uploadedImages.length === 0) || sendingMessage}
                  >
                    发送
                  </Button>
                </div>
                <div className="chat-tips">
                  <Text type="secondary">提示: 按Enter发送，Shift+Enter换行</Text>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane 
            tab={<span><FileTextOutlined />我的工单</span>} 
            key="tickets"
          >
            <div className="ticket-container">
              <div className="ticket-header">
                <Title level={4}>我的工单</Title>
                <Button
                  type="primary"
                  onClick={() => setActiveTab('submitTicket')}
                >
                  提交新工单
                </Button>
              </div>
              
              <div className="ticket-detail">
                {renderTicketsList()}
                {renderTicketDetail()}
              </div>
            </div>
          </TabPane>
          <TabPane 
            tab={<span><PlusOutlined />提交工单</span>} 
            key="submitTicket"
          >
            <div className="submit-ticket-container">
              <Card className="submit-ticket-card">
                <Title level={4}>提交工单</Title>
                <Paragraph type="secondary">
                  请详细描述您遇到的问题，我们将尽快为您处理。
                </Paragraph>
                
                <Form
                  layout="vertical"
                  form={ticketForm}
                  onFinish={handleSubmitTicket}
                >
                  <Form.Item
                    name="title"
                    label="工单标题"
                    rules={[{ required: true, message: '请输入工单标题' }]}
                  >
                    <Input placeholder="例如：订单退款问题" />
                  </Form.Item>
                  
                  <Form.Item
                    name="type"
                    label="问题类型"
                    rules={[{ required: true, message: '请选择问题类型' }]}
                  >
                    <Select placeholder="请选择问题类型">
                      <Select.Option value="order">订单问题</Select.Option>
                      <Select.Option value="payment">支付问题</Select.Option>
                      <Select.Option value="refund">退款问题</Select.Option>
                      <Select.Option value="delivery">物流问题</Select.Option>
                      <Select.Option value="product">商品问题</Select.Option>
                      <Select.Option value="other">其他问题</Select.Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="content"
                    label="问题描述"
                    rules={[{ required: true, message: '请输入问题描述' }]}
                  >
                    <TextArea 
                      rows={6} 
                      placeholder="请详细描述您遇到的问题，包括相关订单号等信息..." 
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <div className="form-actions">
                      <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={creatingTicket}
                      >
                        提交工单
                      </Button>
                      <Button 
                        onClick={() => {
                          ticketForm.resetFields();
                          setActiveTab('tickets');
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </TabPane>
          <TabPane 
            tab={<span><QuestionCircleOutlined />常见问题</span>} 
            key="faq"
          >
            {renderFAQContent()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CustomerService; 