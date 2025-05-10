import React, { useState, useEffect, useRef } from 'react';
import { Input, AutoComplete, Spin, Empty, Tag, message } from 'antd';
import { SearchOutlined, HistoryOutlined, FireOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { getSearchSuggestions, getHotKeywords } from '../api/search';
import './SmartSearch.css';

interface SmartSearchProps {
  placeholder?: string;
  style?: React.CSSProperties;
  onSearch: (value: string, option?: any) => void;
  // 搜索API路径
  apiPath?: string;
  // 热门搜索关键词
  hotKeywords?: string[];
  // 是否显示搜索历史
  showHistory?: boolean;
  // 是否显示热搜
  showHotSearch?: boolean;
  // 页面标识，用于存储不同页面的搜索历史
  pageKey: string;
  // 搜索结果分类筛选，如商品、店铺、文章等
  categories?: string[];
  // 附加搜索参数
  additionalParams?: Record<string, any>;
  // 自定义下拉选项渲染
  customRender?: (item: any) => React.ReactNode;
  // 自定义搜索加载状态逻辑
  customLoading?: boolean;
}

// 历史搜索最大保存数量
const MAX_HISTORY_ITEMS = 10;

const SmartSearch: React.FC<SmartSearchProps> = ({
  placeholder = '搜索商品',
  style,
  onSearch,
  apiPath,
  hotKeywords = [],
  showHistory = true,
  showHotSearch = true,
  pageKey,
  categories,
  additionalParams,
  customRender,
  customLoading
}) => {
  const [value, setValue] = useState<string>('');
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [serverHotKeywords, setServerHotKeywords] = useState<string[]>(hotKeywords);
  const searchInputRef = useRef<any>(null);

  // 加载历史搜索记录和热门搜索词
  useEffect(() => {
    if (showHistory) {
      const history = localStorage.getItem(`search_history_${pageKey}`);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    }
    
    // 如果开启了热门搜索，则从服务器获取热门搜索词
    if (showHotSearch) {
      getHotKeywords(pageKey)
        .then(keywords => {
          if (keywords && keywords.length > 0) {
            setServerHotKeywords(keywords);
          }
        })
        .catch(error => {
          console.error('Failed to fetch hot keywords:', error);
          // 如果API调用失败，使用传入的默认热门搜索词
        });
    }
  }, [showHistory, showHotSearch, pageKey, hotKeywords]);

  // 保存搜索历史
  const saveSearchHistory = (searchValue: string) => {
    if (!showHistory || !searchValue.trim()) return;
    
    const newHistory = [searchValue, ...searchHistory.filter(item => item !== searchValue)];
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory.pop();
    }
    
    setSearchHistory(newHistory);
    localStorage.setItem(`search_history_${pageKey}`, JSON.stringify(newHistory));
  };

  // 清除单个历史记录
  const removeHistoryItem = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(h => h !== item);
    setSearchHistory(newHistory);
    localStorage.setItem(`search_history_${pageKey}`, JSON.stringify(newHistory));
  };

  // 清除所有历史记录
  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory([]);
    localStorage.removeItem(`search_history_${pageKey}`);
  };

  // 防抖处理搜索建议请求
  const debouncedFetchSuggestions = useRef(
    debounce(async (value: string) => {
      if (!value.trim()) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        // 使用API获取搜索建议
        const suggestions = await getSearchSuggestions(
          value, 
          10, 
          categories, 
          pageKey,
          additionalParams
        );
        setOptions(suggestions);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        message.error('获取搜索建议失败，请重试');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setValue(value);
    if (value.trim()) {
      debouncedFetchSuggestions(value);
    } else {
      setOptions([]);
    }
  };

  // 处理搜索提交
  const handleSearch = (searchValue: string, option?: any) => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue) return;
    
    saveSearchHistory(trimmedValue);
    onSearch(trimmedValue, option);
    setDropdownVisible(false);
  };

  // 处理选择历史记录或热门搜索
  const handleSelect = (value: string, option: any) => {
    setValue(value);
    handleSearch(value, option?.props?.option || option);
  };

  // 渲染自动完成的选项
  const renderOptions = () => {
    const allOptions = [];

    // 添加搜索历史
    if (showHistory && searchHistory.length > 0 && !value) {
      allOptions.push({
        label: (
          <div className="search-section-header">
            <span><HistoryOutlined /> 搜索历史</span>
            <a onClick={clearHistory} className="clear-history">清除</a>
          </div>
        ),
        options: searchHistory.map(item => ({
          value: item,
          label: (
            <div className="history-item">
              <span>{item}</span>
              <span className="remove-history" onClick={(e) => removeHistoryItem(item, e)}>×</span>
            </div>
          )
        }))
      });
    }

    // 添加热门搜索
    if (showHotSearch && serverHotKeywords.length > 0 && !value) {
      allOptions.push({
        label: <div className="search-section-header"><FireOutlined /> 热门搜索</div>,
        options: serverHotKeywords.map(keyword => ({
          value: keyword,
          label: <Tag color="#ff8c00">{keyword}</Tag>
        }))
      });
    }

    // 添加搜索建议
    if (options.length > 0) {
      // 如果定义了分类，按分类分组显示
      if (categories && categories.length > 0) {
        const groupedOptions: Record<string, any[]> = {};
        
        options.forEach(option => {
          const category = option.category || '其他';
          if (!groupedOptions[category]) {
            groupedOptions[category] = [];
          }
          groupedOptions[category].push(option);
        });
        
        Object.entries(groupedOptions).forEach(([category, items]) => {
          allOptions.push({
            label: <div className="search-section-header">{category}</div>,
            options: items.map(item => ({
              value: item.value,
              label: (
                <div className="suggestion-item" data-option={JSON.stringify(item)}>
                  {customRender ? (
                    React.cloneElement(customRender(item) as React.ReactElement, { option: item })
                  ) : (
                    <>
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.value} 
                          className="suggestion-image" 
                          style={{
                            width: '32px',
                            height: '32px',
                            objectFit: 'cover',
                            marginRight: '8px',
                            borderRadius: '4px'
                          }}
                        />
                      ) : (
                        <SearchOutlined className="suggestion-icon" />
                      )}
                      <div className="suggestion-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <span className="suggestion-text">{item.value}</span>
                        {item.price && (
                          <span className="suggestion-price" style={{ color: '#ff5000', fontSize: '12px' }}>
                            ¥{item.price}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            }))
          });
        });
      } else {
        // 不分组直接显示
        allOptions.push({
          label: <div className="search-section-header">搜索建议</div>,
          options: options.map(option => ({
            value: option.value,
            label: (
              <div className="suggestion-item" data-option={JSON.stringify(option)}>
                {customRender ? (
                  React.cloneElement(customRender(option) as React.ReactElement, { option })
                ) : (
                  <>
                    {option.image ? (
                      <img 
                        src={option.image} 
                        alt={option.value} 
                        className="suggestion-image" 
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'cover',
                          marginRight: '8px',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      <SearchOutlined className="suggestion-icon" />
                    )}
                    <div className="suggestion-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span className="suggestion-text">{option.value}</span>
                      {option.price && (
                        <span className="suggestion-price" style={{ color: '#ff5000', fontSize: '12px' }}>
                          ¥{option.price}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          }))
        });
      }
    }

    return allOptions;
  };

  // 渲染下拉框内容
  const dropdownRender = (menu: React.ReactElement) => {
    return (
      <div className="smart-search-dropdown">
        {loading || customLoading ? (
          <div className="search-loading">
            <Spin size="small" />
            <span>加载中...</span>
          </div>
        ) : (
          options.length === 0 && value && !loading ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="没有找到相关建议" />
          ) : menu
        )}
      </div>
    );
  };

  return (
    <div className="smart-search-container" style={style}>
      <AutoComplete
        value={value}
        options={renderOptions()}
        onSelect={handleSelect}
        onChange={handleInputChange}
        onDropdownVisibleChange={setDropdownVisible}
        open={dropdownVisible}
        dropdownRender={dropdownRender}
        dropdownMatchSelectWidth={false}
        dropdownClassName="smart-search-dropdown-menu"
        ref={searchInputRef}
        style={{ width: '100%' }}
      >
        <Input
          placeholder={placeholder}
          onPressEnter={() => handleSearch(value)}
          suffix={
            <SearchOutlined 
              className="search-icon" 
              onClick={() => handleSearch(value)}
            />
          }
        />
      </AutoComplete>
    </div>
  );
};

export default SmartSearch;