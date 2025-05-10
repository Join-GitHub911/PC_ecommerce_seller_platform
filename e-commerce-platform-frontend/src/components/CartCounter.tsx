import React, { useEffect, useState } from 'react';
import { updateGlobalCartCount } from './Header';

// 创建一个购物车计数组件，能够动态监听和显示购物车数量
interface CartCounterProps {
  initialCount?: number;
  render: (count: number) => React.ReactNode;
}

const CartCounter: React.FC<CartCounterProps> = ({ initialCount = 0, render }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // 尝试从localStorage中获取购物车数量
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) {
      const parsedCount = parseInt(savedCount, 10);
      if (!isNaN(parsedCount)) {
        setCount(parsedCount);
      }
    }

    // 监听全局购物车数量更新
    const handleCartCountUpdate = () => {
      const newCount = localStorage.getItem('cartCount');
      if (newCount) {
        const parsedCount = parseInt(newCount, 10);
        if (!isNaN(parsedCount)) {
          setCount(parsedCount);
        }
      }
    };

    // 监听购物车数量更新事件
    window.addEventListener('cart-count-update', handleCartCountUpdate);
    
    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('cart-count-update', handleCartCountUpdate);
    };
  }, []);

  // 直接使用render函数来渲染组件内容
  return <>{render(count)}</>;
};

export default CartCounter; 