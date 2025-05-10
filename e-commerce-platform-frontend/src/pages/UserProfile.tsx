import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Avatar, 
  Typography, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  message, 
  Table, 
  Tag, 
  Space,
  Descriptions,
  Divider,
  Upload,
  Modal,
  Select,
  DatePicker,
  Cascader
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  HomeOutlined, 
  LockOutlined,
  UploadOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { logout } from '../api/auth';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { regionOptions } from '../data/regions';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 性别选项
const genderOptions = [
  { value: '男', label: '男' },
  { value: '女', label: '女' },
  { value: '其他', label: '其他' }
];

// 模拟用户数据
const mockUserData = {
  id: 'u123',
  username: '张三',
  avatar: 'https://picsum.photos/200/200?random=1',
  email: 'zhangsan@example.com',
  phone: '13812345678',
  gender: '男',
  birthday: '1990-01-01',
  address: {
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园路1号'
  },
  registeredAt: '2022-01-01',
  lastLoginAt: '2023-05-15'
};

// 模拟订单数据
const mockOrders = [
  {
    id: 'o1',
    orderNumber: '20230501123456',
    status: 'delivered',
    totalAmount: 599,
    items: 3,
    createdAt: '2023-05-01 12:34:56',
    paymentMethod: '支付宝'
  },
  {
    id: 'o2',
    orderNumber: '20230415789012',
    status: 'processing',
    totalAmount: 1299,
    items: 2,
    createdAt: '2023-04-15 09:12:34',
    paymentMethod: '微信支付'
  },
  {
    id: 'o3',
    orderNumber: '20230320456789',
    status: 'pending',
    totalAmount: 99,
    items: 1,
    createdAt: '2023-03-20 15:30:45',
    paymentMethod: '银联'
  }
];

