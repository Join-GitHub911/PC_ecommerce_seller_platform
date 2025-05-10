import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Input, Button, Carousel, Badge, List, Divider, Space, Tag, Select, message } from 'antd';
import { 
  ShoppingCartOutlined, 
  RightOutlined, 
  DownOutlined, 
  SearchOutlined,
  FireOutlined,
  HeartOutlined,
  UserOutlined,
  AppstoreOutlined,
  CoffeeOutlined,
  SkinOutlined,
  HomeOutlined,
  ExperimentOutlined,
  WomanOutlined,
  ShoppingOutlined,
  ManOutlined,
  MobileOutlined,
  GiftOutlined,
  EyeOutlined
} from '@ant-design/icons';
import CategorySidebar from '../components/CategorySidebar';
import CustomSearchInput from '../components/CustomSearchInput';
import '../styles/HomePage.css';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import product1 from '../assets/product1.png';
import product2 from '../assets/product2.png';
import product3 from '../assets/product3.png';
import product4 from '../assets/product4.png';
import product5 from '../assets/product5.png';
import { CART_COUNT_UPDATE_EVENT } from '../components/Header';
import { addToCart, getCartCount } from '../api/cart';

// 添加内联样式
const loginLinkStyle = {
  color: '#333',
  cursor: 'pointer',
  transition: 'color 0.3s'
};

