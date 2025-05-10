import React, { useEffect } from 'react';
import { CartWrapper } from './CartWrapper';
import { CartDataValidator } from './CartDataValidator';
import { useCartData } from '../hooks/useCartData';
import { SmartLoader } from './common/SmartLoader';
import { Button, Empty, Alert } from 'antd';
import { ShoppingCartOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface EnhancedShoppingCartProps {
  children: React.ReactNode;
}

const CartContainer = styled.div`
  position: relative;
`;

const CartAlert = styled(Alert)`
  margin-bottom: 16px;
`;

const RefreshButtonContainer = styled.div`
  text-align: center;
  margin: 16px 0;
`;

export const EnhancedShoppingCart: React.FC<EnhancedShoppingCartProps> = ({ children }) => {
  const {
    cart,
    isLoading,
    error,
    refreshCart,
    isDataValid
  } = useCartData();

  // 处理初始加载完成后的数据验证
  useEffect(() => {
    if (cart && !isDataValid) {
      console.warn('Cart data validation failed, some items might have missing or invalid data');
    }
  }, [cart, isDataValid]);

  // 渲染空购物车状态
  const renderEmptyCart = () => {
    if (!cart || cart.items.length === 0) {
      return (
        <Empty
          image={<ShoppingCartOutlined style={{ fontSize: 64 }} />}
          description="购物车是空的"
        >
          <Button type="primary" href="/products">
            去购物
          </Button>
        </Empty>
      );
    }
    return null;
  };

  // 渲染错误状态
  const renderError = () => {
    if (error) {
      return (
        <CartAlert
          message="获取购物车数据时出错"
          description={error.message}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={refreshCart}>
              重试
            </Button>
          }
        />
      );
    }
    return null;
  };

  // 渲染数据验证警告
  const renderDataValidationWarning = () => {
    if (cart && !isDataValid) {
      return (
        <CartAlert
          message="部分商品信息可能不完整"
          description="购物车中的某些商品信息可能显示不正确，请尝试刷新购物车或删除有问题的商品。"
          type="warning"
          showIcon
        />
      );
    }
    return null;
  };

  // 手动刷新按钮
  const renderRefreshButton = () => {
    return (
      <RefreshButtonContainer>
        <Button
          icon={<ReloadOutlined />}
          onClick={refreshCart}
          loading={isLoading}
        >
          刷新购物车
        </Button>
      </RefreshButtonContainer>
    );
  };

  return (
    <CartWrapper>
      <CartContainer>
        {renderError()}
        {renderDataValidationWarning()}
        
        <SmartLoader spinning={isLoading} message="加载购物车..." transparent>
          <CartDataValidator
            cartData={cart}
            onRefresh={refreshCart}
          >
            {renderEmptyCart() || children}
          </CartDataValidator>
        </SmartLoader>
        
        {cart && cart.items.length > 0 && renderRefreshButton()}
      </CartContainer>
    </CartWrapper>
  );
}; 