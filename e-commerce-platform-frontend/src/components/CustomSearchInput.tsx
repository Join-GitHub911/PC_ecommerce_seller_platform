import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, AutoComplete, Spin, Dropdown, Empty, Divider, Tag } from 'antd';
import { SearchOutlined, FireOutlined, HistoryOutlined } from '@ant-design/icons';
import { getSearchSuggestions } from '../api/search';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

interface CustomSearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  hotKeywords?: string[];
  pageKey?: string;
  categories?: string[];
  showHotSearches?: boolean;
  onHotSearchClick?: (keyword: string) => void;
}

// 热门商品数据
const popularProducts = [
  { 
    title: '✓快速收/无残留/不疼痛 更安心', 
    id: '1',
    price: 53
  },
  { 
    title: '德国进口酸牛奶', 
    id: '2',
    price: 189
  },
  { 
    title: 'Apple/苹果 iPhone 6s Plus 公开版', 
    id: '3',
    price: 5288
  },
  { 
    title: '倩碧特水合组合3折促销', 
    id: '4',
    price: 368
  },
  { 
    title: '品利特级橄榄油 750ml*4瓶赠3色 西班牙原装进口', 
    id: '5',
    price: 280
  },
  { 
    title: '智能手机Pro Max 高通骁龙8 Gen2处理器', 
    id: 'p1',
    price: 4999
  },
  { 
    title: '无线降噪耳机 40小时超长续航', 
    id: 'p2',
    price: 899
  },
  { 
    title: '超薄移动电源20000mAh 支持65W快充', 
    id: 'p3',
    price: 159
  }
];

// 历史搜索记录
const getSearchHistory = () => {
  try {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error('Error parsing search history:', e);
    return [];
  }
};

// 保存搜索历史
const saveToSearchHistory = (keyword: string) => {
  try {
    const history = getSearchHistory();
    // 如果已存在，则移到最前面
    const filteredHistory = history.filter((item: string) => item !== keyword);
    // 最多保存10条历史记录
    const newHistory = [keyword, ...filteredHistory].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  } catch (e) {
    console.error('Error saving search history:', e);
  }
};