const { Content } = Layout;
const { Search } = Input;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const hotSearches = ['咖啡', 'iphone 6S', '新鲜蔬菜', '蛋糕', '日用品', '连衣裙'];
  
  const [rechargePrice, setRechargePrice] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRecharging, setIsRecharging] = useState(false);

  useEffect(() => {
    // 获取购物车数量的函数
    const fetchCartCount = async () => {
      try {
        const response = await getCartCount();
        setCartCount(response.data.count);
      } catch (error) {
        console.error('获取购物车数量失败:', error);
        // 如果API请求失败，设置为0
        setCartCount(0);
      }
    };

    // 检查用户是否已登录
    const token = localStorage.getItem('token');
    if (token) {
      fetchCartCount();
    } else {
      // 未登录时设置购物车数量为0
      setCartCount(0);
    }

    // 监听购物车数量更新事件
    const handleCartCountUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener(CART_COUNT_UPDATE_EVENT, handleCartCountUpdate);
    
    return () => {
      window.removeEventListener(CART_COUNT_UPDATE_EVENT, handleCartCountUpdate);
    };
  }, []);

  const handleAddToFavorites = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    message.success(`已收藏商品 ${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    
    addToCart(productId, 1)
      .then(() => {
        message.success('添加商品到购物车成功');
        window.dispatchEvent(new Event(CART_COUNT_UPDATE_EVENT));
      })
      .catch((error: Error) => {
        console.error('添加到购物车失败:', error);
        message.error('添加到购物车失败，请稍后重试');
      });
  };

  const handleBuyNow = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    window.location.href = `/checkout?product=${productId}`;
  };

  const handleRecharge = () => {
    // 验证电话号码
    if (!phoneNumber || phoneNumber.length !== 11) {
      message.error('请输入有效的11位手机号码');
      return;
    }

    // 验证充值金额
    if (!rechargePrice) {
      message.error('请选择充值金额');
      return;
    }

    // 设置充值中状态
    setIsRecharging(true);
    message.loading('充值处理中...', 1)
      .then(() => {
        // 模拟充值成功
        setTimeout(() => {
          setIsRecharging(false);
          message.success(`已成功为 ${phoneNumber} 充值 ${rechargePrice} 元`);
          // 重置表单
          setPhoneNumber('');
        }, 1000);
      });
  };

  const categoryItems = [
    { 
      title: '进口食品、生鲜', 
      icon: <AppstoreOutlined />,
      subCategories: [
        { title: '进口零食', items: ['巧克力', '饼干', '糖果', '坚果'] },
        { title: '进口乳制品', items: ['牛奶', '奶酪', '黄油', '酸奶'] },
        { title: '肉类海鲜', items: ['牛肉', '猪肉', '三文鱼', '虾'] },
        { title: '新鲜水果', items: ['苹果', '香蕉', '橙子', '草莓'] },
        { title: '新鲜蔬菜', items: ['西红柿', '黄瓜', '胡萝卜', '土豆'] }
      ],
      featuredProducts: [
        { 
          image: 'https://img.alicdn.com/bao/uploaded/i4/1714128138/O1CN01r4JJVg29zFnzJIlnP_!!0-item_pic.jpg', 
          title: '澳洲进口牛排', 
          price: 99 
        },
        { 
          image: 'https://img.alicdn.com/bao/uploaded/i3/2200724907121/O1CN01mUhZc922AEGeXKWw4_!!0-item_pic.jpg', 
          title: '新西兰奶粉', 
          price: 199 
        },
        { 
          image: 'https://img.alicdn.com/bao/uploaded/i2/2200724907121/O1CN01Qu3sNG22AEGZgLCTm_!!0-item_pic.jpg', 
          title: '泰国金枕头榴莲', 
          price: 89 
        }
      ]
    },
    { 
      title: '食品、饮料、酒', 
      icon: <CoffeeOutlined />,
      subCategories: [
        { title: '休闲零食', items: ['薯片', '膨化食品', '坚果炒货', '肉干肉脯'] },
        { title: '饮料冲调', items: ['茶饮料', '咖啡', '果汁', '功能饮料'] },
        { title: '白酒', items: ['茅台', '五粮液', '洋河', '剑南春'] },
        { title: '葡萄酒', items: ['法国', '意大利', '西班牙', '智利'] },
        { title: '啤酒', items: ['国产啤酒', '进口啤酒', '精酿啤酒'] }
      ],
      featuredProducts: [
        { 
          image: 'https://img.alicdn.com/bao/uploaded/i1/2616970884/O1CN01IOXbz41IOphZJFGj9_!!0-item_pic.jpg', 
          title: '茅台飞天53度', 
          price: 2999 
        },
        { 
          image: 'https://img.alicdn.com/bao/uploaded/i3/2200724907121/O1CN01Gzzc9622AEGjmjm5v_!!0-item_pic.jpg', 
          title: '百威啤酒', 
          price: 99 
        },
        { 
          image: 'https://img.alicdn.com/bao/uploaded/i4/2207316867848/O1CN01QDaYKU27zdHu5QsFM_!!0-item_pic.jpg', 
          title: '法国拉菲红酒', 
          price: 599 
        }
      ]
    },
    { 
      title: '母婴、玩具、童装', 
      icon: <HeartOutlined />,
      subCategories: [
        { title: '奶粉', items: ['1段', '2段', '3段', '4段'] },
        { title: '纸尿裤', items: ['新生儿', 'S', 'M', 'L', 'XL'] },
        { title: '玩具', items: ['益智玩具', '积木拼插', '遥控电动', '毛绒玩具'] },
        { title: '童装', items: ['连衣裙', 'T恤', '裤子', '套装'] },
        { title: '童鞋', items: ['学步鞋', '运动鞋', '皮鞋', '凉鞋'] }
      ],
      featuredProducts: [
        { image: 'https://via.placeholder.com/80', title: '花王纸尿裤', price: 199 },
        { image: 'https://via.placeholder.com/80', title: '乐高积木', price: 499 },
        { image: 'https://via.placeholder.com/80', title: '童装套装', price: 129 }
      ]
    },
    { 
      title: '家居、家庭清洁、纸品', 
      icon: <HomeOutlined />,
      subCategories: [
        { title: '床上用品', items: ['四件套', '被子', '枕头', '床垫'] },
        { title: '家具', items: ['沙发', '床', '桌子', '椅子'] },
        { title: '家居饰品', items: ['装饰画', '花瓶', '摆件', '地毯'] },
        { title: '清洁剂', items: ['洗衣液', '洗洁精', '消毒剂', '洁厕剂'] },
        { title: '纸品湿巾', items: ['抽纸', '卫生纸', '厨房纸', '湿纸巾'] }
      ],
      featuredProducts: [
        { image: 'https://via.placeholder.com/80', title: '全棉四件套', price: 299 },
        { image: 'https://via.placeholder.com/80', title: '立白洗衣液', price: 49.9 },
        { image: 'https://via.placeholder.com/80', title: '维达抽纸', price: 39.9 }
      ]
    },
    { 
      title: '美妆、个人护理、洗护', 
      icon: <ExperimentOutlined />,
      subCategories: [
        { title: '面部护肤', items: ['面霜', '洁面', '面膜', '精华'] },
        { title: '彩妆', items: ['口红', '粉底', '眼影', '睫毛膏'] },
        { title: '香水彩妆', items: ['香水', '香体', '美甲', '化妆工具'] },
        { title: '洗发护发', items: ['洗发水', '护发素', '发膜', '染发'] },
        { title: '身体护理', items: ['沐浴露', '身体乳', '手部保养', '足部护理'] }
      ],
      featuredProducts: [
        { image: 'https://via.placeholder.com/80', title: '兰蔻小黑瓶', price: 899 },
        { image: 'https://via.placeholder.com/80', title: 'MAC口红', price: 199 },
        { image: 'https://via.placeholder.com/80', title: '飘柔洗发水', price: 49.9 }
      ]
    },
    { 
      title: '女装、内衣、中老年', 
      icon: <WomanOutlined />,
      subCategories: [
        { title: '上装', items: ['T恤', '衬衫', '毛衣', '卫衣'] },
        { title: '裤装', items: ['牛仔裤', '休闲裤', '阔腿裤', '打底裤'] },
        { title: '裙装', items: ['连衣裙', '半身裙', '长裙', '短裙'] },
        { title: '内衣', items: ['文胸', '内裤', '保暖内衣', '睡衣'] },
        { title: '中老年装', items: ['妈妈装', '奶奶装', '中老年裙装', '中老年外套'] }
      ],
      featuredProducts: [
        { image: 'https://via.placeholder.com/80', title: '连衣裙', price: 199 },
        { image: 'https://via.placeholder.com/80', title: '内衣套装', price: 99 },
        { image: 'https://via.placeholder.com/80', title: '中老年外套', price: 269 }
      ]
    },
    { 
      title: '鞋靴、箱包、腕表配饰', 
      icon: <ShoppingOutlined />,
      subCategories: [
        { title: '时尚女鞋', items: ['单鞋', '高跟鞋', '靴子', '休闲鞋'] },
        { title: '流行男鞋', items: ['商务鞋', '休闲鞋', '运动鞋', '增高鞋'] },
        { title: '潮流女包', items: ['单肩包', '手提包', '斜挎包', '双肩包'] },
        { title: '精品男包', items: ['商务公文包', '单肩包', '斜挎包', '钱包'] },
        { title: '功能箱包', items: ['拉杆箱', '旅行包', '电脑包', '钱包卡包'] }
      ],
      featuredProducts: [
        { image: 'https://via.placeholder.com/80', title: '高跟鞋', price: 299 },
        { image: 'https://via.placeholder.com/80', title: '手提包', price: 399 },
        { image: 'https://via.placeholder.com/80', title: '拉杆箱', price: 499 }
      ]
    },
    { 
      title: '男装、运动', 
      icon: <ManOutlined />,
      subCategories: [
        { title: '男士外套', items: ['夹克', '西装', '羽绒服', '风衣'] },
        { title: '男士内搭', items: ['衬衫', 'T恤', 'POLO衫', '卫衣'] },
        { title: '男士裤装', items: ['牛仔裤', '休闲裤', '西裤', '短裤'] },
        { title: '运动服装', items: ['运动套装', '运动裤', '运动T恤', '训练服'] },
        { title: '运动鞋', items: ['跑步鞋', '篮球鞋', '训练鞋', '户外鞋'] }
      ],
      featuredProducts: [
        { image: 'https://via.placeholder.com/80', title: '男士衬衫', price: 199 },
        { image: 'https://via.placeholder.com/80', title: '牛仔裤', price: 249 },
        { image: 'https://via.placeholder.com/80', title: '耐克跑鞋', price: 699 }
      ]
    },
    { 
      title: '手机、小家电、电脑', 
      icon: <MobileOutlined />,
      subCategories: [
        { title: '手机', items: ['苹果', '华为', '小米', 'OPPO'] },
        { title: '手机配件', items: ['手机壳', '贴膜', '充电器', '数据线'] },
        { title: '电脑整机', items: ['笔记本', '台式机', '平板电脑', '一体机'] },
        { title: '电脑配件', items: ['显示器', '硬盘', '内存', '键鼠'] },
        { title: '厨房小电', items: ['电饭煲', '电水壶', '微波炉', '电磁炉'] }
      ],
      featuredProducts: [
        { image: 'https://via.placeholder.com/80', title: 'iPhone 14', price: 5999 },
        { image: 'https://via.placeholder.com/80', title: '华为笔记本', price: 5499 },
        { image: 'https://via.placeholder.com/80', title: '小米电饭煲', price: 299 }
      ]
    },
    { 
      title: '礼品、充值', 
      icon: <GiftOutlined />,
      subCategories: [
        { title: '创意礼品', items: ['送女友', '送男友', '送长辈', '送同事'] },
        { title: '鲜花绿植', items: ['鲜花速递', '永生花', '绿植盆栽', '多肉植物'] },
        { title: '礼品卡', items: ['购物卡', '礼品卡', '充值卡', '游戏点卡'] },
        { title: '充值', items: ['话费充值', '流量充值', '游戏充值', '生活缴费'] },
        { title: '特色礼品', items: ['纪念品', '工艺品', '收藏品', '定制礼品'] }
      ],
      featuredProducts: [
        { image: 'https://via.placeholder.com/80', title: '永生花礼盒', price: 199 },
        { image: 'https://via.placeholder.com/80', title: '充值卡100元', price: 98 },
        { image: 'https://via.placeholder.com/80', title: '创意小夜灯', price: 89 }
      ]
    },
  ];
  
  const bannerImages = [
    {
      image: banner1
    },
    {
      image: banner2
    },
    {
      image: banner3
    }
  ];
  
  const newsItems = [
    { type: '特惠', title: '每一轮明月 表无尽惦念' },
    { type: '公告', title: '好奇金鸵成长蜂新品上市' },
    { type: '特惠', title: '大牌闪购，抢！' },
    { type: '公告', title: '发福利 买车就给千元油卡' },
    { type: '公告', title: '家电低至五折' },
  ];
  
  const hotProducts = [
    {
      id: 'p1',
      image: product1,
      title: '✓快速收 ✓无残留 ✓不刺激 更安心',
      price: 53.00,
      sales: '16R'
    },
    {
      id: 'p2',
      image: product2,
      title: '德国进口酸牛奶',
      price: 189,
      sales: '26R'
    },
    {
      id: 'p3',
      image: product3,
      title: 'iPhone 6S',
      description: 'Apple/苹果 iPhone 6s Plus公开版',
      price: 5288,
      sales: '25R'
    },
    {
      id: 'p4',
      image: product4,
      title: '倩碧特惠组合套装',
      description: '倩碧补水组合装8折促销',
      price: 368,
      sales: '18R'
    },
    {
      id: 'p5',
      image: product5,
      title: '品利特级橄榄油',
      description: '750ml*4瓶赠3色 西班牙原装进口',
      price: 280,
      sales: '30R'
    }
  ];
  
  // 处理搜索
  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value)}`);
    }
  };

  // 首页热门搜索词
  const homeHotKeywords = [
    '智能手机', '笔记本电脑', '品利特级初榨橄榄油', '德亚酸奶', 
    '倩碧黄油', '凡茜眼霜', '面膜', '时尚女装'
  ];

  return (
    <Layout className="homepage">
      {/* 添加CSS样式 */}
      <style>
        {`
          .login-link:hover {
            color: #ff5000 !important;
          }
          
          .recharge-dropdown {
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          
          .ant-select-selector {
            border-color: #ddd !important;
          }
          
          .ant-select-focused .ant-select-selector,
          .ant-input:focus {
            border-color: #ff5000 !important;
            box-shadow: 0 0 0 2px rgba(255, 80, 0, 0.1) !important;
          }
        `}
      </style>
      
      {/* Top Navigation Bar */}
      <div className="top-navbar">
        <div className="container">
          <div className="location">
            送货至: 四川 <DownOutlined />
          </div>
          <div className="top-links">
            <span>你好，请<Link to="/login" style={loginLinkStyle} className="login-link">登录</Link></span>
            <Link to="/register" style={{ color: '#ff5000' }}>免费注册</Link>
            <span className="divider">|</span>
            <Link to="/orders" style={{ color: '#333' }}>我的订单</Link>
            <span className="divider">|</span>
            <span>收藏夹 <DownOutlined /></span>
            <span className="divider">|</span>
            <span>客户服务 <DownOutlined /></span>
            <span className="divider">|</span>
            <span>网站导航 <DownOutlined /></span>
            <span className="divider">|</span>
            <span>关注我们: <span className="icon">🔴</span> <span className="icon">🔵</span></span>
            <span className="divider">|</span>
            <span className="mobile-version">手机版 <span className="icon">📱</span></span>
          </div>
        </div>
      </div>
      
      <Content className="main-content">
        <div className="container">
          {/* Logo, Search and Cart */}
          <div className="header-section">
            <div className="logo">
              <Link to="/">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>
                    <span style={{ fontSize: '32px', color: '#ff5500' }}>尤</span><span style={{ fontSize: '28px', color: '#666' }}>洪</span>
                  </span>
                  <span style={{ fontSize: '14px', color: '#ff5500', marginLeft: '8px' }}>多·快·好·省</span>
                  <span style={{ display: 'none' }}>商城</span>
                </div>
              </Link>
            </div>
            
            <div className="search-section">
              <CustomSearchInput
                placeholder="搜索商品"
                onSearch={handleSearch}
                pageKey="home_page"
                hotKeywords={homeHotKeywords}
                categories={['商品', '品牌', '店铺']}
                style={{ width: '100%' }}
              />
            </div>
            
            <div className="cart-section">
              <Link to="/cart" className="cart-link">
                <ShoppingCartOutlined style={{ color: '#ff5000' }} /> 购物车 <Badge count={cartCount} style={{ backgroundColor: '#ff5000' }} /> <DownOutlined />
              </Link>
            </div>
          </div>
          
          {/* Main Navigation */}
          <div className="main-nav-container">
            <div className="main-nav">
              <div className="all-categories">
                <h3>全部商品分类</h3>
              </div>
              <div className="nav-links">
                <Link to="/" className="nav-link active">首页</Link>
                <Link to="/food" className="nav-link">美食</Link>
                <Link to="/fresh" className="nav-link">生鲜</Link>
                <Link to="/home" className="nav-link">家居</Link>
                <Link to="/women" className="nav-link">女装</Link>
                <Link to="/beauty" className="nav-link">美妆</Link>
                <Link to="/digital" className="nav-link">数码</Link>
                <Link to="/group" className="nav-link">团购</Link>
              </div>
              <div className="promo-link">
                <Link to="/promo" className="festival-promo" style={{ color: '#ff5000', backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px' }}>中秋送好礼！</Link>
              </div>
            </div>
          </div>
          
          {/* Main Content Area with Categories */}
          <div className="main-content-wrapper">
            <CategorySidebar categories={categoryItems} />
            
            {/* Main Banner and Content */}
            <div className="main-banner-area">
              {/* Banner */}
              <div className="main-banner">
                <Carousel autoplay effect="fade">
                  {bannerImages.map((banner, index) => (
                    <div key={index} className="banner-slide">
                      <div className="banner-content">
                        <img 
                          src={banner.image} 
                          alt="Banner" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* News and Announcements */}
              <div className="news-section">
                <div className="section-header">
                  <h3>新闻资讯</h3>
                  <Link to="/news" className="more-link">更多 &gt;</Link>
                </div>
                <div style={{ padding: '4px 0' }}>
                  {newsItems.map((item, index) => (
                    <div key={index} style={{ 
                      lineHeight: '24px', 
                      fontSize: '12px', 
                      display: 'flex', 
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }}>
                      <span style={{ 
                        color: '#333', 
                        fontWeight: 'normal', 
                        minWidth: '40px',
                        fontSize: '11px'
                      }}>[{item.type}]</span>
                      <span style={{ 
                        color: '#999',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 'calc(100% - 40px)'
                      }}>{item.title}</span>
                    </div>
                  ))}
                </div>
                
                {/* Recharge Section */}
                <div className="recharge-section">
                  <div className="section-header">
                    <h3>话费充值</h3>
                  </div>
                  <div className="recharge-form" style={{ marginBottom: '15px' }}>
                    <div className="form-item" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <label style={{ width: '40px', fontSize: '13px', color: '#666' }}>号码</label>
                      <Input 
                        placeholder="输入手机号" 
                        size="middle" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        style={{ 
                          flex: 1,
                          borderRadius: '4px',
                          borderColor: '#ddd',
                          height: '32px'
                        }} 
                      />
                    </div>
                    <div className="form-item" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                      <label style={{ width: '40px', fontSize: '13px', color: '#666' }}>面值</label>
                      <div style={{ 
                        position: 'relative',
                        flex: 1,
                      }}>
                        <Select
                          placeholder="选择充值额"
                          defaultValue="100"
                          style={{ width: '100%' }}
                          popupClassName="recharge-dropdown"
                          options={[
                            { value: '30', label: '30元', price: '29.8' },
                            { value: '50', label: '50元', price: '49.5' },
                            { value: '100', label: '100元', price: '99.5' },
                            { value: '200', label: '200元', price: '198' },
                            { value: '300', label: '300元', price: '297' },
                            { value: '500', label: '500元', price: '495' },
                          ]}
                          onChange={(value, option) => {
                            // @ts-ignore
                            setRechargePrice(option.price);
                          }}
                        />
                      </div>
                      <span style={{ marginLeft: '10px', color: '#ff5500', fontSize: '14px' }}>¥{rechargePrice}</span>
                    </div>
                    <Button 
                      type="primary" 
                      onClick={handleRecharge}
                      loading={isRecharging}
                      style={{ 
                        backgroundColor: '#ff5000', 
                        borderColor: '#ff5000', 
                        width: '100%',
                        height: '34px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        marginTop: '2px'
                      }}
                    >
                      {isRecharging ? '充值中...' : '立即充值'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hot Products - 完全按照图片样式 */}
          <div className="hot-products-wrapper">
            <div className="hot-products-title">
              <FireOutlined style={{ marginRight: '5px', color: '#ff5000' }} />
              热门商品
            </div>
            <div className="hot-products-grid">
              {hotProducts.map(product => (
                <div key={product.id} className="hot-product-item">
                  <Link to={`/products/${product.id}`} className="product-link">
                    <div className="hot-product-image">
                      <img src={product.image} alt={product.title} />
                      <div className="product-hover-btns">
                        <Button 
                          className="quick-buy-btn" 
                          size="small" 
                          type="primary" 
                          onClick={(e) => handleBuyNow(e, product.id)}
                        >
                          立即购买
                        </Button>
                        <div className="product-icons">
                          <HeartOutlined 
                            className="product-icon" 
                            title="收藏" 
                            onClick={(e) => handleAddToFavorites(e, product.id)}
                          />
                          <ShoppingCartOutlined 
                            className="product-icon" 
                            title="加入购物车" 
                            onClick={(e) => handleAddToCart(e, product.id)}
                          />
                          <EyeOutlined 
                            className="product-icon" 
                            title="查看详情" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="hot-product-info">
                      <div className="hot-product-title" style={product.id === 'p1' ? { backgroundColor: 'white', padding: '2px 5px', borderRadius: '2px' } : {}}>
                        {product.title}
                      </div>
                      {product.description && <div className="product-desc">{product.description}</div>}
                      <div className="hot-product-price">¥{product.price}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default HomePage; 