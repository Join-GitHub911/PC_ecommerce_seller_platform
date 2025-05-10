import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel, Input, Button, Row, Col, Select, Badge, Modal, message } from 'antd';
import { 
  ShoppingCartOutlined, 
  DownOutlined, 
  SearchOutlined,
  MobileOutlined,
  RightOutlined,
  AppstoreOutlined,
  CoffeeOutlined,
  HeartOutlined,
  HomeOutlined,
  SkinOutlined,
  WomanOutlined,
  ShoppingOutlined,
  ManOutlined,
  PhoneOutlined,
  GiftOutlined,
  MobileFilled,
  WeiboOutlined,
  WechatOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import '../styles/Home.css';
import { getCartCount } from '../api/cart';
import { logout } from '../api/auth';
import CustomSearchInput from '../components/CustomSearchInput';

// 导入商品图片
// import iphone6s from '../assets/iPhone6s玫瑰金.png';
import product1 from '../assets/product1.png';
import product2 from '../assets/product2.png';
import product3 from '../assets/product3.png';
import product4 from '../assets/product4.png';
import product5 from '../assets/product5.png';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';

const { Option } = Select;

const Home: React.FC = () => {
  // 轮播图数据
  const bannerImages = [
    { id: 1, src: banner1, alt: '促销活动1' },
    { id: 2, src: banner2, alt: '促销活动2' },
    { id: 3, src: banner3, alt: '促销活动3' }
  ];

  // 热门搜索词
  const hotSearches = ['咖啡', 'iphone 6s', '新鲜蔬菜', '蛋糕', '日用品', '连衣裙'];
  
  // 商品分类数据
  const categories = [
    { 
      key: '1', 
      icon: <AppstoreOutlined />, 
      name: '进口食品、生鲜',
      subCategories: [
        { name: '进口零食', link: '/category/imported-snacks' },
        { name: '进口饮料', link: '/category/imported-drinks' },
        { name: '进口水果', link: '/category/imported-fruits' },
        { name: '进口肉类', link: '/category/imported-meat' },
        { name: '进口海鲜', link: '/category/imported-seafood' },
        { name: '进口乳制品', link: '/category/imported-dairy' },
        { name: '有机蔬菜', link: '/category/organic-vegetables' },
        { name: '新鲜水果', link: '/category/fresh-fruits' },
        { name: '精选肉类', link: '/category/select-meat' },
      ]
    },
    { 
      key: '2', 
      icon: <CoffeeOutlined />, 
      name: '食品、饮料、酒',
      subCategories: [
        { name: '休闲零食', link: '/category/snacks' },
        { name: '饼干糕点', link: '/category/cookies' },
        { name: '方便速食', link: '/category/fast-food' },
        { name: '茶叶冲饮', link: '/category/tea' },
        { name: '饮料酒水', link: '/category/beverages' },
        { name: '调味品', link: '/category/condiments' },
        { name: '奶粉乳品', link: '/category/dairy' },
        { name: '酒类', link: '/category/alcohol' },
        { name: '健康食品', link: '/category/health-food' },
      ]
    },
    { 
      key: '3', 
      icon: <HeartOutlined />, 
      name: '母婴、玩具、童装',
      subCategories: [
        { name: '奶粉', link: '/category/milk-powder' },
        { name: '营养辅食', link: '/category/baby-food' },
        { name: '尿裤湿巾', link: '/category/diapers' },
        { name: '喂养用品', link: '/category/feeding' },
        { name: '洗护用品', link: '/category/baby-care' },
        { name: '童装童鞋', link: '/category/children-clothing' },
        { name: '玩具', link: '/category/toys' },
        { name: '童车童床', link: '/category/children-furniture' },
        { name: '孕产妇用品', link: '/category/maternity' },
      ]
    },
    { 
      key: '4', 
      icon: <HomeOutlined />, 
      name: '家居、家居清洁、纸品',
      subCategories: [
        { name: '床上用品', link: '/category/bedding' },
        { name: '家居饰品', link: '/category/home-decor' },
        { name: '家具', link: '/category/furniture' },
        { name: '灯具', link: '/category/lighting' },
        { name: '家居清洁', link: '/category/cleaning' },
        { name: '纸品湿巾', link: '/category/paper-goods' },
        { name: '收纳用品', link: '/category/storage' },
        { name: '厨房用品', link: '/category/kitchen' },
        { name: '卫浴用品', link: '/category/bathroom' },
      ]
    },
    { 
      key: '5', 
      icon: <SkinOutlined />, 
      name: '美妆、个人护理',
      subCategories: [
        { name: '面部护肤', link: '/category/facial-care' },
        { name: '彩妆', link: '/category/makeup' },
        { name: '香水', link: '/category/perfume' },
        { name: '男士护理', link: '/category/men-care' },
        { name: '洗发护发', link: '/category/hair-care' },
        { name: '口腔护理', link: '/category/oral-care' },
        { name: '身体护理', link: '/category/body-care' },
        { name: '女性护理', link: '/category/women-care' },
        { name: '个人清洁', link: '/category/personal-clean' },
      ]
    },
    { 
      key: '6', 
      icon: <WomanOutlined />, 
      name: '女装、内衣、中老年',
      subCategories: [
        { name: '连衣裙', link: '/category/dresses' },
        { name: 'T恤', link: '/category/t-shirts' },
        { name: '衬衫', link: '/category/shirts' },
        { name: '裤子', link: '/category/pants' },
        { name: '内衣', link: '/category/underwear' },
        { name: '文胸', link: '/category/bras' },
        { name: '中老年装', link: '/category/elder-clothing' },
        { name: '打底衫', link: '/category/base-shirts' },
        { name: '毛衣针织', link: '/category/sweaters' },
      ]
    },
    { 
      key: '7', 
      icon: <ShoppingOutlined />, 
      name: '鞋靴、箱包、腕表',
      subCategories: [
        { name: '女鞋', link: '/category/women-shoes' },
        { name: '男鞋', link: '/category/men-shoes' },
        { name: '运动鞋', link: '/category/sports-shoes' },
        { name: '女包', link: '/category/women-bags' },
        { name: '男包', link: '/category/men-bags' },
        { name: '腕表', link: '/category/watches' },
        { name: '皮带', link: '/category/belts' },
        { name: '行李箱', link: '/category/luggage' },
        { name: '钱包', link: '/category/wallets' },
      ]
    },
    { 
      key: '8', 
      icon: <ManOutlined />, 
      name: '男装、运动',
      subCategories: [
        { name: 'T恤', link: '/category/men-t-shirts' },
        { name: '衬衫', link: '/category/men-shirts' },
        { name: '裤子', link: '/category/men-pants' },
        { name: '西装', link: '/category/suits' },
        { name: '运动服', link: '/category/sportswear' },
        { name: '运动装备', link: '/category/sports-equipment' },
        { name: '内衣内裤', link: '/category/men-underwear' },
        { name: '户外服装', link: '/category/outdoor-clothing' },
        { name: '夹克外套', link: '/category/jackets' },
      ]
    },
    { 
      key: '9', 
      icon: <PhoneOutlined />, 
      name: '手机、小家电、数码',
      subCategories: [
        { name: '手机', link: '/category/phones' },
        { name: '笔记本', link: '/category/laptops' },
        { name: '平板电脑', link: '/category/tablets' },
        { name: '相机', link: '/category/cameras' },
        { name: '耳机', link: '/category/headphones' },
        { name: '小家电', link: '/category/small-appliances' },
        { name: '智能设备', link: '/category/smart-devices' },
        { name: '游戏设备', link: '/category/gaming' },
        { name: '手机配件', link: '/category/phone-accessories' },
      ]
    },
    { 
      key: '10', 
      icon: <GiftOutlined />, 
      name: '礼品、宠物',
      subCategories: [
        { name: '创意礼品', link: '/category/creative-gifts' },
        { name: '鲜花', link: '/category/flowers' },
        { name: '工艺品', link: '/category/crafts' },
        { name: '宠物主粮', link: '/category/pet-food' },
        { name: '宠物零食', link: '/category/pet-snacks' },
        { name: '宠物用品', link: '/category/pet-supplies' },
        { name: '宠物玩具', link: '/category/pet-toys' },
        { name: '节日礼品', link: '/category/holiday-gifts' },
        { name: '礼品卡', link: '/category/gift-cards' },
      ]
    }
  ];
  
  // 导航菜单项
  const navItems = [
    { key: 'home', name: '首页' },
    { key: 'food', name: '美食' },
    { key: 'fresh', name: '生鲜' },
    { key: 'home-deco', name: '家居' },
    { key: 'women', name: '女装' },
    { key: 'beauty', name: '美妆' },
    { key: 'digital', name: '数码' },
    { key: 'group', name: '团购' }
  ];
  
  // 热门商品数据
  const hotProducts = [
    { 
      id: '1', 
      name: '✓快速收/无残留/不疼痛 更安心', 
      price: 53, 
      image: product1,
      tag: '热门' 
    },
    { 
      id: '2', 
      name: '德国进口酸牛奶', 
      price: 189, 
      image: product2,
      tag: '热门' 
    },
    { 
      id: '3', 
      name: 'iPhone 6S', 
      price: 5288,
      fullName: 'Apple/苹果 iPhone 6s Plus 公开版',
      image: product3,
      tag: '热门' 
    },
    { 
      id: '4', 
      name: '倩碧特惠组合套装', 
      fullName: '倩碧特水合组合3折促销',
      price: 368, 
      image: product4,
      tag: '热门' 
    },
    { 
      id: '5', 
      name: '品利特级橄榄油', 
      fullName: '750ml*4瓶赠3色 西班牙原装进口',
      price: 280, 
      image: product5,
      tag: '热门' 
    }
  ];

  // 新闻资讯
  const newsItems = [
    { id: 1, type: '特惠', content: '第一枪特别团' },
    { id: 2, type: '公告', content: '好货安安旋长实木净化防霾窗上市' },
    { id: 3, type: '特惠', content: '大牌闪购，快!' },
    { id: 4, type: '公告', content: '家装特卖您的新选择' },
    { id: 5, type: '公告', content: '家电低至五折' }
  ];
  
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('100元');
  const [rechargePrice, setRechargePrice] = useState('99.5');
  const [isRecharging, setIsRecharging] = useState(false);
  
  useEffect(() => {
    // 获取购物车数量
    const fetchCartCount = async () => {
      try {
        const response = await getCartCount();
        setCartCount(response.data.count);
      } catch (error) {
        console.error('获取购物车数量失败:', error);
        setCartCount(0);
      }
    };
    
    // 检查用户是否已登录
    const token = localStorage.getItem('token');
    if (token) {
      fetchCartCount();
    }
    
    // 监听购物车更新事件
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    
    window.addEventListener('cart-update', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-update', handleCartUpdate);
    };
  }, []);
  
  // 退出登录处理函数
  const handleLogout = () => {
    Modal.confirm({
      title: '确定要退出登录吗？',
      icon: <ExclamationCircleOutlined />,
      content: '退出后需要重新登录才能继续操作',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        logout();
        message.success('已成功退出登录');
        navigate('/login');
      }
    });
  };
  
  const handleRecharge = () => {
    // 验证电话号码
    if (!phoneNumber || phoneNumber.length !== 11) {
      message.error('请输入有效的11位手机号码');
      return;
    }

    // 设置充值中状态
    setIsRecharging(true);
    message.loading('充值处理中...', 1)
      .then(() => {
        // 模拟充值成功
        setTimeout(() => {
          setIsRecharging(false);
          message.success(`已成功为 ${phoneNumber} 充值 ${rechargeAmount}`);
          // 重置表单
          setPhoneNumber('');
        }, 1000);
      });
  };
  
  return (
    <div className="home-container">
      {/* 顶部导航条 */}
      <div className="top-nav">
        <div className="top-nav-inner">
          <div className="top-nav-left">
            <span style={{ lineHeight: '32px', display: 'inline-block' }}>送货至: 四川</span>
            <DownOutlined style={{ fontSize: '12px' }} />
          </div>
          <div className="top-nav-right">
            {localStorage.getItem('token') ? (
              <span className="nav-dropdown" style={{ lineHeight: '32px', display: 'inline-block', marginRight: '10px', position: 'relative', top: '-1px' }}>
                <span className="normal-text">欢迎回来,</span> <Link to="/user/profile" className="user-link">{JSON.parse(localStorage.getItem('user') || '{}').username}</Link>
                <Link to="/orders" className="nav-item-link" style={{ marginLeft: '15px' }}>我的订单</Link>
                <Button 
                  type="link" 
                  onClick={handleLogout} 
                  className="nav-item-link logout-link" 
                  style={{ marginLeft: '15px', padding: 0, height: 'auto', fontSize: '12px' }}
                >
                  <LogoutOutlined style={{ marginRight: '3px' }} />
                  退出登录
                </Button>
              </span>
            ) : (
              <span style={{ lineHeight: '32px', display: 'inline-block' }}>你好，请<Link to="/login" className="login-link">登录</Link>
              <Link to="/register" className="register-link">免费注册</Link></span>
            )}
            <span className="nav-dropdown" style={{ lineHeight: '32px', display: 'inline-block' }}>
              收藏夹 <DownOutlined />
            </span>
            <span className="nav-dropdown" style={{ lineHeight: '32px', display: 'inline-block' }}>
              客户服务 <DownOutlined />
            </span>
            <span className="nav-dropdown" style={{ lineHeight: '32px', display: 'inline-block' }}>
              网站导航 <DownOutlined />
            </span>
            <span className="nav-dropdown" style={{ lineHeight: '32px', display: 'inline-block' }}>
              关注我们: <span style={{ marginLeft: '5px' }}></span>
              <WeiboOutlined className="social-icon weibo-icon" /> 
              <WechatOutlined className="social-icon wechat-icon" />
            </span>
            <Link to="/mobile" className="mobile-link" style={{ lineHeight: '32px', display: 'inline-block' }}>
              <MobileFilled /> 手机版
            </Link>
          </div>
        </div>
      </div>
      
      {/* 搜索区域 */}
      <div className="search-container">
        <div className="search-inner">
          <div className="logo">
            <div className="logo-container">
              <span className="you-text">尤</span>
              <span className="hong-text">洪</span>
              <span className="logo-slogan">多·快·好·省</span>
            </div>
          </div>
          
          <div className="search-box">
            <CustomSearchInput
              placeholder="输入商品名称"
              onSearch={(value) => {
                if (value.trim()) {
                  navigate(`/products?search=${encodeURIComponent(value.trim())}`);
                } else {
                  message.info('请输入搜索内容');
                }
              }}
              pageKey="home_page"
              hotKeywords={hotSearches}
              categories={['商品', '品牌', '店铺']}
              className="search-input-container"
            />
            <div className="hot-searches">
              {hotSearches.map((item, index) => (
                <Link key={index} to={`/search?q=${item}`} className="hot-search-item">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="shopping-cart">
            <Link to="/cart" className="cart-btn">
              <ShoppingCartOutlined style={{ color: '#ff5000' }} />
              <span>购物车</span>
              <Badge count={cartCount} style={{ backgroundColor: '#ff5000' }} />
            </Link>
          </div>
        </div>
      </div>

      {/* 主导航 */}
      <div className="main-nav">
        <div className="main-nav-inner">
          <div className="category-nav">
            <div className="all-categories">全部商品分类</div>
            <div className="nav-items">
              {navItems.map(item => (
                <Link key={item.key} to={`/${item.key}`} className="nav-item">
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="promotion-tag" style={{ 
                backgroundColor: 'white', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                color: '#ff5000', 
                marginTop: '0px', 
                height: '32px', 
                lineHeight: '26px', 
                marginBottom: '4px'
              }}>
              中秋送好礼！
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="main-content">
        {/* 左侧分类菜单 */}
        <div className="category-sidebar">
          {categories.map((category) => (
            <div key={category.key} className="category-item">
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
              <RightOutlined className="category-arrow" />
              
              {category.subCategories && category.subCategories.length > 0 && (
                <div className="category-submenu">
                  <div className="submenu-content">
                    <div className="submenu-categories">
                      {category.subCategories.map((subCat, index) => (
                        <Link key={index} to={subCat.link} className="submenu-item">
                          {subCat.name}
                        </Link>
                      ))}
                    </div>
                    <div className="submenu-brands">
                      <div className="submenu-title">热门品牌</div>
                      <div className="brand-list">
                        <Link to="/brand/1" className="brand-item">品牌1</Link>
                        <Link to="/brand/2" className="brand-item">品牌2</Link>
                        <Link to="/brand/3" className="brand-item">品牌3</Link>
                        <Link to="/brand/4" className="brand-item">品牌4</Link>
                        <Link to="/brand/5" className="brand-item">品牌5</Link>
                        <Link to="/brand/6" className="brand-item">品牌6</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 中间轮播图 */}
        <div className="banner-container">
          <Carousel autoplay>
            {bannerImages.map(banner => (
              <div key={banner.id} className="banner-slide">
                <div className="banner-image">
                  <img src={banner.src} alt={banner.alt} />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
        
        {/* 右侧新闻和充值区域 */}
        <div className="right-sidebar">
          <div className="news-box">
            <div className="section-header">
              <h3 className="section-title">新闻资讯</h3>
              <Link to="/news" className="more-link">更多 &gt;</Link>
            </div>
            <div className="news-list">
              {newsItems.map(item => (
                <div key={item.id} className="news-item">
                  <span className={`news-type ${item.type === '特惠' ? 'news-type-sale' : 'news-type-notice'}`}>[{item.type}]</span>
                  <span className="news-content">{item.content}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="recharge-box">
            <div className="section-header">
              <h3 className="section-title">话费充值</h3>
            </div>
            <div className="recharge-form">
              <div className="phone-input">
                <label>号码</label>
                <Input 
                  placeholder="输入手机号" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="amount-select">
                <label>面值</label>
                <Select 
                  defaultValue="100元" 
                  style={{ width: '100%' }}
                  onChange={(value) => {
                    setRechargeAmount(value);
                    // 设置对应的价格
                    const priceMap: Record<string, string> = {
                      '50元': '49.5',
                      '100元': '99.5',
                      '200元': '198'
                    };
                    setRechargePrice(priceMap[value] || '99.5');
                  }}
                >
                  <Option value="50元">50元</Option>
                  <Option value="100元">100元</Option>
                  <Option value="200元">200元</Option>
                </Select>
                <div className="price-display">
                  <span className="current-price">¥{rechargePrice}</span>
                </div>
              </div>
              <Button 
                type="primary" 
                block 
                className="recharge-btn"
                onClick={handleRecharge}
                loading={isRecharging}
              >
                {isRecharging ? '充值中...' : '立即充值'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 热门商品 */}
      <div className="hot-products-section">
        <div className="hot-products-header">
          <AppstoreOutlined className="fire-icon" />
          <h2 className="section-title">热门商品</h2>
        </div>
        
        <div className="hot-products-container">
          {hotProducts.map(product => (
            <div key={product.id} className="product-item">
              <Link to={`/product/${product.id}`}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-fullname">{product.fullName}</div>
                  <div className="product-price">¥{product.price}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 