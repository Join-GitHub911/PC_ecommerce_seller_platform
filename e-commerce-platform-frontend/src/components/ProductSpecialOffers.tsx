import React from 'react';
import { Tag, Button } from 'antd';
import { 
  RedEnvelopeOutlined, 
  GoldOutlined, 
  ShoppingOutlined, 
  DollarOutlined,
  RightOutlined
} from '@ant-design/icons';
import './ProductSpecialOffers.css';

interface ProductSpecialOffersProps {
  productId: string;
  productName: string;
  productType: string;
  price: number;
  isNewUser?: boolean;
}

const ProductSpecialOffers: React.FC<ProductSpecialOffersProps> = ({
  productId,
  productName,
  productType,
  price,
  isNewUser = false
}) => {
  // 根据产品类型和价格生成优惠券数据
  const generateCoupons = () => {
    const couponValue = Math.min(Math.floor(price * 0.1), 100);
    const minPurchase = Math.floor(price * 1.2);
    
    return {
      redEnvelope: `${couponValue}元`,
      goldCoins: `${Math.floor(couponValue / 10) / 10}元`,
      minPurchase: `${minPurchase}元`
    };
  };
  
  const coupons = generateCoupons();
  
  // 是否显示新人专享
  const showNewUserBenefit = isNewUser && price > 100;
  
  return (
    <div className="special-offers-container">
      {/* 领券和红包 */}
      <div className="special-offers-row">
        <span className="offers-label">优惠</span>
        <div className="offers-content">
          <div className="coupons-container">
            <Tag className="coupon-tag red-envelope">
              <RedEnvelopeOutlined className="tag-icon" /> 红包
              <span className="coupon-value">{coupons.redEnvelope}</span>
            </Tag>
            <Tag className="coupon-tag gold-coins">
              <GoldOutlined className="tag-icon" /> 购物金
              <span className="coupon-value">{coupons.goldCoins}</span>
            </Tag>
            <Button type="link" size="small" className="coupons-action">
              立即领取 <RightOutlined />
            </Button>
          </div>
        </div>
      </div>
      
      {/* 满减和新人优惠 */}
      <div className="special-offers-row">
        <span className="offers-label">活动</span>
        <div className="offers-content">
          <div className="activities-container">
            <Tag className="activity-tag threshold-discount">
              <ShoppingOutlined className="tag-icon" /> 
              <span>满{coupons.minPurchase}减{coupons.redEnvelope}</span>
            </Tag>
            
            {showNewUserBenefit && (
              <Tag className="activity-tag new-user">
                <DollarOutlined className="tag-icon" /> 
                <span>新人专享价¥{Math.floor(price * 0.9)}</span>
              </Tag>
            )}
            
            <Button type="link" size="small" className="activities-action">
              更多活动 <RightOutlined />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecialOffers; 