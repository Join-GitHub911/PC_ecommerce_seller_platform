import api from './auth';
import { API_BASE_URL } from '../config';

// 判断是否使用模拟数据
const USE_MOCK_API = true;

// 获取聊天历史记录
export const getChatHistory = async (params?: any) => {
  try {
    if (USE_MOCK_API) {
      return mockChatHistory(params);
    }
    
    return await api.get('/customer-service/chat-history', { params });
  } catch (error) {
    console.error('获取聊天历史失败', error);
    throw error;
  }
};

// 发送消息
export const sendMessage = async (messageData: any) => {
  try {
    if (USE_MOCK_API) {
      return mockSendMessage(messageData);
    }
    
    return await api.post('/customer-service/messages', messageData);
  } catch (error) {
    console.error('发送消息失败', error);
    throw error;
  }
};

// 获取服务工单列表
export const getServiceTickets = async (params?: any) => {
  try {
    if (USE_MOCK_API) {
      return mockServiceTickets(params);
    }
    
    return await api.get('/customer-service/tickets', { params });
  } catch (error) {
    console.error('获取服务工单列表失败', error);
    throw error;
  }
};

// 创建服务工单
export const createServiceTicket = async (ticketData: any) => {
  try {
    if (USE_MOCK_API) {
      return mockCreateTicket(ticketData);
    }
    
    return await api.post('/customer-service/tickets', ticketData);
  } catch (error) {
    console.error('创建服务工单失败', error);
    throw error;
  }
};

// 获取工单详情
export const getTicketDetail = async (ticketId: string) => {
  try {
    if (USE_MOCK_API) {
      return mockTicketDetail(ticketId);
    }
    
    return await api.get(`/customer-service/tickets/${ticketId}`);
  } catch (error) {
    console.error('获取工单详情失败', error);
    throw error;
  }
};

// 回复工单
export const replyTicket = async (ticketId: string, replyData: any) => {
  try {
    if (USE_MOCK_API) {
      return mockReplyTicket(ticketId, replyData);
    }
    
    return await api.post(`/customer-service/tickets/${ticketId}/replies`, replyData);
  } catch (error) {
    console.error('回复工单失败', error);
    throw error;
  }
};