// 订单状态映射
const orderStatusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'gold', text: '待付款' },
  paid: { color: 'blue', text: '已付款' },
  processing: { color: 'cyan', text: '处理中' },
  shipped: { color: 'purple', text: '已发货' },
  delivered: { color: 'green', text: '已送达' },
  completed: { color: 'green', text: '已完成' },
  cancelled: { color: 'red', text: '已取消' },
  refunding: { color: 'orange', text: '退款中' },
  refunded: { color: 'volcano', text: '已退款' }
};

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userInfo = localStorage.getItem('user');
        if (!userInfo) {
          message.error('用户信息不存在或您未登录');
          navigate('/login');
          return;
        }
        
        const parsedUserInfo = JSON.parse(userInfo);
        
        const userData = {
          id: parsedUserInfo.id || 'u123',
          username: parsedUserInfo.username,
          avatar: parsedUserInfo.avatar || 'https://picsum.photos/200/200?random=1',
          email: parsedUserInfo.email || 'user@example.com',
          phone: parsedUserInfo.phone || '13812345678',
          gender: parsedUserInfo.gender || '未设置',
          birthday: parsedUserInfo.birthday || undefined,
          address: parsedUserInfo.address || {
            province: '未设置',
            city: '未设置',
            district: '未设置',
            detail: '未设置'
          },
          registeredAt: parsedUserInfo.registeredAt || new Date().toISOString().split('T')[0],
          lastLoginAt: parsedUserInfo.lastLoginTime || new Date().toISOString().split('T')[0]
        };
        
        setUserData(userData);
        setOrders(mockOrders);
        
        // 设置表单初始值
        profileForm.setFieldsValue({
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          gender: userData.gender,
          birthday: userData.birthday ? dayjs(userData.birthday) : undefined,
          region: [], // 初始设为空数组
          address: userData.address.detail
        });
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [profileForm, navigate]);

  // 更新个人资料
  const handleUpdateProfile = async (values: any) => {
    try {
      // 从级联选择器中获取省市区信息
      const [provinceCode, cityCode, districtCode] = values.region || [];
      
      // 查找对应的省市区名称
      let provinceName = '';
      let cityName = '';
      let districtName = '';
      
      if (provinceCode) {
        const province = regionOptions.find(p => p.value === provinceCode);
        if (province) {
          provinceName = province.label;
          
          if (cityCode && province.children) {
            const city = province.children.find(c => c.value === cityCode);
            if (city) {
              cityName = city.label;
              
              if (districtCode && city.children) {
                const district = city.children.find(d => d.value === districtCode);
                if (district) {
                  districtName = district.label;
                }
              }
            }
          }
        }
      }
      
      // 构建要更新的用户数据
      const updatedUserData = {
        ...userData,
        username: values.username,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        birthday: values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : undefined,
        address: {
          province: provinceName || '未设置',
          city: cityName || '未设置',
          district: districtName || '未设置',
          detail: values.address || '未设置'
        }
      };

      // 更新localStorage中的用户信息
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        ...updatedUserData
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // 更新状态
      setUserData(updatedUserData);
      message.success('个人资料更新成功');
    } catch (error) {
      console.error('更新个人资料失败:', error);
      message.error('更新个人资料失败，请稍后重试');
    }
  };

  // 处理区域选择变化
  const handleRegionChange = (value: string[]) => {
    setSelectedRegion(value);
  };

  // 修改密码
  const handleChangePassword = async (values: any) => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('密码修改成功');
      passwordForm.resetFields();
    } catch (error) {
      console.error('修改密码失败:', error);
      message.error('修改密码失败，请稍后重试');
    }
  };

  // 订单列表列定义
  const orderColumns = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '商品数量',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={orderStatusMap[status]?.color || 'default'}>
          {orderStatusMap[status]?.text || status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <a href={`/orders/${record.id}`}>查看详情</a>
          {record.status === 'pending' && (
            <a href={`/payment/${record.id}`}>去支付</a>
          )}
        </Space>
      ),
    },
  ];

  // 退出登录
  const handleLogout = () => {
    Modal.confirm({
      title: '确定要退出登录吗？',
      icon: <ExclamationCircleOutlined />,
      content: '退出后需要重新登录才能继续操作',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await logout();
          message.success('已成功退出登录');
          navigate('/login');
        } catch (error) {
          console.error('退出登录失败:', error);
          message.error('退出登录失败，请稍后重试');
        }
      }
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <div>加载中...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <div>用户信息不存在</div>
        <Button type="primary" href="/login">去登录</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 50px' }}>
      <Title level={2}>个人中心</Title>
      <Divider />
      
      <Row gutter={[24, 24]}>
        {/* 左侧用户信息卡片 */}
        <Col xs={24} md={8}>
          <Card variant="outlined">
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Avatar 
                size={120} 
                src={userData?.avatar} 
                icon={<UserOutlined />} 
              />
              <Title level={3} style={{ marginTop: 16 }}>{userData?.username}</Title>
              <Text type="secondary">注册时间: {userData?.registeredAt}</Text>
            </div>
            
            <Descriptions column={1}>
              <Descriptions.Item label={<><MailOutlined /> 邮箱</>}>
                {userData?.email}
              </Descriptions.Item>
              <Descriptions.Item label={<><PhoneOutlined /> 手机</>}>
                {userData?.phone}
              </Descriptions.Item>
              <Descriptions.Item label={<><HomeOutlined /> 地址</>}>
                {userData?.address?.province} {userData?.address?.city} {userData?.address?.district} {userData?.address?.detail}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        {/* 右侧选项卡 */}
        <Col xs={24} md={16}>
          <Card variant="outlined">
            <Tabs
              defaultActiveKey="profile"
              items={[
                {
                  key: 'profile',
                  label: '个人信息',
                  children: (
                    <Form
                      form={profileForm}
                      layout="vertical"
                      onFinish={handleUpdateProfile}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="username"
                            label="用户名"
                            rules={[
                              { required: true, message: '请输入用户名' },
                              { min: 2, max: 20, message: '用户名长度必须在2-20个字符之间' }
                            ]}
                          >
                            <Input placeholder="请输入用户名" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="email"
                            label="邮箱"
                            rules={[
                              { required: true, message: '请输入邮箱' },
                              { type: 'email', message: '请输入有效的邮箱地址' }
                            ]}
                          >
                            <Input placeholder="请输入邮箱" />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="phone"
                            label="手机号"
                            rules={[
                              { required: true, message: '请输入手机号' },
                              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                            ]}
                          >
                            <Input placeholder="请输入手机号" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="gender"
                            label="性别"
                            rules={[{ required: true, message: '请选择性别' }]}
                          >
                            <Select placeholder="请选择性别">
                              {genderOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                  {option.label}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Form.Item
                        name="birthday"
                        label="生日"
                        rules={[{ required: true, message: '请选择生日' }]}
                      >
                        <DatePicker 
                          style={{ width: '100%' }} 
                          placeholder="请选择生日"
                          disabledDate={(current) => current && current > dayjs().endOf('day')}
                        />
                      </Form.Item>
                      
                      <Form.Item
                        name="region"
                        label="所在地区"
                        rules={[{ required: true, message: '请选择所在地区' }]}
                      >
                        <Cascader
                          options={regionOptions}
                          placeholder="请选择省/市/区"
                          onChange={handleRegionChange}
                          expandTrigger="hover"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      
                      <Form.Item
                        name="address"
                        label="详细地址"
                        rules={[
                          { required: true, message: '请输入详细地址' },
                          { min: 5, max: 100, message: '详细地址长度必须在5-100个字符之间' }
                        ]}
                      >
                        <Input.TextArea 
                          placeholder="请输入详细地址" 
                          rows={3}
                          maxLength={100}
                          showCount
                        />
                      </Form.Item>
                      
                      <Form.Item>
                        <Button type="primary" htmlType="submit" size="large">
                          保存修改
                        </Button>
                      </Form.Item>
                    </Form>
                  )
                },
                {
                  key: 'password',
                  label: '修改密码',
                  children: (
                    <Form
                      form={passwordForm}
                      layout="vertical"
                      onFinish={handleChangePassword}
                    >
                      <Form.Item
                        name="currentPassword"
                        label="当前密码"
                        rules={[{ required: true, message: '请输入当前密码' }]}
                      >
                        <Input.Password prefix={<LockOutlined />} />
                      </Form.Item>
                      
                      <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[
                          { required: true, message: '请输入新密码' },
                          { min: 6, message: '密码至少6个字符' }
                        ]}
                      >
                        <Input.Password prefix={<LockOutlined />} />
                      </Form.Item>
                      
                      <Form.Item
                        name="confirmPassword"
                        label="确认新密码"
                        dependencies={['newPassword']}
                        rules={[
                          { required: true, message: '请确认新密码' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('两次输入的密码不匹配'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password prefix={<LockOutlined />} />
                      </Form.Item>
                      
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          修改密码
                        </Button>
                      </Form.Item>
                    </Form>
                  )
                },
                {
                  key: 'orders',
                  label: '我的订单',
                  children: (
                    <Table
                      columns={orderColumns}
                      dataSource={orders}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                    />
                  )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: 20, textAlign: 'right' }}>
        <Button type="primary" danger onClick={handleLogout}>
          <LogoutOutlined /> 退出登录
        </Button>
      </div>
    </div>
  );
};

export default UserProfile; 