import React, { useState, useEffect } from 'react';
import { Alert, Button, List, Typography, Modal, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { CartService, CartItem, CartData } from '../services/cartService';

const { Text } = Typography;

interface CartDataValidatorProps {
  cartData: CartData | null;
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

interface DataIssue {
  type: 'missing' | 'invalid' | 'mismatch';
  field: string;
  itemId: string;
  description: string;
  fixable: boolean;
}

export const CartDataValidator: React.FC<CartDataValidatorProps> = ({
  cartData,
  onRefresh,
  children
}) => {
  const [issues, setIssues] = useState<DataIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showIssues, setShowIssues] = useState(false);

  // 验证购物车数据
  useEffect(() => {
    if (cartData) {
      validateCartData(cartData);
    }
  }, [cartData]);

  const validateCartData = (data: CartData) => {
    setIsValidating(true);
    const detectedIssues: DataIssue[] = [];

    // 检查购物车项
    data.items.forEach(item => {
      if (!item.productId) {
        detectedIssues.push({
          type: 'missing',
          field: 'productId',
          itemId: item.id,
          description: `商品ID缺失 (购物车项ID: ${item.id})`,
          fixable: false
        });
      }

      if (!item.productName) {
        detectedIssues.push({
          type: 'missing',
          field: 'productName',
          itemId: item.id,
          description: `商品名称缺失 (商品ID: ${item.productId || '未知'})`,
          fixable: true
        });
      }

      if (!item.shopName) {
        detectedIssues.push({
          type: 'missing',
          field: 'shopName',
          itemId: item.id,
          description: `店铺名称缺失 (商品: ${item.productName || '未知商品'})`,
          fixable: true
        });
      }

      if (typeof item.price !== 'number' || item.price < 0) {
        detectedIssues.push({
          type: 'invalid',
          field: 'price',
          itemId: item.id,
          description: `商品价格无效 (${item.productName || '未知商品'})`,
          fixable: true
        });
      }

      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        detectedIssues.push({
          type: 'invalid',
          field: 'quantity',
          itemId: item.id,
          description: `商品数量无效 (${item.productName || '未知商品'})`,
          fixable: true
        });
      }
    });

    setIssues(detectedIssues);
    setIsValidating(false);
    
    // 如果发现问题，自动显示问题面板
    if (detectedIssues.length > 0) {
      setShowIssues(true);
    }
  };

  const handleFixAllIssues = async () => {
    try {
      await onRefresh();
      message.success('购物车数据已刷新');
      setShowIssues(false);
    } catch (error) {
      message.error('刷新购物车数据失败，请稍后重试');
    }
  };

  const handleDeleteInvalidItem = async (itemId: string) => {
    try {
      await CartService.removeFromCart(itemId);
      message.success('已移除无效的购物车项');
      await onRefresh();
    } catch (error) {
      message.error('移除购物车项失败，请稍后重试');
    }
  };

  const renderIssueList = () => {
    return (
      <List
        size="small"
        bordered
        dataSource={issues}
        renderItem={issue => (
          <List.Item
            extra={
              issue.fixable ? (
                <Button 
                  danger 
                  size="small" 
                  onClick={() => handleDeleteInvalidItem(issue.itemId)}
                >
                  移除
                </Button>
              ) : null
            }
          >
            <Text type="danger">{issue.description}</Text>
          </List.Item>
        )}
      />
    );
  };

  const renderIssuesModal = () => {
    return (
      <Modal
        title="购物车数据问题"
        open={showIssues}
        onCancel={() => setShowIssues(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowIssues(false)}>
            稍后处理
          </Button>,
          <Button
            key="refresh"
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleFixAllIssues}
          >
            刷新购物车
          </Button>
        ]}
      >
        <Alert
          message="检测到购物车数据存在问题"
          description="这可能会导致商品信息显示不正确。您可以尝试刷新购物车数据或移除有问题的商品。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        {renderIssueList()}
      </Modal>
    );
  };

  // 如果有数据问题，显示刷新按钮
  const renderRefreshButton = () => {
    if (issues.length > 0) {
      return (
        <Button
          type="link"
          icon={<ReloadOutlined />}
          onClick={() => setShowIssues(true)}
          style={{ margin: '8px 0' }}
        >
          购物车数据存在{issues.length}个问题，点击查看
        </Button>
      );
    }
    return null;
  };

  return (
    <>
      {renderRefreshButton()}
      {renderIssuesModal()}
      {children}
    </>
  );
}; 