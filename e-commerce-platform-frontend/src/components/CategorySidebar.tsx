import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RightOutlined, FireOutlined, LikeOutlined, CrownOutlined, TagOutlined } from '@ant-design/icons';

interface SubCategory {
  title: string;
  items: string[];
  brands?: string[];
  popular?: string[];
}

interface FeaturedProduct {
  image: string;
  title: string;
  price: number;
  discount?: string;
  id?: string;
}

interface CategoryItem {
  title: string;
  icon: React.ReactNode;
  subCategories: SubCategory[];
  featuredProducts: FeaturedProduct[];
  promotions?: string[];
  hotBrands?: string[];
}

interface CategorySidebarProps {
  categories: CategoryItem[];
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 清除定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 处理鼠标悬停事件
  const handleCategoryHover = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredCategory(index);
  };

  // 处理鼠标离开事件
  const handleCategoryLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 100); // 短暂延迟，使过渡更顺畅
  };

  // 处理子菜单悬停
  const handleSubmenuHover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // 处理子菜单离开
  const handleSubmenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 100);
  };
  
  // 渲染子分类菜单
  const renderSubCategoryMenu = () => {
    if (hoveredCategory === null) return null;
    
    const category = categories[hoveredCategory];
    
    return (
      <div 
        className="subcategory-menu"
        onMouseEnter={handleSubmenuHover}
        onMouseLeave={handleSubmenuLeave}
      >
        <div className="subcategory-content">
          <div className="subcategory-list">
            {category.subCategories.map((subCategory, index) => (
              <div key={index} className="subcategory-group">
                <div className="subcategory-title">
                  <Link to={`/category/${subCategory.title}`} className="subcategory-title-link">
                    {subCategory.title}
                  </Link>
                </div>
                <div className="subcategory-items">
                  {subCategory.items.map((item, idx) => (
                    <Link key={idx} to={`/search?q=${item}`} className="subcategory-item">
                      {item}
                    </Link>
                  ))}
                </div>
                
                {/* 显示热门品牌 (如果有) */}
                {subCategory.brands && subCategory.brands.length > 0 && (
                  <div className="subcategory-brands">
                    <span className="brands-label"><CrownOutlined /> 热门品牌：</span>
                    {subCategory.brands.map((brand, bidx) => (
                      <Link key={bidx} to={`/brand/${brand}`} className="brand-item">
                        {brand}
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* 显示热门商品 (如果有) */}
                {subCategory.popular && subCategory.popular.length > 0 && (
                  <div className="subcategory-popular">
                    <span className="popular-label"><FireOutlined /> 热销爆款：</span>
                    {subCategory.popular.map((item, pidx) => (
                      <Link key={pidx} to={`/popular/${item}`} className="popular-item">
                        {item}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="featured-products-section">
            {/* 热门促销 */}
            {category.promotions && category.promotions.length > 0 && (
              <div className="promotions-container">
                <div className="promotions-title"><TagOutlined /> 热门活动</div>
                <div className="promotions-list">
                  {category.promotions.map((promo, pidx) => (
                    <div key={pidx} className="promotion-item">
                      <span className="promotion-tag">活动</span>
                      {promo}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 热门品牌 */}
            {category.hotBrands && category.hotBrands.length > 0 && (
              <div className="hot-brands-container">
                <div className="hot-brands-title"><LikeOutlined /> 推荐品牌</div>
                <div className="hot-brands-list">
                  {category.hotBrands.map((brand, bidx) => (
                    <Link key={bidx} to={`/brand/${brand}`} className="hot-brand-item">
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* 推荐商品 */}
            <div className="featured-products">
              <div className="featured-title"><FireOutlined /> 热门推荐</div>
              <div className="featured-list">
                {category.featuredProducts.map((product, index) => (
                  <Link 
                    key={index} 
                    to={`/product/${product.id || index}`} 
                    className="featured-product"
                  >
                    <div className="featured-image">
                      <img src={product.image} alt={product.title} />
                      {product.discount && (
                        <span className="discount-badge">{product.discount}</span>
                      )}
                    </div>
                    <div className="featured-info">
                      <div className="featured-name">{product.title}</div>
                      <div className="featured-price">¥{product.price.toFixed(2)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="content-with-sidebar" ref={sidebarRef}>
      {/* Categories Sidebar */}
      <div className="categories-sidebar">
        {categories.map((item, index) => (
          <div 
            key={index} 
            className={`category-item ${hoveredCategory === index ? 'active' : ''}`}
            onMouseEnter={() => handleCategoryHover(index)}
            onMouseLeave={handleCategoryLeave}
          >
            <span className="category-icon">{item.icon}</span>
            <span className="category-title">{item.title}</span>
            <RightOutlined className="arrow-icon" />
          </div>
        ))}
      </div>
      
      {/* Sub Categories Menu (显示在鼠标悬停时) */}
      {renderSubCategoryMenu()}
    </div>
  );
};

export default CategorySidebar;