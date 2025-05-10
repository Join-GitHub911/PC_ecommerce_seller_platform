import React, { useState } from 'react';
import { Card, List, Tag, Typography, Divider, Button, Tooltip } from 'antd';
import { 
  GiftOutlined, 
  ShoppingOutlined, 
  PercentageOutlined,
  DollarOutlined,
  TagOutlined,
  RightOutlined
} from '@ant-design/icons';
import './CartPromotions.css';

const { Text, Title } = Typography;

// 促销类型定义
interface Promotion {
  id: string;
  type: 'discount' | 'reduction' | 'gift' | 'bundle' | 'coupon';
  name: string;
  description: string;
  value: number;
  threshold?: number; // 满多少金额
  maxValue?: number; // 最高优惠金额
  itemId?: string; // 针对特定商品的优惠
  shopId?: string; // 针对特定店铺的优惠
  icon?: React.ReactNode; // 自定义图标
  promotionTag?: string; // 优惠标签
  color?: string; // 标签颜色
}

// 购物车项定义
interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selected?: boolean;
  shopId?: string;
}

interface CartPromotionsProps {
  items: CartItem[];
  shopPromotions: Promotion[];
  globalPromotions: Promotion[];
  totalAmount: number;
  onApplyPromotion: (promotionId: string) => void;
}

const CartPromotions: React.FC<CartPromotionsProps> = ({
  items,
  shopPromotions,
  globalPromotions,
  totalAmount,
  onApplyPromotion
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // 返回促销类型对应的图标
  const getPromotionIcon = (type: string, customIcon?: React.ReactNode) => {
    if (customIcon) return customIcon;
    
    switch (type) {
      case 'discount':
        return <PercentageOutlined />;
      case 'reduction':
        return <DollarOutlined />;
      case 'gift':
        return <GiftOutlined />;
      case 'bundle':
        return <ShoppingOutlined />;
      case 'coupon':
        return <TagOutlined />;
      default:
        return <TagOutlined />;
    }
  };
  
  // 判断促销是否可用
  const isPromotionAvailable = (promotion: Promotion) => {
    if (promotion.threshold && totalAmount < promotion.threshold) {
      return false;
    }
    return true;
  };
  
  // 计算还差多少满足条件
  const calculateAmountLeft = (promotion: Promotion) => {
    if (!promotion.threshold || totalAmount >= promotion.threshold) return 0;
    return promotion.threshold - totalAmount;
  };
  
  // 计算优惠金额
  const calculateDiscountAmount = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'discount':
        // 折扣，例如80%，需要计算节省的金额
        const discountAmount = totalAmount * (1 - promotion.value / 100);
        return promotion.maxValue ? Math.min(discountAmount, promotion.maxValue) : discountAmount;
      case 'reduction':
        // 满减，直接返回减免金额
        return promotion.value;
      default:
        return 0;
    }
  };
  
  // 渲染促销信息
  const renderPromotionItem = (promotion: Promotion) => {
    const available = isPromotionAvailable(promotion);
    const amountLeft = calculateAmountLeft(promotion);
    
    return (
      <div className={`promotion-item ${available ? 'available' : 'unavailable'}`}>
        <div className="promotion-item-header">
          <Tag color={promotion.color || (available ? 'red' : 'default')} className="promotion-tag">
            {getPromotionIcon(promotion.type, promotion.icon)}
            <span className="promotion-tag-text">{promotion.promotionTag || promotion.name}</span>
          </Tag>
          
          <Text className="promotion-description">
            {promotion.description}
          </Text>
        </div>
        
        {promotion.threshold && (
          <div className="promotion-progress">
            {available ? (
              <Text type="success">已满足条件</Text>
            ) : (
              <Text type="secondary">
                还差 <Text mark strong>¥{amountLeft.toFixed(2)}</Text> 可享优惠
              </Text>
            )}
          </div>
        )}
        
        {available && (
          <div className="promotion-action">
            <Button 
              type="link" 
              size="small" 
              onClick={() => onApplyPromotion(promotion.id)}
            >
              立即使用
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  // 获取可用的促销活动
  const getAvailablePromotions = () => {
    return [...shopPromotions, ...globalPromotions].filter(isPromotionAvailable);
  };
  
  // 获取不可用的促销活动
  const getUnavailablePromotions = () => {
    return [...shopPromotions, ...globalPromotions].filter(p => !isPromotionAvailable(p));
  };
  
  // 计算最大优惠金额
  const getMaxDiscount = () => {
    const availablePromotions = getAvailablePromotions();
    if (availablePromotions.length === 0) return 0;
    
    return Math.max(...availablePromotions.map(p => calculateDiscountAmount(p)));
  };
  
  const availablePromotions = getAvailablePromotions();
  const unavailablePromotions = getUnavailablePromotions();
  const maxDiscount = getMaxDiscount();

  return (
    <Card className="cart-promotions-card">
      <div className="cart-promotions-header">
        <Title level={5} className="cart-promotions-title">
          优惠与促销
        </Title>
        
        {availablePromotions.length > 0 && (
          <Text type="danger" className="cart-max-discount">
            最高可减 ¥{maxDiscount.toFixed(2)}
          </Text>
        )}
      </div>
      
      {availablePromotions.length > 0 && (
        <div className="available-promotions">
          <List
            itemLayout="horizontal"
            dataSource={availablePromotions.slice(0, expanded ? availablePromotions.length : 2)}
            renderItem={renderPromotionItem}
          />
        </div>
      )}
      
      {unavailablePromotions.length > 0 && expanded && (
        <>
          <Divider plain className="promotions-divider">其他优惠</Divider>
          <div className="unavailable-promotions">
            <List
              itemLayout="horizontal"
              dataSource={unavailablePromotions}
              renderItem={renderPromotionItem}
            />
          </div>
        </>
      )}
      
      {(availablePromotions.length > 2 || unavailablePromotions.length > 0) && (
        <div className="promotions-expand">
          <Button 
            type="link" 
            onClick={() => setExpanded(!expanded)}
            icon={expanded ? undefined : <RightOutlined />}
          >
            {expanded ? '收起' : `展开更多优惠(${availablePromotions.length + unavailablePromotions.length - 2})`}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CartPromotions; 