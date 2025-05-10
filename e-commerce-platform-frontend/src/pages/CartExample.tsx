import React from 'react';
import { EnhancedShoppingCart } from '../components/EnhancedShoppingCart';
import { useCartData } from '../hooks/useCartData';
import { 
  Table, 
  Button, 
  InputNumber, 
  Image, 
  Typography, 
  Tag, 
  Checkbox, 
  Space, 
  Divider,
  Card,
  Row,
  Col
} from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { CartItem } from '../services/cartService';

const { Title, Text } = Typography;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #f7f7f7;
  }
`;

const CartSummary = styled(Card)`
  margin-top: 20px;
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  height: 40px;
  font-size: 16px;
  margin-top: 16px;
`;

const CartExample: React.FC = () => {
  const {
    cart,
    updateCartItem,
    removeCartItem,
    clearCart
  } = useCartData();

  // 处理数量变更
  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity > 0) {
      updateCartItem(itemId, quantity);
    }
  };

  // 处理选中状态变更
  const handleSelectionChange = (itemId: string, selected: boolean) => {
    updateCartItem(itemId, cart?.items.find(item => item.id === itemId)?.quantity || 1, selected);
  };

  // 处理删除购物车项
  const handleRemoveItem = (itemId: string) => {
    removeCartItem(itemId);
  };

  // 表格列配置
  const columns = [
    {
      title: '选择',
      dataIndex: 'selected',
      width: 80,
      render: (_: boolean, record: CartItem) => (
        <Checkbox 
          checked={record.selected} 
          onChange={(e) => handleSelectionChange(record.id, e.target.checked)} 
        />
      ),
    },
    {
      title: '商品',
      dataIndex: 'productName',
      render: (_: string, record: CartItem) => (
        <Space>
          <Image 
            src={record.image || 'https://via.placeholder.com/80x80'} 
            alt={record.productName}
            width={80}
            height={80}
            fallback="https://via.placeholder.com/80x80?text=No+Image"
          />
          <div>
            <Text strong>{record.productName}</Text>
            <div>
              <Text type="secondary">{record.specifications || '默认规格'}</Text>
            </div>
            <div>
              <Tag color="blue">{record.shopName}</Tag>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: 100,
      render: (price: number) => (
        <Text strong>¥{price.toFixed(2)}</Text>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 150,
      render: (quantity: number, record: CartItem) => (
        <InputNumber
          min={1}
          max={record.stock}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.id, Number(value))}
        />
      ),
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      width: 120,
      render: (_: any, record: CartItem) => (
        <Text type="danger" strong>
          ¥{(record.price * record.quantity).toFixed(2)}
        </Text>
      ),
    },
    {
      title: '操作',
      width: 100,
      render: (_: any, record: CartItem) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id)}
        >
          删除
        </Button>
      ),
    },
  ];

  // 渲染购物车表格
  const renderCartTable = () => {
    if (!cart || cart.items.length === 0) {
      return null;
    }

    return (
      <StyledTable
        rowKey="id"
        columns={columns}
        dataSource={cart.items}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    );
  };

  // 渲染购物车总结
  const renderCartSummary = () => {
    if (!cart || cart.items.length === 0) {
      return null;
    }

    const selectedItems = cart.items.filter(item => item.selected);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <CartSummary>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button danger onClick={() => clearCart()}>清空购物车</Button>
              <Text>已选商品 {totalQuantity} 件</Text>
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" align="end">
              <Text>
                总计: <Text type="danger" style={{ fontSize: 18 }}>¥{totalPrice.toFixed(2)}</Text>
              </Text>
              <CheckoutButton type="primary" icon={<ShoppingOutlined />} disabled={selectedItems.length === 0}>
                结算
              </CheckoutButton>
            </Space>
          </Col>
        </Row>
      </CartSummary>
    );
  };

  // 渲染实际购物车内容
  const cartContent = (
    <>
      <Title level={2}>我的购物车</Title>
      <Divider />
      {renderCartTable()}
      {renderCartSummary()}
    </>
  );

  return (
    <EnhancedShoppingCart>
      {cartContent}
    </EnhancedShoppingCart>
  );
};

export default CartExample; 