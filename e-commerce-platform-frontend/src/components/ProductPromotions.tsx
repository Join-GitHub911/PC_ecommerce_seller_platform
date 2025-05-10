import React from 'react';
import { Tag, Tooltip } from 'antd';
import { 
  GiftOutlined, 
  ThunderboltOutlined, 
  CreditCardOutlined, 
  BankOutlined, 
  FireOutlined,
  TagOutlined
} from '@ant-design/icons';
import './ProductPromotions.css';

interface ProductPromotionsProps {
  productId: string;
  productName: string;
  productType: string;
  price: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

const ProductPromotions: React.FC<ProductPromotionsProps> = ({
  productId,
  productName,
  productType,
  price,
  isNew = false,
  isFeatured = false
}) => {
  // 根据产品类型和价格动态生成促销信息
  const getPromotions = () => {
    const promotions = [];
    
    // 价格相关促销
    if (price > 1000) {
      promotions.push({
        type: '满减',
        icon: <ThunderboltOutlined />,
        color: '#f50',
        description: `满${Math.floor(price / 100) * 100}减${Math.floor(price / 20)}`
      });
    } else if (price > 100) {
      promotions.push({
        type: '满减',
        icon: <ThunderboltOutlined />,
        color: '#f50',
        description: `满${Math.floor(price / 10) * 10}减${Math.floor(price / 10)}`
      });
    }
    
    // 根据产品类型添加特定促销
    if (productType.includes('手机') || productType.includes('数码')) {
      promotions.push({
        type: '分期',
        icon: <CreditCardOutlined />,
        color: '#1890ff',
        description: '花呗分期6期免息'
      });
      
      if (price > 3000) {
        promotions.push({
          type: '以旧换新',
          icon: <BankOutlined />,
          color: '#52c41a',
          description: '以旧换新，最高抵2000元'
        });
      }
    }
    
    if (productType.includes('美妆') || productType.includes('护肤')) {
      promotions.push({
        type: '赠品',
        icon: <GiftOutlined />,
        color: '#722ed1',
        description: '赠送面膜试用装'
      });
    }
    
    if (productType.includes('食品') || productType.includes('生鲜')) {
      promotions.push({
        type: '满赠',
        icon: <GiftOutlined />,
        color: '#13c2c2',
        description: '满2件赠送同品类小样'
      });
    }
    
    // 新品标记
    if (isNew) {
      promotions.push({
        type: '新品',
        icon: <TagOutlined />,
        color: '#eb2f96',
        description: '新品上市，限时优惠'
      });
    }
    
    // 热销商品
    if (isFeatured) {
      promotions.push({
        type: '热卖',
        icon: <FireOutlined />,
        color: '#fa8c16',
        description: '热销商品，口碑好评'
      });
    }
    
    // 确保至少有一个促销
    if (promotions.length === 0) {
      promotions.push({
        type: '特惠',
        icon: <ThunderboltOutlined />,
        color: '#f50',
        description: '限时特惠，抢购从速'
      });
    }
    
    return promotions;
  };
  
  const promotions = getPromotions();
  
  return (
    <div className="product-promotions">
      {promotions.map((promo, index) => (
        <Tooltip key={index} title={promo.description}>
          <Tag className="promotion-tag" color={promo.color}>
            {promo.icon} <span className="promotion-text">{promo.type}</span>
          </Tag>
        </Tooltip>
      ))}
    </div>
  );
};

export default ProductPromotions; 