const CustomSearchInput: React.FC<CustomSearchInputProps> = ({
  placeholder = '输入商品名称',
  onSearch,
  className,
  style,
  hotKeywords = [],
  pageKey = 'home_page',
  categories = ['商品', '品牌', '店铺'],
  showHotSearches = false,
  onHotSearchClick
}) => {
  const [value, setValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // 加载搜索历史
    setSearchHistory(getSearchHistory());
  }, []);
  
  // 防抖处理搜索建议请求
  const debouncedFetchSuggestions = useRef(
    debounce(async (searchValue: string) => {
      if (!searchValue.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        // 使用API获取搜索建议
        const results = await getSearchSuggestions(
          searchValue, 
          10, 
          categories, 
          pageKey
        );
        // 确保结果是数组
        if (Array.isArray(results)) {
          setSuggestions(results);
        } else {
          console.error('搜索建议返回值不是数组:', results);
          setSuggestions([]);
        }
      } catch (error) {
        console.error('获取搜索建议失败:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setValue(searchValue);
    
    if (searchValue.trim()) {
      debouncedFetchSuggestions(searchValue);
      setDropdownVisible(true);
    } else {
      setSuggestions([]);
      setDropdownVisible(false);
    }
  };

  // 处理按Enter键搜索
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 处理点击搜索按钮
  const handleSearch = () => {
    if (value.trim()) {
      // 保存到搜索历史
      saveToSearchHistory(value.trim());
      // 更新本地历史状态
      setSearchHistory([value.trim(), ...searchHistory.filter(item => item !== value.trim())].slice(0, 10));
      
      onSearch(value.trim());
      setDropdownVisible(false);
    }
  };

  // 处理选择搜索建议
  const handleSelectSuggestion = (selectedValue: string, productId?: string) => {
    setValue(selectedValue);
    // 保存到搜索历史
    saveToSearchHistory(selectedValue);
    // 更新本地历史状态
    setSearchHistory([selectedValue, ...searchHistory.filter(item => item !== selectedValue)].slice(0, 10));
    
    // 如果有商品ID，直接跳转到商品详情页
    if (productId) {
      navigate(`/product/${productId}`);
    } else {
      // 否则执行普通搜索
      onSearch(selectedValue);
    }
    
    setDropdownVisible(false);
  };

  // 处理点击热门商品
  const handleProductClick = (product: { title: string, id: string }) => {
    // 保存到搜索历史
    saveToSearchHistory(product.title);
    // 更新本地历史状态
    setSearchHistory([product.title, ...searchHistory.filter(item => item !== product.title)].slice(0, 10));
    
    // 直接跳转到商品详情页
    navigate(`/product/${product.id}`);
    setDropdownVisible(false);
  };

  // 过滤热门商品建议
  const getFilteredProductSuggestions = (query: string) => {
    if (!query) return [];
    
    return popularProducts.filter(product => 
      product.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  // 渲染搜索建议下拉框
  const renderDropdownContent = () => {
    if (loading) {
      return (
        <div className="custom-search-loading" style={{
          padding: '16px',
          textAlign: 'center',
          color: '#666'
        }}>
          <Spin size="small" />
          <span style={{ marginLeft: '8px', fontSize: '14px' }}>加载中...</span>
        </div>
      );
    }

    const hasApiSuggestions = Array.isArray(suggestions) && suggestions.length > 0;
    const filteredProducts = getFilteredProductSuggestions(value);
    const hasHistory = searchHistory.length > 0;
    
    // 如果没有任何建议显示空状态
    if (!hasApiSuggestions && filteredProducts.length === 0 && !hasHistory) {
      return <div className="custom-search-empty" style={{ padding: '16px 0' }}>
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description={<span style={{ color: '#666', fontSize: '14px' }}>没有找到相关建议</span>} 
        />
      </div>;
    }

    return (
      <div style={{ 
        padding: '5px 0', 
        maxHeight: '500px', 
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        {/* 搜索历史 */}
        {hasHistory && (
          <div style={{ padding: '5px 12px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <div style={{ 
                fontSize: '13px', 
                color: '#666', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}>
                <HistoryOutlined style={{ marginRight: '5px' }} />
                最近搜索
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {searchHistory.slice(0, 5).map((item, index) => (
                <Tag 
                  key={index}
                  color="default"
                  style={{ 
                    cursor: 'pointer', 
                    backgroundColor: '#f5f5f5',
                    border: 'none',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  onClick={() => handleSelectSuggestion(item)}
                >
                  {item}
                </Tag>
              ))}
            </div>
            <Divider style={{ margin: '12px 0' }} />
          </div>
        )}
        
        {/* 热门商品推荐 */}
        {filteredProducts.length > 0 && (
          <div style={{ padding: '5px 12px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <FireOutlined style={{ color: '#ff5000', marginRight: '5px' }} />
              <span style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>
                热门商品
              </span>
            </div>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0 
            }}>
              {filteredProducts.slice(0, 3).map((product, index) => (
                <li 
                  key={index}
                  onClick={() => handleProductClick(product)}
                  style={{ 
                    padding: '8px 0', 
                    cursor: 'pointer',
                    borderBottom: index < filteredProducts.length - 1 ? '1px dashed #f0f0f0' : 'none',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <SearchOutlined style={{ 
                        marginRight: '10px', 
                        color: '#ff5000',
                        fontSize: '14px'
                      }} />
                      <span style={{ 
                        fontSize: '13px', 
                        color: '#333',
                        fontWeight: 400
                      }}>
                        {product.title}
                      </span>
                    </div>
                    <span style={{ 
                      color: '#ff5000', 
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>
                      ¥{product.price}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {hasApiSuggestions && <Divider style={{ margin: '12px 0' }} />}
          </div>
        )}

        {/* API 返回的搜索建议 */}
        {hasApiSuggestions && (
          <ul style={{ 
            listStyle: 'none', 
            padding: '5px 0', 
            margin: 0
          }}>
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                onClick={() => handleSelectSuggestion(suggestion.value, suggestion.productId)}
                style={{ 
                  padding: '10px 12px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {suggestion.image ? (
                  <img 
                    src={suggestion.image} 
                    alt={suggestion.value} 
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      marginRight: '10px',
                      borderRadius: '4px',
                      border: '1px solid #f0f0f0'
                    }}
                  />
                ) : (
                  <SearchOutlined style={{ 
                    marginRight: '10px', 
                    color: '#999',
                    fontSize: '16px',
                    padding: '8px',
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px'
                  }} />
                )}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flex: 1,
                  overflow: 'hidden'
                }}>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#333',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{suggestion.value}</span>
                  {suggestion.category && (
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#999',
                      marginTop: '2px'
                    }}>
                      {suggestion.category}
                    </span>
                  )}
                  {suggestion.price && (
                    <span style={{ 
                      color: '#ff5000', 
                      fontSize: '13px',
                      fontWeight: 'bold',
                      marginTop: '2px'
                    }}>
                      ¥{suggestion.price}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className={className} style={{...style, width: '500px'}}>
      <div className="search-input-group" style={{ display: 'flex' }}>
        <Dropdown
          open={dropdownVisible}
          onOpenChange={setDropdownVisible}
          trigger={['click']}
          dropdownRender={renderDropdownContent}
          overlayStyle={{ 
            width: '550px',
            maxWidth: '650px',
            backgroundColor: '#fff', 
            boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08)',
            borderRadius: '0 0 4px 4px',
            border: '1px solid #e8e8e8',
            borderTop: 'none'
          }}
          overlayClassName="custom-search-dropdown"
        >
          <Input
            placeholder={placeholder}
            className="search-input"
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setDropdownVisible(true)}
            variant="borderless"
            style={{
              fontSize: '14px',
              color: '#333',
              width: '440px',
              height: '40px'
            }}
          />
        </Dropdown>
        <Button
          type="primary"
          className="search-btn"
          onClick={handleSearch}
          style={{
            height: '40px',
            width: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SearchOutlined /> 搜索
        </Button>
      </div>
    </div>
  );
};

export default CustomSearchInput;