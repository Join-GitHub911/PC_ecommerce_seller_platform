import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// 创建一个组件，它会在渲染后监视DOM并更新购物车数量显示
const CartNumberUpdater: React.FC = () => {
  useEffect(() => {
    // 检查现有的购物车数量
    const checkAndUpdateCartNumbers = () => {
      // 尝试找到首页中的购物车数量元素
      const cartCountElements = document.querySelectorAll('.cart-count');
      
      // 从localStorage获取购物车数量
      const storedCount = localStorage.getItem('cartCount');
      const cartCount = storedCount ? parseInt(storedCount, 10) : 0;
      
      // 更新所有找到的购物车数量元素
      cartCountElements.forEach(element => {
        if (element && element.textContent?.includes('[')) {
          element.textContent = `[${cartCount}]`;
        }
      });
    };
    
    // 初始运行一次
    checkAndUpdateCartNumbers();
    
    // 监听购物车更新事件
    const handleCartUpdate = () => {
      checkAndUpdateCartNumbers();
    };
    
    // 使用MutationObserver监视DOM变化
    const observer = new MutationObserver((mutations) => {
      // 有任何DOM变化就检查并更新
      checkAndUpdateCartNumbers();
    });
    
    // 开始观察document.body的所有变化
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      characterData: true
    });
    
    // 监听自定义事件
    window.addEventListener('cart-count-update', handleCartUpdate);
    
    // 清理函数
    return () => {
      observer.disconnect();
      window.removeEventListener('cart-count-update', handleCartUpdate);
    };
  }, []);
  
  // 不需要渲染任何可见内容
  return null;
};

// 导出组件
export default CartNumberUpdater;

// 创建自执行函数，直接注入到DOM中
(function injectCartNumberUpdater() {
  // 在document ready时执行
  document.addEventListener('DOMContentLoaded', () => {
    // 创建一个容器元素
    const container = document.createElement('div');
    container.id = 'cart-number-updater-container';
    document.body.appendChild(container);
    
    // 使用createRoot替代过时的render方法
    const root = createRoot(container);
    root.render(<CartNumberUpdater />);
  });
})(); 