// 上传聊天图片
export const uploadChatImage = async (file: File) => {
  try {
    // 创建表单数据
    const formData = new FormData();
    formData.append('image', file);
    
    if (USE_MOCK_API) {
      // 模拟上传成功返回
      // 注意：这里直接返回模拟数据，而不是调用函数
      return {
        code: 200,
        message: 'success',
        data: {
          url: `https://example.com/uploads/${Date.now()}_${file.name}`,
          filename: file.name
        }
      };
    }
    
    return await api.post('/customer-service/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('上传聊天图片失败', error);
    throw error;
  }
};

// 获取常见问题列表
export const getFAQs = async () => {
  try {
    if (USE_MOCK_API) {
      return mockFAQs();
    }
    
    return await api.get('/customer-service/faqs');
  } catch (error) {
    console.error('获取常见问题失败', error);
    throw error;
  }
};

// 检查客服是否在线
export const checkCustomerServiceStatus = async () => {
  try {
    if (USE_MOCK_API) {
      return mockServiceStatus();
    }
    
    return await api.get('/customer-service/status');
  } catch (error) {
    console.error('检查客服状态失败', error);
    throw error;
  }
};

// 以下是模拟数据函数
function mockChatHistory(params?: any) {
  const now = new Date();
  const history = [
    {
      id: 'msg_1',
      content: '您好，有什么可以帮助您的吗？',
      sender: 'service',
      timestamp: new Date(now.getTime() - 3600000).toISOString(),
      read: true
    },
    {
      id: 'msg_2',
      content: '我想了解一下退货政策',
      sender: 'user',
      timestamp: new Date(now.getTime() - 3500000).toISOString(),
      read: true
    },
    {
      id: 'msg_3',
      content: '您好，我们的退货政策如下：1. 自收到商品之日起7天内，商品未使用可无理由退货；2. 商品质量问题，可在15天内申请退货退款；3. 特殊商品（如食品、个人护理用品等）不支持无理由退货。您有什么具体问题需要咨询吗？',
      sender: 'service',
      timestamp: new Date(now.getTime() - 3400000).toISOString(),
      read: true
    }
  ];
  
  return {
    code: 200,
    message: 'success',
    data: {
      total: history.length,
      list: history
    }
  };
}

function mockSendMessage(messageData: any) {
  const { content, type } = messageData;
  
  // 创建用户消息
  const userMessage = {
    id: `msg_${Date.now()}`,
    content,
    type: type || 'text',
    sender: 'user',
    timestamp: new Date().toISOString(),
    read: false
  };
  
  // 模拟客服回复
  const serviceReplies = [
    '感谢您的咨询，我正在查询相关信息，请稍等。',
    '您的问题我已经了解了，稍后我会给您详细的解答。',
    '您好，关于您提到的问题，建议您尝试以下解决方案...',
    '我已经记录下您的问题，我们会尽快处理并给您回复。',
    '非常抱歉给您带来不便，为了更好地解决您的问题，能否提供更多相关信息？'
  ];
  
  const randomReply = serviceReplies[Math.floor(Math.random() * serviceReplies.length)];
  
  const serviceMessage = {
    id: `msg_${Date.now() + 1000}`,
    content: randomReply,
    type: 'text',
    sender: 'service',
    timestamp: new Date(Date.now() + 3000).toISOString(),
    read: false
  };
  
  return {
    code: 200,
    message: 'success',
    data: {
      userMessage,
      serviceMessage
    }
  };
}

function mockServiceTickets(params?: any) {
  const tickets = [
    {
      id: 'ticket_1',
      title: '商品质量问题',
      type: 'product_issue',
      status: 'pending',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastReply: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ticket_2',
      title: '退款咨询',
      type: 'refund',
      status: 'processing',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastReply: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ticket_3',
      title: '订单发货咨询',
      type: 'order',
      status: 'resolved',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      lastReply: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  return {
    code: 200,
    message: 'success',
    data: {
      total: tickets.length,
      list: tickets
    }
  };
}

function mockCreateTicket(ticketData: any) {
  const newTicket = {
    id: `ticket_${Date.now()}`,
    ...ticketData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    lastReply: new Date().toISOString()
  };
  
  return {
    code: 200,
    message: 'success',
    data: newTicket
  };
}

function mockTicketDetail(ticketId: string) {
  const ticketDetail = {
    id: ticketId,
    title: '商品质量问题',
    type: 'product_issue',
    status: 'processing',
    content: '我购买的商品存在质量问题，希望能够得到解决',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    replies: [
      {
        id: 'reply_1',
        content: '您好，非常抱歉给您带来不便。为了更好地解决您的问题，请您提供订单号和商品问题的照片，谢谢！',
        sender: 'service',
        timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'reply_2',
        content: '订单号是202305100001，以下是商品问题的照片',
        sender: 'user',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        images: ['https://example.com/image1.jpg']
      },
      {
        id: 'reply_3',
        content: '感谢您提供的信息，我们已经联系相关部门处理，将在1-2个工作日内给您回复。',
        sender: 'service',
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    lastReply: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  return {
    code: 200,
    message: 'success',
    data: ticketDetail
  };
}

function mockReplyTicket(ticketId: string, replyData: any) {
  const newReply = {
    id: `reply_${Date.now()}`,
    ...replyData,
    sender: 'user',
    timestamp: new Date().toISOString()
  };
  
  return {
    code: 200,
    message: 'success',
    data: newReply
  };
}

function mockFAQs() {
  const faqs = [
    {
      id: 'faq_1',
      question: '如何申请退款？',
      answer: '您可以在"我的订单"中找到需要退款的订单，点击"申请售后"，选择"仅退款"并填写相关信息提交申请。'
    },
    {
      id: 'faq_2',
      question: '订单发货后多久可以收到商品？',
      answer: '正常情况下，订单发货后2-5个工作日内可以送达，具体以物流信息为准。'
    },
    {
      id: 'faq_3',
      question: '如何修改收货地址？',
      answer: '订单支付后，可以在订单详情页点击"修改地址"进行修改，但请注意，订单发货后将无法修改。'
    },
    {
      id: 'faq_4',
      question: '商品有质量问题怎么办？',
      answer: '商品有质量问题，您可以拍照保留证据，然后在"我的订单"中申请售后，选择"退货退款"并上传证据照片。'
    }
  ];
  
  return {
    code: 200,
    message: 'success',
    data: faqs
  };
}

function mockServiceStatus() {
  // 模拟80%的概率客服在线
  const isOnline = Math.random() < 0.8;
  
  return {
    code: 200,
    message: 'success',
    data: {
      online: isOnline,
      queueLength: isOnline ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 10 + 5),
      estimatedWaitTime: isOnline ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 20 + 10)
    }
  };
} 