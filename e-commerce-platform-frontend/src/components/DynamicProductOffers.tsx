import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import ProductPromotions from './ProductPromotions';
import ProductSpecialOffers from './ProductSpecialOffers';
import './DynamicProductOffers.css';

/**
 * 动态产品优惠组件 - 将根据产品特性自动注入促销和优惠信息
 * 
 * 此组件不需要直接导入到ProductDetail.tsx，而是通过index.tsx引入并自动注入
 */
const DynamicProductOffers: React.FC = () => {
  useEffect(() => {
    // 自动注入组件到页面
    const injectPromotions = () => {
      // 检查是否是商品详情页(检查URL或特定元素)
      // 通过检查特定的页面布局元素，确定是否为商品详情页
      const productDetailContainer = document.querySelector('.product-detail-container');
      
      if (!productDetailContainer) return;
      
      console.log('找到产品详情页，准备注入组件');
      
      // 尝试获取产品信息
      // 商品标题通常在h1标签中
      const productNameElement = document.querySelector('.product-title h1');
      // 价格通常在.price-amount中
      const productPriceElement = document.querySelector('.price-amount');
      // 从URL中提取产品ID
      const productIdMatch = window.location.pathname.match(/\/product\/([^/]+)/);
      
      if (!productNameElement || !productIdMatch) {
        console.log('未找到商品名称或ID', {
          productNameElement,
          productIdMatch
        });
        return;
      }
      
      const productId = productIdMatch[1];
      const productName = productNameElement.textContent || '';
      const priceText = productPriceElement?.textContent || '0';
      const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
      
      console.log('找到商品信息', {
        productId,
        productName,
        price
      });
      
      // 确定产品类型
      let productType = '';
      
      // 根据商品名称和页面内容确定类型
      const pageContent = document.body.textContent || '';
      
      if (pageContent.includes('卸妆油') || pageContent.includes('凡茜') || pageContent.includes('白茶')) {
        productType = '美妆';
      } else if (pageContent.includes('酸奶') || pageContent.includes('德亚') || pageContent.includes('食品')) {
        productType = '食品';
      } else if (pageContent.includes('iPhone') || pageContent.includes('苹果') || pageContent.includes('Apple')) {
        productType = '数码';
      }
      
      console.log('确定商品类型', productType);
      
      // 判断是否是新品或热销
      const isNew = pageContent.includes('新品');
      const isFeatured = pageContent.includes('热销') || pageContent.includes('畅销');
      
      // 注入促销标签 - 应该插入到价格区域后面
      const priceSection = document.querySelector('.price-section');
      if (priceSection) {
        console.log('找到价格区域，注入促销组件');
        
        // 检查是否已经存在注入的组件
        const existingPromo = document.querySelector('.dynamic-product-promotions-container');
        if (existingPromo) {
          existingPromo.remove();
        }
        
        // 创建促销组件容器
        const promoContainer = document.createElement('div');
        promoContainer.className = 'dynamic-product-promotions-container';
        priceSection.after(promoContainer);
        
        // 渲染促销组件
        const root = ReactDOM.createRoot(promoContainer);
        root.render(
          <ProductPromotions 
            productId={productId}
            productName={productName}
            productType={productType}
            price={price}
            isNew={isNew}
            isFeatured={isFeatured}
          />
        );
      } else {
        console.log('未找到价格区域');
      }
      
      // 注入特惠信息 - 替换现有的coupon-section
      const couponSection = document.querySelector('.coupon-section');
      if (couponSection) {
        console.log('找到优惠券区域，注入特惠组件');
        
        // 检查是否已经存在注入的组件
        const existingOffers = document.querySelector('.dynamic-product-offers-container');
        if (existingOffers) {
          existingOffers.remove();
        }
        
        // 创建优惠信息容器
        const offersContainer = document.createElement('div');
        offersContainer.className = 'dynamic-product-offers-container';
        couponSection.replaceWith(offersContainer);
        
        // 渲染优惠信息组件
        const root = ReactDOM.createRoot(offersContainer);
        root.render(
          <ProductSpecialOffers
            productId={productId}
            productName={productName}
            productType={productType}
            price={price}
            isNewUser={Math.random() > 0.5} // 随机判断是否是新用户
          />
        );
      } else {
        console.log('未找到优惠券区域');
      }
    };
    
    // 当页面完全加载后执行注入
    if (document.readyState === 'complete') {
      console.log('页面已完全加载，立即执行注入');
      injectPromotions();
    } else {
      console.log('页面加载中，等待load事件');
      window.addEventListener('load', () => {
        console.log('load事件触发，执行注入');
        injectPromotions();
      });
    }
    
    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver((mutations) => {
      if (document.querySelector('.product-detail-container')) {
        console.log('检测到DOM变化，页面中存在产品详情容器');
        injectPromotions();
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      window.removeEventListener('load', injectPromotions);
      observer.disconnect();
    };
  }, []);
  
  // 这个组件不直接渲染任何内容，仅负责注入
  return null;
};

export default DynamicProductOffers; 