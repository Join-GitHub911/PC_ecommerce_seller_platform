import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Pagination, Input, Select, Button, Tag, Breadcrumb, Spin, Empty, message } from 'antd';
import { SearchOutlined, FilterOutlined, ShoppingCartOutlined, HeartOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { IMAGE_PREFIX, PAGINATION_CONFIG } from '../config';
import { CART_COUNT_UPDATE_EVENT, updateGlobalCartCount } from '../components/Header';
import { addToCart, getCartCount } from '../api/cart';
import SmartSearch from '../components/SmartSearch';
import './ProductList.css';

const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

// 价格范围选项
const PRICE_RANGES = [
  { label: '全部价格', value: '' },
  { label: '¥0 - ¥100', value: '0-100' },
  { label: '¥100 - ¥300', value: '100-300' },
  { label: '¥300 - ¥500', value: '300-500' },
  { label: '¥500 - ¥1000', value: '500-1000' },
  { label: '¥1000+', value: '1000-' }
];

// 排序方式
const SORT_OPTIONS = [
  { label: '默认排序', value: 'default' },
  { label: '价格: 低 - 高', value: 'price_asc' },
  { label: '价格: 高 - 低', value: 'price_desc' },
  { label: '销量: 高 - 低', value: 'sales_desc' },
  { label: '评分: 高 - 低', value: 'rating_desc' },
  { label: '最新上架', value: 'newest' }
];

// 模拟商品数据
const MOCK_PRODUCTS = Array(20).fill(null).map((_, index) => ({
  id: `p${index + 1}`,
  name: `商品 ${index + 1}`,
  price: Math.floor(Math.random() * 1000) + 1,
  originalPrice: Math.floor(Math.random() * 1500) + 500,
  image: `https://picsum.photos/300/300?random=${index + 1}`,
  description: `商品 ${index + 1} 的详细描述...`,
  rating: (Math.random() * 5).toFixed(1),
  sales: Math.floor(Math.random() * 1000),
  tags: ['新品', '热销', '促销'][Math.floor(Math.random() * 3)]
}));

// 模拟分类数据
const MOCK_CATEGORIES = [
  { id: 'c1', name: '手机数码' },
  { id: 'c2', name: '电脑办公' },
  { id: 'c3', name: '家用电器' },
  { id: 'c4', name: '服装鞋包' },
  { id: 'c5', name: '食品生鲜' },
  { id: 'c6', name: '美妆护肤' },
];

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchValue = queryParams.get('search') || '';

  // 状态管理
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.defaultPageSize);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState<string>(initialSearchValue);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortOption, setSortOption] = useState('default');

  // 模拟加载产品数据
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 过滤和排序产品
        let filteredProducts = [...MOCK_PRODUCTS];
        
        // 搜索过滤
        if (searchValue) {
          filteredProducts = filteredProducts.filter(
            product => product.name.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        
        // 价格范围过滤
        if (priceRange) {
          const [min, max] = priceRange.split('-').map(Number);
          filteredProducts = filteredProducts.filter(product => {
            if (!max) return product.price >= min;
            return product.price >= min && product.price <= max;
          });
        }
        
        // 排序
        if (sortOption !== 'default') {
          filteredProducts.sort((a, b) => {
            switch (sortOption) {
              case 'price_asc':
                return a.price - b.price;
              case 'price_desc':
                return b.price - a.price;
              case 'sales_desc':
                return b.sales - a.sales;
              case 'rating_desc':
                return parseFloat(b.rating) - parseFloat(a.rating);
              case 'newest':
                return parseInt(b.id.substring(1)) - parseInt(a.id.substring(1));
              default:
                return 0;
            }
          });
        }
        
        setTotal(filteredProducts.length);
        
        // 分页
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
        
        setProducts(paginatedProducts);
      } catch (error) {
        console.error('获取产品列表失败:', error);
        message.error('获取产品列表失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage, pageSize, searchValue, selectedCategory, priceRange, sortOption]);

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchValue(value);
    // 更新URL，保留当前筛选条件
    const newParams = new URLSearchParams(location.search);
    newParams.set('search', value);
    navigate({
      pathname: location.pathname,
      search: newParams.toString()
    });
    
    // 这里实际项目中会根据搜索词请求API
    message.info(`搜索: ${value}`);
    // TODO: 调用API搜索商品
  };

  // 分类选择处理
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // 价格范围处理
  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  // 排序处理
  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  // 分页处理
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  // 添加到购物车处理
  const handleAddToCart = (productId: string) => {
    // 调用添加到购物车的API
    addToCart(productId, 1)
      .then((response) => {
        message.success('添加商品到购物车成功');
        // 触发购物车数量更新事件
        window.dispatchEvent(new Event(CART_COUNT_UPDATE_EVENT));
        
        // 简化：直接获取购物车数量
        getCartCount().then(response => {
          if (response && response.data && typeof response.data.count === 'number') {
            updateGlobalCartCount(response.data.count);
          }
        }).catch(err => {
          console.error('获取购物车数量失败');
        });
      })
      .catch((error: Error) => {
        console.error('添加到购物车失败:', error);
        message.error('添加到购物车失败，请稍后重试');
      });
  };

  // 商品分类热门搜索词
  const productHotKeywords = [
    '手机', '电脑', '女装', '男装', '运动鞋', 
    '面膜', '食品', '零食', '家具', '电器'
  ];
  
  // 渲染自定义搜索结果
  const renderCustomSearchItem = (item: any) => {
    return (
      <div className="product-search-item">
        <SearchOutlined className="search-icon" />
        <span>{item.value}</span>
        {item.price && <span className="item-price">¥{item.price}</span>}
      </div>
    );
  };

  return (
    <div className="product-list-container">
      <div className="search-filter-row">
        <div className="product-search">
          <SmartSearch
            placeholder="搜索商品名称、品牌、规格"
            onSearch={handleSearch}
            pageKey="product_list"
            hotKeywords={productHotKeywords}
            categories={['商品', '品牌', '店铺', '分类']}
            additionalParams={{ 
              category: selectedCategory,
              priceRange: priceRange,
              sort: sortOption
            }}
            customRender={renderCustomSearchItem}
            style={{ width: '100%' }}
          />
        </div>
        
        <Col xs={24} md={16}>
          <Row gutter={16}>
            <Col xs={12} md={8}>
              <Select
                placeholder="选择分类"
                style={{ width: '100%' }}
                onChange={handleCategoryChange}
                value={selectedCategory || undefined}
              >
                <Option value="">全部分类</Option>
                {MOCK_CATEGORIES.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col xs={12} md={8}>
              <Select
                placeholder="价格范围"
                style={{ width: '100%' }}
                onChange={handlePriceRangeChange}
                value={priceRange || undefined}
              >
                {PRICE_RANGES.map(range => (
                  <Option key={range.value} value={range.value}>
                    {range.label}
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col xs={24} md={8}>
              <Select
                placeholder="排序方式"
                style={{ width: '100%' }}
                onChange={handleSortChange}
                value={sortOption}
              >
                {SORT_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Col>
      </div>

      {/* 商品列表 */}
      <div style={{ marginBottom: '20px', minHeight: '300px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : products.length > 0 ? (
          <Row gutter={[16, 16]}>
            {products.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <Link to={`/products/${product.id}`}>
                      <img 
                        alt={product.name} 
                        src={`${IMAGE_PREFIX}${product.image}`} 
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    </Link>
                  }
                  actions={[
                    <Button 
                      type="primary" 
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      加入购物车
                    </Button>
                  ]}
                >
                  <Link to={`/products/${product.id}`}>
                    <Meta
                      title={
                        <div style={{ whiteSpace: 'normal', height: '44px', overflow: 'hidden' }}>
                          {product.name}
                        </div>
                      }
                      description={
                        <>
                          <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '18px', color: '#ff4d4f', fontWeight: 'bold' }}>
                              ¥{product.price}
                            </span>
                            {product.originalPrice > product.price && (
                              <span style={{ marginLeft: '8px', textDecoration: 'line-through', color: '#999' }}>
                                ¥{product.originalPrice}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>销量: {product.sales}</span>
                            <span>评分: {product.rating}</span>
                          </div>
                          {product.tags && (
                            <div style={{ marginTop: '8px' }}>
                              <Tag color="red">{product.tags}</Tag>
                            </div>
                          )}
                        </>
                      }
                    />
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty 
            description="暂无商品数据" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>

      {/* 分页器 */}
      {total > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
            showSizeChanger={PAGINATION_CONFIG.showSizeChanger}
            showTotal={(total) => `共 ${total} 个商品`}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList; 