import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Image, 
  Typography, 
  Divider, 
  Button, 
  InputNumber, 
  Tabs, 
  Rate, 
  Card, 
  List, 
  Avatar, 
  Tag, 
  Space, 
  message, 
  Skeleton,
  Table,
  Empty,
  Breadcrumb,
  Tooltip,
  Badge
} from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  ShareAltOutlined, 
  LikeOutlined, 
  MessageOutlined, 
  StarOutlined,
  HomeOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  EnvironmentOutlined,
  RightOutlined,
  ArrowRightOutlined,
  DownOutlined,
  SearchOutlined,
  ShoppingOutlined,
  LeftOutlined,
  GiftOutlined,
  DollarOutlined,
  SafetyOutlined,
  CarOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { getProductById, getProductReviews, addToFavorites, getRecommendedProducts } from '../api/product';
import { addToCart, getCartCount, getLocalCart } from '../api/cart';
import { isUserLoggedIn } from '../api/auth';
import './ProductDetail.css';

// 导入我们的自定义组件
import ProductPromotions from '../components/ProductPromotions';
import ProductSpecialOffers from '../components/ProductSpecialOffers';
import ProductSpecModal from '../components/ProductSpecModal';
import FloatingCartButton from '../components/FloatingCartButton';

// 在文件顶部导入事件名
import { CART_COUNT_UPDATE_EVENT, updateGlobalCartCount } from '../components/Header';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  details?: string;
  specifications?: Record<string, any>[];
  mainImage: string;
  images: string[];
  sales: number;
  stock: number;
  rating: number;
  categoryId?: string;
  categoryName?: string;
  brand?: string;
  isNew?: boolean;
  discount?: number;
  shopId?: string;
  shopName?: string;
  shopLogo?: string;
  shopRating?: number;
  deliveryInfo?: Record<string, any>;
  serviceInfo?: Record<string, any>;
  reviewCount?: number;
  purchaseInfo?: Record<string, any>;
}

interface ProductReview {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
  isAnonymous: boolean;
  reply?: string;
  replyAt?: string;
}

// 修复linter错误，添加接口定义
interface PurchaseInfoProps {
  info: {
    gift?: string;
    bundle?: string;
    warranty?: string;
    shipment?: string;
    payment?: string;
  }
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  const [selectedSpec, setSelectedSpec] = useState<Record<string, string>>({});
  const [thumbnailScroll, setThumbnailScroll] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isSpecModalVisible, setIsSpecModalVisible] = useState(false);
  const [buyNowMode, setBuyNowMode] = useState(false);
  const [isUserLoggedInState, setIsUserLoggedInState] = useState(false);
  
  // 用于缩略图列表的引用
  const thumbnailListRef = React.useRef<HTMLDivElement>(null);

  // 模拟规格数据
  const specOptions = {
    颜色: ['玫瑰金色', '金色', '银色', '深空灰色'],
    容量: ['16GB', '32GB', '64GB', '128GB'],
    网络: ['全网通', '联通/电信', '移动/联通'],
    套餐: ['官方标配', '套餐一', '套餐二', '套餐三'],
  };
  
  // 卸妆油规格数据
  const cleanserSpecOptions = {
    规格: ['200ml正装', '200ml*2瓶装', '100ml旅行装', '30ml随身装', '200ml+100ml套装'],
    功效: ['深层清洁型', '温和滋润型', '清爽控油型', '舒缓修护型', '敏感肌专用'],
    适用肤质: ['干性肌肤', '油性肌肤', '混合型肌肤', '敏感肌肤', '所有肤质'],
    主要成分: ['白茶精华', '橄榄精华', '茶树精油', '玫瑰精华', '积雪草提取物'],
    使用场景: ['日常卸妆', '防水彩妆卸除', '深层清洁', '旅行便携', '孕妇可用']
  };

  // 德国酸奶规格数据
  const yogurtSpecOptions = {
    规格: ['200ml*10盒', '200ml*24盒', '200ml*36盒', '100ml*10盒(迷你装)', '200ml*6盒(尝鲜装)'],
    口味: ['原味', '蓝莓味', '草莓味', '香草味', '水蜜桃味', '芒果味'],
    包装方式: ['纸盒装', '塑料瓶装', '玻璃瓶装', '礼盒装', '家庭装'],
    保质期: ['21天(冷藏)', '30天(冷藏)', '45天(常温)'],
    产地: ['德国原装进口', '中德合资工厂', '国内授权生产']
  };

  // 倩碧护肤套装规格数据
  const cliniqueSkinCareOptions = {
    套装类型: ['基础护肤套装(黄油+粉水)', '明星套装(含洁面啫喱)', '限量珍藏版套装', '旅行便携套装', '礼盒装'],
    适用肤质: ['干性肌肤', '中性肌肤', '混合性肌肤', '油性肌肤', '敏感性肌肤'],
    护理重点: ['补水保湿', '舒缓修护', '控油平衡', '提亮肤色', '紧致抗老'],
    容量选择: ['标准装(125ml+200ml)', '旅行装(50ml+100ml)', '超值装(200ml+400ml)', '迷你体验装(30ml+50ml)'],
    适用季节: ['四季通用', '干燥秋冬', '潮湿夏季', '换季保养']
  };

  // 橄榄油规格数据
  const oliveOilOptions = {
    容量: ['250ml便携装', '500ml单瓶装', '750ml单瓶装', '1L单瓶装', '1L*2瓶礼盒装'],
    产地: ['西班牙', '意大利', '希腊'],
    品质等级: ['特级初榨', '初榨', '纯正'],
    包装: ['玻璃瓶装', '铁罐装', '礼盒装'],
    套装: ['单瓶装', '双瓶装', '尊享礼盒(赠酒刀)', '年货礼盒(赠橄榄油醋)']
  };

  // iPhone规格数据
  const iphoneOptions = {
    颜色: ['玫瑰金色', '金色', '银色', '深空灰色', '黑色'],
    存储容量: ['16GB', '32GB', '64GB', '128GB', '256GB'],
    网络类型: ['全网通', '电信版', '移动版', '联通版', '国际版'],
    机身状态: ['99新', '95新', '9成新', '8成新', '全新原封'],
    套餐: ['官方标配', '套餐一(配保护壳)', '套餐二(配贴膜+保护壳)', '套餐三(配耳机+充电器+保护壳)', '尊享套餐(配全套配件)'],
    保修服务: ['官方保修', '延长保修1年', '碎屏保障服务', 'AppleCare+服务', '无保修']
  };

  // 模拟促销数据
  const promotions = [
    { type: 'Apple专享', description: '购买iPhone享12期免息' },
    { type: '以旧换新', description: '最高可抵2000元' },
    { type: '满减优惠', description: '满3000元减300元' }
  ];
  
  // 卸妆油促销数据
  const cleanserPromotions = [
    { type: '限时特惠', description: '超值促销价53元' },
    { type: '赠品', description: '赠送5片面膜' },
    { type: '满减优惠', description: '满100元减10元' }
  ];

  // 德国酸奶促销数据
  const yogurtPromotions = [
    { type: '限时促销', description: '春季特惠8折' },
    { type: '第二件半价', description: '指定商品第二件半价' },
    { type: '满减活动', description: '满199元减50元' }
  ];

  // 倩碧护肤套装促销数据
  const cliniqueSkinCarePromotions = [
    { type: '限时礼遇', description: '春季新款8.5折' },
    { type: '赠礼优惠', description: '赠送洁面泡沫15ml小样' },
    { type: '满减活动', description: '满499元减100元' }
  ];

  // 橄榄油促销数据
  const oliveOilPromotions = [
    { type: '年货节特惠', description: '限时特价280元' },
    { type: '满送活动', description: '满299元送橄榄油醋套装' },
    { type: '满减活动', description: '满500元减50元' }
  ];

  // 模拟红包和淘金币数据
  const coupons = {
    redEnvelope: '25元',
    goldCoins: '0.90元'
  };

  // 模拟配送信息
  const deliveryInfo = {
    address: '广东深圳市福田区',
    services: ['顺丰快递', '24小时内发货', '全国联保', 'Apple Care服务', '贴心售后']
  };

  useEffect(() => {
    fetchProductDetails();
    // 检查用户是否登录
    setIsUserLoggedInState(isUserLoggedIn());
  }, [id]);

  // 初始设置iPhone 6s的颜色选择
  useEffect(() => {
    if (id === 'p3' && product && product.images) {
      // 默认选择玫瑰金色
      setSelectedSpec({
        ...selectedSpec,
        '颜色': '玫瑰金色'
      });
      
      // 过滤显示玫瑰金色的图片
      const roseGoldImages = product.images.filter(img => img.includes('玫瑰金'));
      if (roseGoldImages.length > 0) {
        setSelectedImage(roseGoldImages[0]);
      }
    }
  }, [product, id]);

  const fetchProductDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // 获取商品详情
      const productResponse = await getProductById(id);
      const productData = productResponse.data;
      
      // 根据商品ID设置不同的商品信息
      let mockProductData;
      
      if (id === 'p1' || id === 'cleanser1' || id === '1') {
        // 凡茜卸妆油
        mockProductData = {
          ...productData,
          name: "凡茜白茶毛孔细致卸妆油200ml官方旗舰店正品卸妆女",
          price: 53,
          originalPrice: 99,
          sales: 3258,
          description: "深层清洁 温和不刺激 无添加 卸妆洁面二合一",
          brand: "凡茜",
          shopId: '1002',
          shopName: '凡茜官方旗舰店',
          shopLogo: '/src/assets/shop-logos/fanxi-logo.png',
          shopRating: 4.9,
          categoryId: 'beauty001',
          categoryName: '美妆个护 > 面部护理 > 卸妆产品',
          stock: 999,
          rating: 4.8,
          reviewCount: 5238,
          deliveryInfo: {
            address: '广东广州市',
            services: ['顺丰快递', '24小时内发货', '7天无理由退换', '正品保证', '极速退款']
          },
          specifications: {
            规格: ['200ml正装', '200ml*2瓶装', '100ml旅行装', '30ml随身装', '200ml+100ml套装'],
            功效: ['深层清洁型', '温和滋润型', '清爽控油型', '舒缓修护型', '敏感肌专用'],
            适用肤质: ['干性肌肤', '油性肌肤', '混合型肌肤', '敏感肌肤', '所有肤质'],
            主要成分: ['白茶精华', '橄榄精华', '茶树精油', '玫瑰精华', '积雪草提取物'],
            使用场景: ['日常卸妆', '防水彩妆卸除', '深层清洁', '旅行便携', '孕妇可用']
          },
          details: `
            <div class="product-detail-content">
              <h3>产品介绍</h3>
              <p>凡茜白茶毛孔细致卸妆油是专为所有肤质设计的温和卸妆产品。融合白茶精华与优质植物油配方，能快速溶解彩妆和防晒，同时滋润肌肤，不会造成刺激或紧绷感。</p>
              
              <h3>主要功效</h3>
              <ul>
                <li>深层清洁：轻松溶解顽固防晒、彩妆，彻底清洁毛孔</li>
                <li>毛孔细致：持续使用能改善粗大毛孔，使肌肤更加细腻</li>
                <li>温和配方：无色素、无酒精，适合敏感肌使用</li>
                <li>二合一设计：卸妆同时清洁，省去二次洁面步骤</li>
              </ul>
              
              <h3>使用方法</h3>
              <p>取适量卸妆油于掌心，轻轻按摩于干燥面部，待彩妆溶解后，加水乳化，再用清水彻底洗净即可。</p>
              
              <h3>规格参数</h3>
              <table class="spec-detailed-table">
                <tr>
                  <td class="spec-label">产品名称</td>
                  <td class="spec-value">凡茜白茶毛孔细致卸妆油</td>
                </tr>
                <tr>
                  <td class="spec-label">净含量</td>
                  <td class="spec-value">200ml</td>
                </tr>
                <tr>
                  <td class="spec-label">保质期</td>
                  <td class="spec-value">36个月</td>
                </tr>
                <tr>
                  <td class="spec-label">适用肤质</td>
                  <td class="spec-value">所有肤质，包括敏感肌</td>
                </tr>
                <tr>
                  <td class="spec-label">主要成分</td>
                  <td class="spec-value">白茶精华、橄榄油、荷荷巴油、葡萄籽油等</td>
                </tr>
                <tr>
                  <td class="spec-label">产地</td>
                  <td class="spec-value">中国</td>
                </tr>
              </table>
              
              <div class="product-images-gallery">
                <img src="/src/assets/product1-1.png" alt="凡茜卸妆油展示图1" />
                <img src="/src/assets/product1-2.png" alt="凡茜卸妆油展示图2" />
                <img src="/src/assets/product1-3.png" alt="凡茜卸妆油展示图3" />
                <img src="/src/assets/product1-4.png" alt="凡茜卸妆油展示图4" />
              </div>
            </div>
          `,
          // 使用静态资源路径
          mainImage: '/src/assets/product1-1.png',
          images: [
            '/src/assets/product1-1.png',
            '/src/assets/product1-2.png',
            '/src/assets/product1-3.png',
            '/src/assets/product1-4.png'
          ]
        };
      } else if (id === 'p2' || id === 'yogurt1' || id === '2') {
        // 德亚酸奶
        mockProductData = {
          ...productData,
          name: "德国原装进口德亚原味酸奶纯牛奶制作200ml*24盒整箱新老包装随机 200ml*10盒",
          price: 189,
          originalPrice: 239,
          sales: 5678,
          description: "德国原装进口 新老包装随机发货 冷链配送",
          brand: "德亚(Desira)",
          shopId: '1003',
          shopName: '德亚优选进口食品店',
          shopLogo: '/src/assets/shop-logos/desira-logo.png',
          shopRating: 4.8,
          categoryId: 'food002',
          categoryName: '食品饮料 > 乳制品 > 酸奶',
          stock: 500,
          rating: 4.7,
          reviewCount: 3687,
          deliveryInfo: {
            address: '北京市朝阳区',
            services: ['冷链配送', '48小时内发货', '正品保证', '破损包赔', '食品安全保障']
          },
          specifications: {
            规格: ['200ml*10盒', '200ml*24盒', '200ml*36盒', '100ml*10盒(迷你装)', '200ml*6盒(尝鲜装)'],
            口味: ['原味', '蓝莓味', '草莓味', '香草味', '水蜜桃味', '芒果味'],
            包装方式: ['纸盒装', '塑料瓶装', '玻璃瓶装', '礼盒装', '家庭装'],
            保质期: ['21天(冷藏)', '30天(冷藏)', '45天(常温)'],
            产地: ['德国原装进口', '中德合资工厂', '国内授权生产']
          },
          details: `
            <div class="product-detail-content">
              <h3>产品介绍</h3>
              <p>德亚原味酸奶采用德国原装进口，100%德国牧场奶源，经典原味配方，醇厚浓郁，酸甜适口。每一盒都保证冷链运输，锁住纯正好味道。</p>
              
              <h3>产品特点</h3>
              <ul>
                <li>原装进口：德国原厂生产，100%进口</li>
                <li>优质奶源：严选德国高品质牧场奶源</li>
                <li>经典原味：传统发酵工艺，醇厚不腻口</li>
                <li>营养丰富：富含蛋白质、钙质和活性益生菌</li>
              </ul>
              
              <h3>规格参数</h3>
              <table class="spec-detailed-table">
                <tr>
                  <td class="spec-label">产品名称</td>
                  <td class="spec-value">德亚原味酸奶</td>
                </tr>
                <tr>
                  <td class="spec-label">净含量</td>
                  <td class="spec-value">200ml*10盒/200ml*24盒</td>
                </tr>
                <tr>
                  <td class="spec-label">保质期</td>
                  <td class="spec-value">21天（冷藏保存）</td>
                </tr>
                <tr>
                  <td class="spec-label">储存方式</td>
                  <td class="spec-value">2-6℃冷藏保存</td>
                </tr>
                <tr>
                  <td class="spec-label">产地</td>
                  <td class="spec-value">德国</td>
                </tr>
                <tr>
                  <td class="spec-label">配料表</td>
                  <td class="spec-value">巴氏杀菌全脂牛奶，活性乳酸菌</td>
                </tr>
              </table>
              
              <h3>营养信息</h3>
              <p>每100ml含：能量270kJ，蛋白质3.5g，脂肪3.5g，碳水化合物4.5g，钙120mg</p>
              
              <div class="product-images-gallery">
                <img src="/src/assets/德亚酸奶1.png" alt="德亚酸奶展示图1" />
                <img src="/src/assets/德亚酸奶2.png" alt="德亚酸奶展示图2" />
                <img src="/src/assets/德亚酸奶3.png" alt="德亚酸奶展示图3" />
                <img src="/src/assets/德亚酸奶4.png" alt="德亚酸奶展示图4" />
              </div>
            </div>
          `,
          mainImage: '/src/assets/德亚酸奶1.png',
          images: [
            '/src/assets/德亚酸奶1.png',
            '/src/assets/德亚酸奶2.png',
            '/src/assets/德亚酸奶3.png',
            '/src/assets/德亚酸奶4.png'
          ]
        };
      } else if (id === 'p3' || id === '3') {
        // iPhone 6s Plus
        mockProductData = {
          ...productData,
          name: "Apple/iPhone 6s Plus全网通手机正品学生老人机备用6s苹果手机",
          price: 5288,
          originalPrice: 6288,
          sales: 3145,
          description: "全网通4G手机 高清拍照 长待机",
          brand: "Apple",
          shopId: '1001',
          shopName: '智汇数码专营店',
          shopLogo: '/src/assets/shop-logos/digital-logo.png',
          shopRating: 4.8,
          categoryId: 'digital001',
          categoryName: '手机数码 > 手机 > 苹果手机',
          stock: 200,
          rating: 4.9,
          reviewCount: 2583,
          deliveryInfo: {
            address: '广东深圳市福田区',
            services: ['顺丰快递', '24小时内发货', '全国联保', 'Apple Care服务', '贴心售后']
          },
          specifications: {
            颜色: ['玫瑰金色', '金色', '银色', '深空灰色', '黑色'],
            存储容量: ['16GB', '32GB', '64GB', '128GB', '256GB'],
            网络类型: ['全网通', '电信版', '移动版', '联通版', '国际版'],
            机身状态: ['99新', '95新', '9成新', '8成新', '全新原封'],
            套餐: ['官方标配', '套餐一(配保护壳)', '套餐二(配贴膜+保护壳)', '套餐三(配耳机+充电器+保护壳)', '尊享套餐(配全套配件)'],
            保修服务: ['官方保修', '延长保修1年', '碎屏保障服务', 'AppleCare+服务', '无保修']
          },
          details: `
            <div class="product-detail-content">
              <h3>产品介绍</h3>
              <p>iPhone 6s Plus延续了iPhone系列的经典设计，5.5英寸Retina高清显示屏，搭载A9处理器，支持3D Touch触控技术，1200万像素后置摄像头，支持4K视频录制。</p>
              
              <h3>产品特点</h3>
              <ul>
                <li>5.5英寸视网膜高清显示屏，分辨率1920x1080</li>
                <li>A9芯片，速度提升70%，图形性能提升90%</li>
                <li>1200万像素iSight摄像头，支持4K视频拍摄</li>
                <li>第二代Touch ID指纹识别，解锁更快</li>
                <li>3D Touch压感触控屏幕，带来全新操作体验</li>
              </ul>
              
              <h3>规格参数</h3>
              <table class="spec-detailed-table">
                <tr>
                  <td class="spec-label">产品名称</td>
                  <td class="spec-value">Apple iPhone 6s Plus</td>
                </tr>
                <tr>
                  <td class="spec-label">屏幕尺寸</td>
                  <td class="spec-value">5.5英寸</td>
                </tr>
                <tr>
                  <td class="spec-label">分辨率</td>
                  <td class="spec-value">1920x1080像素</td>
                </tr>
                <tr>
                  <td class="spec-label">CPU</td>
                  <td class="spec-value">A9处理器</td>
                </tr>
                <tr>
                  <td class="spec-label">运行内存</td>
                  <td class="spec-value">2GB</td>
                </tr>
                <tr>
                  <td class="spec-label">存储容量</td>
                  <td class="spec-value">16GB/32GB/64GB/128GB</td>
                </tr>
                <tr>
                  <td class="spec-label">后置摄像头</td>
                  <td class="spec-value">1200万像素</td>
                </tr>
                <tr>
                  <td class="spec-label">前置摄像头</td>
                  <td class="spec-value">500万像素</td>
                </tr>
                <tr>
                  <td class="spec-label">电池容量</td>
                  <td class="spec-value">2750mAh（内置不可拆卸）</td>
                </tr>
                <tr>
                  <td class="spec-label">操作系统</td>
                  <td class="spec-value">iOS系统</td>
                </tr>
              </table>
              
              <div class="product-images-gallery">
                <img src="/assets/product-detail/iphone-detail-1.jpg" alt="iPhone展示图1" />
                <img src="/assets/product-detail/iphone-detail-2.jpg" alt="iPhone展示图2" />
                <img src="/assets/product-detail/iphone-detail-3.jpg" alt="iPhone展示图3" />
              </div>
            </div>
          `,
          // 使用静态资源路径
          mainImage: '/assets/iPhone6s玫瑰金2.png',
          images: [
            '/assets/iPhone6s玫瑰金2.png',
            '/assets/iPhone6s玫瑰金3.png',
            '/assets/iPhone6s玫瑰金4.png',
            '/assets/iPhone6s玫瑰金5.png',
            '/assets/iPhone6s金色2.png',
            '/assets/iPhone6s金色3.png',
            '/assets/iPhone6s金色4.png',
            '/assets/iPhone6s金色5.png',
            '/assets/iPhone6s银色2.png',
            '/assets/iPhone6s银色3.png',
            '/assets/iPhone6s银色4.png',
            '/assets/iPhone6s银色5.png',
            '/assets/iPhone6s深空灰2.png',
            '/assets/iPhone6s深空灰3.png',
            '/assets/iPhone6s深空灰4.png',
            '/assets/iPhone6s深空灰5.png'
          ]
        };
      } else if (id === 'p4' || id === 'clinique1' || id === '4') {
        // 倩碧套装
        mockProductData = {
          ...productData,
          name: "倩碧(Clinique)保湿修护水乳套装（黄油125ml+粉水200ml）干皮补水护肤品礼盒",
          price: 368,
          originalPrice: 498,
          sales: 2863,
          description: "温和保湿 深层修护 敏感肌适用 明星套装",
          brand: "倩碧(Clinique)",
          shopId: '1004',
          shopName: '倩碧悦颜官方旗舰店',
          shopLogo: '/src/assets/shop-logos/clinique-logo.png',
          shopRating: 4.9,
          categoryId: 'beauty002',
          categoryName: '美妆个护 > 护肤套装 > 水乳套装',
          stock: 300,
          rating: 4.9,
          reviewCount: 3457,
          deliveryInfo: {
            address: '上海市浦东新区',
            services: ['顺丰快递', '24小时内发货', '官方授权正品', '敏感肌适用', '过敏包退']
          },
          specifications: {
            套装类型: ['基础护肤套装(黄油+粉水)', '明星套装(含洁面啫喱)', '限量珍藏版套装', '旅行便携套装', '礼盒装'],
            适用肤质: ['干性肌肤', '中性肌肤', '混合性肌肤', '油性肌肤', '敏感性肌肤'],
            护理重点: ['补水保湿', '舒缓修护', '控油平衡', '提亮肤色', '紧致抗老'],
            容量选择: ['标准装(125ml+200ml)', '旅行装(50ml+100ml)', '超值装(200ml+400ml)', '迷你体验装(30ml+50ml)'],
            适用季节: ['四季通用', '干燥秋冬', '潮湿夏季', '换季保养']
          },
          purchaseInfo: {
            gift: '赠送洁面泡沫15ml+面膜5ml小样+化妆包',
            bundle: '加9.9元换购护手霜30ml，加39.9元换购眼霜7ml',
            warranty: '正品保证，7天无理由退换，30天产品问题包退',
            shipment: '本商品由官方旗舰店发货，支持门店自提，48小时内发货',
            payment: '支持花呗/信用卡分期付款，微信/支付宝到账立减5元'
          },
          details: `
            <div class="product-detail-content">
              <h3>产品介绍</h3>
              <p>倩碧保湿修护水乳套装由经典黄油面霜(DDML+)和倩碧2号爽肤水组成，专为干性至混合性敏感肌肤设计。这款套装提供全面的保湿修护，缓解干燥不适，强化肌肤屏障，是倩碧明星产品组合，全球畅销50年。</p>
              
              <h3>套装内容</h3>
              <ul>
                <li>倩碧黄油面霜(DDML+)：125ml，深层滋润配方，不含油脂，不阻塞毛孔</li>
                <li>倩碧粉水2号：200ml，温和不含酒精配方，有效舒缓干燥肌肤</li>
              </ul>
              
              <h3>产品特点</h3>
              <ul>
                <li>深层保湿：黄油面霜提供长效保湿，锁住水分，让肌肤持久柔软顺滑</li>
                <li>肌肤屏障修护：强化受损肌肤屏障，减少外界刺激，增强肌肤抵抗力</li>
                <li>温和配方：无香精、无酒精、无刺激性，通过过敏测试，敏感肌适用</li>
                <li>临床测试：经皮肤科医生测试，安全有效，适合各年龄段使用</li>
                <li>简约高效：简单的两步护肤程序，为肌肤提供基础、全面的呵护</li>
              </ul>
              
              <h3>使用方法</h3>
              <p>基础两步护肤法：清洁面部后，取适量爽肤水于化妆棉，轻轻擦拭面部，由内向外、由下至上擦拭。然后取适量黄油面霜（约一颗黄豆大小），均匀涂抹于面部和颈部，轻轻按摩至吸收。早晚使用效果更佳。</p>
              
              <h3>适用肤质</h3>
              <p>特别适合干性至混合性肌肤，对于干燥、敏感、粗糙和暗沉的肌肤有很好的改善效果。敏感肌肤也可以安全使用。</p>
              
              <h3>商品参数</h3>
              <table class="spec-detailed-table">
                <tr>
                  <td class="spec-label">品牌名称</td>
                  <td class="spec-value">倩碧(Clinique)</td>
                </tr>
                <tr>
                  <td class="spec-label">产品名称</td>
                  <td class="spec-value">倩碧保湿修护水乳套装</td>
                </tr>
                <tr>
                  <td class="spec-label">适用肤质</td>
                  <td class="spec-value">干性至混合性敏感肌肤</td>
                </tr>
                <tr>
                  <td class="spec-label">规格</td>
                  <td class="spec-value">黄油面霜125ml+粉水200ml</td>
                </tr>
                <tr>
                  <td class="spec-label">主要功效</td>
                  <td class="spec-value">保湿、修护、舒缓、平衡水油</td>
                </tr>
                <tr>
                  <td class="spec-label">产品剂型</td>
                  <td class="spec-value">乳液、水</td>
                </tr>
                <tr>
                  <td class="spec-label">主要成分</td>
                  <td class="spec-value">甘油、角鲨烷、植物精华、水解角蛋白、透明质酸</td>
                </tr>
                <tr>
                  <td class="spec-label">适用人群</td>
                  <td class="spec-value">所有人群，孕妇慎用</td>
                </tr>
                <tr>
                  <td class="spec-label">保质期</td>
                  <td class="spec-value">36个月</td>
                </tr>
                <tr>
                  <td class="spec-label">净含量</td>
                  <td class="spec-value">325ml（黄油125ml+爽肤水200ml）</td>
                </tr>
                <tr>
                  <td class="spec-label">产地</td>
                  <td class="spec-value">美国/英国</td>
                </tr>
                <tr>
                  <td class="spec-label">使用部位</td>
                  <td class="spec-value">面部、颈部</td>
                </tr>
                <tr>
                  <td class="spec-label">适用年龄</td>
                  <td class="spec-value">18-65岁</td>
                </tr>
                <tr>
                  <td class="spec-label">是否油皮可用</td>
                  <td class="spec-value">可用（选择清爽型）</td>
                </tr>
                <tr>
                  <td class="spec-label">是否含酒精</td>
                  <td class="spec-value">不含</td>
                </tr>
                <tr>
                  <td class="spec-label">是否含香精</td>
                  <td class="spec-value">不含</td>
                </tr>
              </table>
              
              <h3>适用场景</h3>
              <p>日常护肤、干燥肌肤修复、季节转换期护理、敏感肌护理、旅行携带、办公室补水、夜间修护、换季肌肤调理</p>
              
              <h3>注意事项</h3>
              <p>避免接触眼睛及眼周区域。如不慎入眼，请立即用清水冲洗。请将产品放置在儿童无法触及的地方。如有不适请立即停止使用并咨询医生。</p>
              
              <h3>品牌故事</h3>
              <p>倩碧(Clinique)诞生于1968年，是雅诗兰黛集团旗下品牌，是全球第一个由皮肤科医生研发的高端护肤品牌。倩碧坚持"简单、安全、有效"的护肤理念，所有产品均经过过敏测试，无香精添加，被誉为敏感肌的友好品牌。</p>
              
              <div class="product-images-gallery">
                <img src="/src/assets/倩碧1.png" alt="倩碧套装展示图1" />
                <img src="/src/assets/倩碧2.png" alt="倩碧套装展示图2" />
                <img src="/src/assets/倩碧3.png" alt="倩碧套装展示图3" />
                <img src="/src/assets/倩碧4.png" alt="倩碧套装展示图4" />
                <img src="/src/assets/倩碧5.png" alt="倩碧套装展示图5" />
              </div>
            </div>
          `,
          mainImage: '/src/assets/倩碧1.png',
          images: [
            '/src/assets/倩碧1.png',
            '/src/assets/倩碧2.png',
            '/src/assets/倩碧3.png',
            '/src/assets/倩碧4.png',
            '/src/assets/倩碧5.png'
          ]
        };
      } else if (id === 'p5' || id === 'olive1' || id === '5') {
        // 品利橄榄油
        mockProductData = {
          ...productData,
          name: "西班牙原装进口MUELOLIVA品利特级初榨橄榄油750ml",
          price: 280,
          originalPrice: 399,
          sales: 1283,
          description: "特级初榨 物理冷压 酸度≤0.4%",
          brand: "品利(MUELOLIVA)",
          shopId: '1005',
          shopName: '品利橄榄油官方旗舰店',
          shopLogo: '/assets/shop-logos/mueloliva-logo.png',
          shopRating: 4.8,
          categoryId: 'food001',
          categoryName: '食品 > 粮油调味 > 橄榄油',
          stock: 500,
          rating: 4.8,
          reviewCount: 2583,
          deliveryInfo: {
            address: '广东省广州市',
            services: ['顺丰快递', '48小时内发货', '正品保证', '假一赔十', '7天无理由退换']
          },
          specifications: {
            规格: ['750ml单瓶', '750ml*2瓶', '500ml单瓶', '1L单瓶', '250ml*2瓶礼盒装'],
            产地: ['西班牙', '意大利'],
            种类: ['特级初榨', '初榨', '纯正'],
            包装: ['玻璃瓶', '铁罐装', '礼盒装']
          },
          purchaseInfo: {
            gift: '满299元赠送100ml小样一瓶',
            bundle: '加39.9元换购250ml橄榄油',
            warranty: '正品保证，假一赔十',
            shipment: '支持京东配送、顺丰、EMS，晚11点前下单次日达',
            payment: '支持花呗/信用卡分期，微信、支付宝支付'
          },
          details: `
            <div class="product-detail-content">
              <h3>产品介绍</h3>
              <p>西班牙MUELOLIVA品利特级初榨橄榄油采用西班牙安达卢西亚产区的优质橄榄果实，通过物理冷压工艺，在24小时内完成压榨，保留了橄榄油丰富的营养成分和原始风味。酸度≤0.4%，远低于国际橄榄油理事会0.8%的标准。</p>
              
              <h3>产品特点</h3>
              <ul>
                <li>特级初榨：采用物理冷压工艺，无添加、无加热</li>
                <li>低酸度：酸度≤0.4%，远低于国际标准</li>
                <li>口感纯正：具有浓郁的果香和微辣的喉韵</li>
                <li>营养丰富：富含单不饱和脂肪酸、多酚和维生素E</li>
                <li>多用途：可用于凉拌、煎炒、烘焙和直接食用</li>
              </ul>
              
              <h3>使用建议</h3>
              <p>适合凉拌沙拉、蔬菜、面包蘸食，也可用于低温煎炒或制作意面、披萨等。建议常温避光保存，开封后3个月内食用完毕。</p>
              
              <h3>商品参数</h3>
              <table class="spec-detailed-table">
                <tr>
                  <td class="spec-label">品牌名称</td>
                  <td class="spec-value">品利(MUELOLIVA)</td>
                </tr>
                <tr>
                  <td class="spec-label">产品名称</td>
                  <td class="spec-value">特级初榨橄榄油</td>
                </tr>
                <tr>
                  <td class="spec-label">净含量</td>
                  <td class="spec-value">750ml</td>
                </tr>
                <tr>
                  <td class="spec-label">产地</td>
                  <td class="spec-value">西班牙</td>
                </tr>
                <tr>
                  <td class="spec-label">等级</td>
                  <td class="spec-value">特级初榨(Extra Virgin)</td>
                </tr>
                <tr>
                  <td class="spec-label">保质期</td>
                  <td class="spec-value">24个月</td>
                </tr>
                <tr>
                  <td class="spec-label">储存方法</td>
                  <td class="spec-value">避光、阴凉干燥处保存</td>
                </tr>
                <tr>
                  <td class="spec-label">包装方式</td>
                  <td class="spec-value">玻璃瓶装</td>
                </tr>
              </table>
              
              <div class="product-images-gallery">
                <img src="/src/assets/品利1.png" alt="品利橄榄油展示图1" />
                <img src="/src/assets/品利2.png" alt="品利橄榄油展示图2" />
                <img src="/src/assets/品利3.png" alt="品利橄榄油展示图3" />
                <img src="/src/assets/品利4.png" alt="品利橄榄油展示图4" />
                <img src="/src/assets/品利5.png" alt="品利橄榄油展示图5" />
              </div>
            </div>
          `,
          mainImage: '/src/assets/品利1.png',
          images: [
            '/src/assets/品利1.png',
            '/src/assets/品利2.png',
            '/src/assets/品利3.png',
            '/src/assets/品利4.png',
            '/src/assets/品利5.png'
          ]
        };
      } else {
        // 其他产品默认设置
        mockProductData = {
          ...productData,
          name: "未知商品",
          price: 0,
          originalPrice: 0,
          sales: 0,
          description: "暂无描述",
          brand: "未知品牌",
          shopId: '0000',
          shopName: '未知店铺',
          shopLogo: '/src/assets/shop-logos/default-logo.png',
          shopRating: 5.0,
          categoryId: 'unknown',
          categoryName: '未知分类',
          // 使用静态资源路径
          images: [
            '/assets/product1.png'
          ],
          mainImage: '/assets/product1.png' // 设置默认主图
        };
      }
      
      setProduct(mockProductData);
      setSelectedImage(mockProductData.images && mockProductData.images.length > 0 ? mockProductData.images[0] : productData.mainImage);

      // 获取商品评论 - 添加模拟评论数据
      const mockReviews = generateMockReviews(mockProductData.name, mockProductData.reviewCount || 5);
      setReviews(mockReviews);

      // 获取相关商品
      const relatedResponse = await getRecommendedProducts(4);
      setRelatedProducts(relatedResponse.data);
    } catch (error) {
      console.error('获取商品详情失败:', error);
      message.error('获取商品详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟评论数据
  const generateMockReviews = (productName: string, count: number = 5) => {
    const sampleAvatars = [
      '/assets/avatars/avatar1.png',
      '/assets/avatars/avatar2.png',
      '/assets/avatars/avatar3.png',
      '/assets/avatars/avatar4.png',
      '/assets/avatars/avatar5.png',
    ];
    
    const sampleUsernames = ['用户7752****', '购买者4932****', 'happy****', 'lilin****', 'xiaofang****', '星辰****', '大海****'];
    
    const sampleContents = [
      `真的很不错，${productName}质量很好，物流也很快，包装完好无损，很满意的一次购物体验！`,
      `已经是第二次购买了，${productName}效果特别好，强烈推荐给大家。客服态度也很好，解答了我的许多疑问。`,
      `${productName}收到了，比预想的要好，性价比很高，值得购买。`,
      `包装很好，商品完好无损，没有使用前先来评价，后续追评！`,
      `非常满意的一次购物，${productName}正品无疑，期待后续效果。`,
      `物流超快，第二天就收到了，${productName}比想象中的还要好用！`,
      `朋友推荐买的，确实名不虚传，${productName}真的很赞！`,
    ];
    
    const sampleImages = [
      ['/assets/review-images/review1.jpg'],
      ['/assets/review-images/review2.jpg', '/assets/review-images/review3.jpg'],
      ['/assets/review-images/review4.jpg', '/assets/review-images/review5.jpg', '/assets/review-images/review6.jpg'],
    ];
    
    const sampleReplies = [
      '感谢您的认可，我们会继续努力提供更好的产品和服务！',
      '谢谢您的支持，如有任何问题，欢迎随时联系我们的客服！',
      '非常感谢您的好评，您的满意是我们最大的动力！',
    ];
    
    // 生成随机的评论
    const reviews = [];
    const actualCount = Math.min(count, 10); // 限制最多显示10条评论
    
    for (let i = 0; i < actualCount; i++) {
      const hasImages = Math.random() > 0.7; // 30%的评论有图片
      const hasReply = Math.random() > 0.6; // 40%的评论有回复
      const rating = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 3 : 5; // 80%是5星评价
      
      reviews.push({
        id: `review-${Date.now()}-${i}`,
        userId: `user-${i}`,
        username: sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)],
        avatar: sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)],
        rating: rating,
        content: sampleContents[Math.floor(Math.random() * sampleContents.length)],
        images: hasImages ? sampleImages[Math.floor(Math.random() * sampleImages.length)] : [],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        isAnonymous: Math.random() > 0.7,
        reply: hasReply ? sampleReplies[Math.floor(Math.random() * sampleReplies.length)] : undefined,
        replyAt: hasReply ? new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString() : undefined,
      });
    }
    
    return reviews;
  };

  // 添加到购物车函数
  const handleAddToCart = async () => {
    if (!id) return;
    
    // 检查用户是否登录
    if (!isUserLoggedInState) {
      message.warning('请先登录再加入购物车');
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    
    // 打开规格选择模态框
    setIsSpecModalVisible(true);
    setBuyNowMode(false);
  };

  // 立即购买函数
  const handleBuyNow = () => {
    // 检查用户是否登录
    if (!isUserLoggedInState) {
      message.warning('请先登录再购买');
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    
    // 打开规格选择模态框
    setIsSpecModalVisible(true);
    setBuyNowMode(true);
  };

  // 实际提交到购物车的函数
  const handleSubmitToCart = async (quantity: number, specs: Record<string, string>) => {
    if (!id || !product) return;
    
    try {
      setIsAddingToCart(true);
      // 将商品添加到购物车
      const response = await addToCart(
        id, 
        quantity, 
        specs, 
        {
          name: product.name,
          price: product.price,
          image: product.mainImage
        }
      );
      message.success(`成功添加 ${quantity} 件商品到购物车`);
      
      // 触发购物车数量更新事件
      window.dispatchEvent(new Event(CART_COUNT_UPDATE_EVENT));
      
      // 更新全局购物车数量
      const currentCart = getLocalCart();
      const totalItems = currentCart.reduce((total, item) => total + item.quantity, 0);
      updateGlobalCartCount(totalItems);
      
      // 如果是立即购买模式，则跳转到购物车页面
      if (buyNowMode) {
        window.location.href = '/cart';
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('添加到购物车失败:', error);
      message.error('添加到购物车失败，请稍后重试');
      return Promise.reject(error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!id) return;
    
    try {
      await addToFavorites(id);
      message.success('成功添加到收藏夹');
    } catch (error) {
      console.error('添加到收藏夹失败:', error);
      message.error('添加到收藏夹失败，请稍后重试');
    }
  };

  // 处理规格选择
  const handleSpecSelection = (specType: string, value: string) => {
    setSelectedSpec({
      ...selectedSpec,
      [specType]: value
    });
    
    // 如果是iPhone 6s商品且选择的是颜色规格，则更新图片
    if (id === 'p3' && specType === '颜色' && product !== null) {
      // 根据选择的颜色更新图片
      let colorImages: string[] = [];
      if (value === '玫瑰金色') {
        colorImages = product.images.filter(img => img.includes('玫瑰金'));
      } else if (value === '金色') {
        colorImages = product.images.filter(img => img.includes('金色') && !img.includes('玫瑰金'));
      } else if (value === '银色') {
        colorImages = product.images.filter(img => img.includes('银色'));
      } else if (value === '深空灰色') {
        colorImages = product.images.filter(img => img.includes('深空灰'));
      }
      
      // 如果找到对应颜色的图片，则更新选中的图片
      if (colorImages.length > 0) {
        setSelectedImage(colorImages[0]);
        // 将缩略图滚动重置
        setThumbnailScroll(0);
        if (thumbnailListRef.current) {
          thumbnailListRef.current.style.transform = 'translateX(0px)';
        }
      }
    }
  };

  // 根据商品ID获取对应的规格选项
  const getSpecOptions = () => {
    if (id === 'cleanser1' || id === 'p1' || id === '1' || window.location.href.includes('cleanser')) {
      return cleanserSpecOptions;
    }
    if (id === 'p2' || id === 'yogurt1' || id === '2' || window.location.href.includes('yogurt')) {
      return yogurtSpecOptions;
    }
    if (id === 'p3' || id === '3' || window.location.href.includes('iphone')) {
      return iphoneOptions;
    }
    if (id === 'p4' || id === 'clinique1' || id === '4' || window.location.href.includes('clinique')) {
      return cliniqueSkinCareOptions;
    }
    if (id === 'p5' || id === 'olive1' || id === '5' || window.location.href.includes('olive')) {
      return oliveOilOptions;
    }
    // 如果没有匹配的ID，根据URL再次检查
    const url = window.location.href.toLowerCase();
    if (url.includes('cleanser') || url.includes('cleansing')) {
      return cleanserSpecOptions;
    }
    if (url.includes('yogurt') || url.includes('dairy')) {
      return yogurtSpecOptions;
    }
    if (url.includes('phone') || url.includes('iphone') || url.includes('apple')) {
      return iphoneOptions;
    }
    if (url.includes('skincare') || url.includes('clinique')) {
      return cliniqueSkinCareOptions;
    }
    if (url.includes('oil') || url.includes('olive')) {
      return oliveOilOptions;
    }
    
    return specOptions;
  };
  
  // 根据商品ID获取促销信息
  const getPromotions = () => {
    if (id === 'cleanser1' || id === 'p1') {
      return cleanserPromotions;
    }
    if (id === 'p2' || id === 'yogurt1') {
      return yogurtPromotions;
    }
    if (id === 'p4') {
      return cliniqueSkinCarePromotions;
    }
    if (id === 'p5') {
      return oliveOilPromotions;
    }
    return promotions;
  };

  const getMockSimilarProducts = (categoryId: string = '') => {
    const similarProducts = [
      {
        id: 'cleanser2',
        name: '自然堂 深海水洗面奶洁面霜',
        price: 69.9,
        mainImage: 'https://img.alicdn.com/bao/uploaded/i3/2208876287252/O1CN01XuYByw23yHvfDdz9K_!!0-item_pic.jpg',
        categoryId: 'beauty001',
        categoryName: '美妆个护 > 面部护理 > 洁面产品'
      },
      {
        id: 'yogurt2',
        name: '君乐宝简醇酸奶200g*24盒整箱',
        price: 79.9,
        mainImage: 'https://img.alicdn.com/bao/uploaded/i1/1776276117/O1CN01ZIjZGf1YX3tAsgL2u_!!0-item_pic.jpg',
        categoryId: 'food002',
        categoryName: '食品饮料 > 乳制品 > 酸奶'
      },
      {
        id: 'clinique1',
        name: '倩碧黄油润肤乳125ml',
        price: 269,
        mainImage: 'https://img.alicdn.com/bao/uploaded/i1/1881162283/O1CN01LKknbv1q5nZkbzKGx_!!0-item_pic.jpg',
        categoryId: 'beauty002',
        categoryName: '美妆个护 > 护肤套装 > 面霜'
      },
      {
        id: 'olive2',
        name: '贝蒂斯特级初榨橄榄油750ml',
        price: 119,
        mainImage: 'https://img.alicdn.com/bao/uploaded/i3/725677994/O1CN01IKkLuB28vIq9ahO8X_!!0-item_pic.jpg',
        categoryId: 'food001',
        categoryName: '食品饮料 > 粮油调味 > 食用油'
      },
      {
        id: 'iphone7',
        name: 'iPhone 13 (A2634) 128GB',
        price: 5999,
        mainImage: 'https://img.alicdn.com/bao/uploaded/i4/2212875511658/O1CN01vVdMyI1gPXJTzY11g_!!0-item_pic.jpg',
        categoryId: 'digital001',
        categoryName: '手机数码 > 手机 > 苹果手机'
      }
    ];

    // 如果有分类信息，优先返回同分类的商品
    if (categoryId) {
      const sameCategoryProducts = similarProducts.filter(p => p.categoryId === categoryId);
      if (sameCategoryProducts.length >= 3) {
        return sameCategoryProducts.slice(0, 4);
      }
    }

    return similarProducts.slice(0, 4);
  };

  // 根据当前商品分类获取相关推荐商品
  const similarProducts = useMemo(() => {
    return getMockSimilarProducts(product?.categoryId);
  }, [product?.categoryId]);

  // 处理缩略图导航
  const handleThumbnailScroll = (direction: 'left' | 'right') => {
    if (!thumbnailListRef.current) return;
    
    const container = thumbnailListRef.current;
    const scrollAmount = 150; // 每次滚动的像素数
    
    let newScroll = thumbnailScroll;
    if (direction === 'left') {
      newScroll = Math.max(thumbnailScroll - scrollAmount, 0);
    } else {
      const maxScroll = container.scrollWidth - container.clientWidth;
      newScroll = Math.min(thumbnailScroll + scrollAmount, maxScroll);
    }
    
    setThumbnailScroll(newScroll);
    container.style.transform = `translateX(-${newScroll}px)`;
  };

  if (loading) {
    return (
      <div style={{ padding: '50px' }}>
        <Skeleton active avatar paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Title level={3}>商品不存在或已下架</Title>
        <Button type="primary">
          <Link to="/products">返回商品列表</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* 面包屑导航 */}
      <div className="breadcrumb-container">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined /> 首页
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/category">全部商品分类</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {product.categoryName ? (
              <Link to={`/category/${product.categoryId}`}>
                {product.categoryName.split(' > ').slice(0, 1)}
              </Link>
            ) : (
              <Link to={`/category`}>商品分类</Link>
            )}
          </Breadcrumb.Item>
          {product.categoryName && product.categoryName.split(' > ').length > 1 && (
            <Breadcrumb.Item>
              <Link to={`/category/${product.categoryId}`}>
                {product.categoryName.split(' > ').slice(1, 2)}
              </Link>
            </Breadcrumb.Item>
          )}
          {product.categoryName && product.categoryName.split(' > ').length > 2 && (
            <Breadcrumb.Item>
              <Link to={`/category/${product.categoryId}`}>
                {product.categoryName.split(' > ').slice(2)}
              </Link>
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* 店铺信息 */}
      <div className="shop-info">
        <div className="shop-logo">
          <img src={product.shopLogo} alt={product.shopName} />
        </div>
        <div className="shop-details">
          <div className="shop-name">
            <Badge status="success" text={product.shopName} />
            <span className="shop-badge">官方认证</span>
          </div>
          <div className="shop-rating">
            <span className="rating-label">店铺评分:</span>
            <Rate disabled defaultValue={product.shopRating} style={{ fontSize: 14 }} />
            <span className="rating-value">{product.shopRating}</span>
          </div>
        </div>
        <div className="shop-divider"></div>
        <div className="shop-actions">
          <Button type="primary" ghost size="small" className="shop-action-btn">
            进入店铺
          </Button>
          <Button size="small" className="shop-action-btn">
            <HeartOutlined /> 关注店铺
          </Button>
        </div>
      </div>

      <Row className="product-content" gutter={[30, 0]}>
        {/* 左侧商品图片 */}
        <Col xs={24} md={12} lg={8}>
          <div className="product-gallery">
            <div className="main-image-container">
              <Image
                src={selectedImage || product.mainImage}
                alt={product.name}
                className="main-product-image"
                preview={{ 
                  src: selectedImage || product.mainImage,
                  mask: <div className="preview-mask">
                    <div className="preview-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                      </svg>
                    </div>
                    <div className="preview-text">查看大图</div>
                  </div> 
                }}
              />
              <div className="image-zoom-hint">
                <SearchOutlined /> 鼠标移入图片，可查看大图
              </div>
            </div>
            
            <div className="thumbnail-container">
              <div className="thumbnail-list" ref={thumbnailListRef}>
                {product.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-item ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`${product.name}-${index}`} />
                  </div>
                ))}
              </div>
              {/* 左右导航按钮 */}
              {product.images.length > 4 && (
                <>
                  <div 
                    className="thumbnail-nav-button thumbnail-nav-prev"
                    onClick={() => handleThumbnailScroll('left')}
                  >
                    <LeftOutlined />
                  </div>
                  <div 
                    className="thumbnail-nav-button thumbnail-nav-next"
                    onClick={() => handleThumbnailScroll('right')}
                  >
                    <RightOutlined />
                  </div>
                </>
              )}
            </div>
            
            <div className="product-actions">
              <Button type="text" icon={<HeartOutlined />} onClick={handleAddToFavorites}>
                <span className="action-text">收藏商品</span>
              </Button>
              <Button type="text" icon={<ShareAltOutlined />}>
                <span className="action-text">分享</span>
              </Button>
            </div>
          </div>
        </Col>

        {/* 右侧商品信息 */}
        <Col xs={24} md={12} lg={16}>
          <div className="product-info">
            {/* 商品标题 */}
            <div className="product-title">
              <h1>{product.name}</h1>
              <div className="product-subtitle">
                {product.description}
              </div>
            </div>

            {/* 价格区域 */}
            <div className="price-section">
              <div className="price-row">
                <span className="price-label">促销价</span>
                <span className="price-value">
                  <span className="price-symbol">¥</span>
                  <span className="price-amount">{product.price}</span>
                </span>
                {product.originalPrice && (
                  <span className="original-price">¥{product.originalPrice}</span>
                )}
                {product.discount && (
                  <Tag color="#e1251b" className="discount-tag">{product.discount}折</Tag>
                )}
              </div>
              <div className="price-row">
                <span className="extend-info">累计评价: 
                  <a 
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('reviews')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                      setActiveTab('2'); // 切换到评价选项卡
                    }}
                    style={{ cursor: 'pointer', marginLeft: '4px', color: '#1890ff' }}
                  >
                    {reviews.length}
                  </a>
                </span>
                <span className="extend-info">销量: {product.sales}+</span>
              </div>
            </div>

            {/* 替换原有的优惠券区域，使用ProductSpecialOffers组件 */}
            <ProductSpecialOffers
              productId={id || ''}
              productName={product.name}
              productType={product.categoryName || ''}
              price={product.price}
              isNewUser={Math.random() > 0.5} // 随机设置是否是新用户
            />

            {/* 配送区域 */}
            <div className="delivery-section">
              <div className="section-row">
                <span className="section-label">配送</span>
                <div className="delivery-content">
                  <span className="delivery-address">
                    <EnvironmentOutlined /> {id === 'p1' ? '广东广州市' : id === 'p2' ? '上海市' : id === 'p4' ? '北京市' : id === 'p5' ? '浙江杭州市' : '广东深圳市'} <RightOutlined />
                  </span>
                  <div className="delivery-services">
                    {id === 'p1' ? (
                      // 卸妆油配送服务
                      <>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 常温快递
                        </span>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 24小时内发货
                        </span>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 品牌授权
                        </span>
                      </>
                    ) : id === 'p2' ? (
                      // 德亚酸奶配送服务
                      <>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 冷链配送
                        </span>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 48小时内发货
                        </span>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 进口商品
                        </span>
                      </>
                    ) : id === 'p4' ? (
                      // 倩碧配送服务
                      <>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 品牌直发
                        </span>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 顺丰速运
                        </span>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 官方授权
                        </span>
                      </>
                    ) : id === 'p5' ? (
                      // 橄榄油配送服务
                      <>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 精准配送
                        </span>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 防震包装
                        </span>
                        <span className="delivery-service-item">
                          <CheckCircleOutlined /> 进口原装
                        </span>
                      </>
                    ) : (
                      // 默认iPhone配送服务
                      <>
                    {product.deliveryInfo?.services.map((service: string, index: number) => (
                      <span key={index} className="delivery-service-item">
                        <CheckCircleOutlined /> {service}
                      </span>
                    ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 促销信息 */}
            <div className="promotion-section">
              <div className="section-row">
                <span className="section-label">促销</span>
                <div className="promotion-content">
                  {/* 替换原有的促销标签，使用ProductPromotions组件 */}
                  <ProductPromotions
                    productId={id || ''}
                    productName={product.name}
                    productType={product.categoryName || ''}
                    price={product.price}
                    isNew={product.isNew || false}
                    isFeatured={product.sales > 1000} // 根据销量判断是否热销
                  />
                </div>
              </div>
            </div>

            {/* 规格选择 */}
            <div className="spec-section">
              {Object.entries(getSpecOptions()).map(([specType, options]) => (
                <div key={specType} className="section-row spec-row">
                  <span className="section-label">{specType}</span>
                  <div className="spec-options">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className={`spec-option ${selectedSpec[specType] === option ? 'selected' : ''}`}
                        onClick={() => handleSpecSelection(specType, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 添加购买信息区域 */}
            {product.purchaseInfo && (
              <PurchaseInfo info={product.purchaseInfo} />
            )}

            {/* 数量选择 */}
            <div className="quantity-section">
              <div className="section-row">
                <span className="section-label">数量</span>
                <div className="quantity-selector">
                  <InputNumber
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    className="quantity-input"
                  />
                  <span className="stock-info">库存{product.stock}件</span>
                </div>
              </div>
            </div>

            {/* 服务保障 */}
            <div className="service-section">
              <div className="section-row">
                <span className="section-label">服务</span>
                <div className="service-items">
                  {id === 'p1' || id === 'cleanser1' ? (
                    // 凡茜卸妆油特定服务
                    <>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 官方授权
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 无添加
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 适合敏感肌
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 7天无理由退换
                      </span>
                    </>
                  ) : id === 'p2' || id === 'yogurt1' ? (
                    // 德国酸奶特定服务
                    <>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 冷链配送
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 正品保证
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 破损包赔
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 新老包装随机发
                      </span>
                    </>
                  ) : id === 'p4' || id === 'clinique1' ? (
                    // 倩碧护肤套装特定服务
                    <>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 官方授权正品
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 敏感肌适用
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 过敏包退
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 7天无理由退换
                      </span>
                    </>
                  ) : id === 'p5' || id === 'olive1' ? (
                    // 橄榄油特定服务
                    <>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 原装进口
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 正品保证
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 冷压工艺
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 适合孕妇使用
                      </span>
                    </>
                  ) : (
                    // 默认服务
                    <>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 7天无理由退换
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 正品保证
                      </span>
                      <span className="service-item">
                        <CheckCircleOutlined className="service-icon" /> 极速退款
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 按钮区域 */}
            <div className="action-buttons">
              <Button 
                size="large" 
                type="primary" 
                danger
                className="buy-now-btn"
                onClick={handleBuyNow}
                icon={<ShoppingOutlined />}
                loading={isAddingToCart}
              >
                立即购买
              </Button>
              <Button 
                size="large" 
                className="add-cart-btn"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                loading={isAddingToCart}
              >
                加入购物车
              </Button>
              <Button 
                size="large" 
                className="collect-btn"
                icon={<StarOutlined />}
                onClick={handleAddToFavorites}
              >
                收藏
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* 商品详情选项卡 */}
      <div className="product-detail-tabs">
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          size="large"
          className="detail-tabs"
        >
          <TabPane tab="商品详情" key="1">
            <div className="spec-table-container">
              <div className="spec-table-title">商品详情</div>
              <table className="spec-table">
                <tbody>
                  {id === 'p3' ? (
                    <>
                      <tr>
                        <td className="spec-label">品牌</td>
                        <td className="spec-value">Apple</td>
                        <td className="spec-label">商品编号</td>
                        <td className="spec-value">10048440231689</td>
                      </tr>
                      <tr>
                        <td className="spec-label">屏幕尺寸</td>
                        <td className="spec-value">5.5英寸</td>
                        <td className="spec-label">充电功率</td>
                        <td className="spec-value spec-link">以官网信息为准</td>
                      </tr>
                      <tr>
                        <td className="spec-label">电池容量</td>
                        <td className="spec-value spec-link">2750mAh</td>
                        <td className="spec-label">分辨率</td>
                        <td className="spec-value spec-link">1920x1080 Full HD+</td>
                      </tr>
                      <tr>
                        <td className="spec-label">后摄主像素</td>
                        <td className="spec-value spec-link">1200万像素</td>
                        <td className="spec-label">运行内存</td>
                        <td className="spec-value">2GB</td>
                      </tr>
                      <tr>
                        <td className="spec-label">机身色系</td>
                        <td className="spec-value">玫瑰金色，金色，银色，深空灰色</td>
                        <td className="spec-label">存储容量</td>
                        <td className="spec-value">16GB/32GB/64GB/128GB</td>
                      </tr>
                      <tr>
                        <td className="spec-label">风格</td>
                        <td className="spec-value">商务，时尚，简约</td>
                        <td className="spec-label">成色</td>
                        <td className="spec-value">9成新</td>
                      </tr>
                      <tr>
                        <td className="spec-label">三防标准</td>
                        <td className="spec-value">不支持防水</td>
                        <td className="spec-label">来源渠道</td>
                        <td className="spec-value">官方授权渠道</td>
                      </tr>
                      <tr>
                        <td className="spec-label">机型</td>
                        <td className="spec-value">Apple iPhone 6s Plus</td>
                        <td className="spec-label">无线充电</td>
                        <td className="spec-value">不支持</td>
                      </tr>
                      <tr>
                        <td className="spec-label">电池可拆卸</td>
                        <td className="spec-value">不可拆卸</td>
                        <td className="spec-label">充电接口</td>
                        <td className="spec-value">Lightning</td>
                      </tr>
                      <tr>
                        <td className="spec-label">生物识别</td>
                        <td className="spec-value">Touch ID指纹识别</td>
                        <td className="spec-label">系统</td>
                        <td className="spec-value">iOS</td>
                      </tr>
                      <tr>
                        <td className="spec-label">包装清单</td>
                        <td className="spec-value" colSpan={3}>手机+包装盒+充电器（非原装）+数据线（非原装）+取卡针</td>
                      </tr>
                    </>
                  ) : id === 'p5' ? (
                    <>
                      <tr>
                        <td className="spec-label">品牌</td>
                        <td className="spec-value">品利(MUELOLIVA)</td>
                        <td className="spec-label">商品编号</td>
                        <td className="spec-value">12587962311</td>
                      </tr>
                      <tr>
                        <td className="spec-label">产地</td>
                        <td className="spec-value">西班牙</td>
                        <td className="spec-label">净含量</td>
                        <td className="spec-value">1L</td>
                      </tr>
                      <tr>
                        <td className="spec-label">类型</td>
                        <td className="spec-value">特级初榨橄榄油</td>
                        <td className="spec-label">品质等级</td>
                        <td className="spec-value">特级(Extra Virgin)</td>
                      </tr>
                      <tr>
                        <td className="spec-label">适用人群</td>
                        <td className="spec-value">孕妇、老人、儿童、青少年、成人</td>
                        <td className="spec-label">保质期</td>
                        <td className="spec-value">24个月</td>
                      </tr>
                      <tr>
                        <td className="spec-label">包装方式</td>
                        <td className="spec-value">玻璃瓶装</td>
                        <td className="spec-label">生产日期</td>
                        <td className="spec-value">见包装标识</td>
                      </tr>
                      <tr>
                        <td className="spec-label">储存方法</td>
                        <td className="spec-value">避光、阴凉、干燥处保存</td>
                        <td className="spec-label">是否进口</td>
                        <td className="spec-value">是</td>
                      </tr>
                      <tr>
                        <td className="spec-label">包装清单</td>
                        <td className="spec-value" colSpan={3}>橄榄油1L玻璃瓶*1、包装盒*1、品质保证卡</td>
                      </tr>
                    </>
                  ) : id === 'cleanser1' || id === 'p1' ? (
                    <>
                      <tr>
                        <td className="spec-label">品牌</td>
                        <td className="spec-value">凡茜</td>
                        <td className="spec-label">商品编号</td>
                        <td className="spec-value">10987655222</td>
                      </tr>
                      <tr>
                        <td className="spec-label">产地</td>
                        <td className="spec-value">中国</td>
                        <td className="spec-label">净含量</td>
                        <td className="spec-value">200ml</td>
                      </tr>
                      <tr>
                        <td className="spec-label">适用肤质</td>
                        <td className="spec-value">所有肤质</td>
                        <td className="spec-label">保质期</td>
                        <td className="spec-value">36个月</td>
                      </tr>
                      <tr>
                        <td className="spec-label">功效</td>
                        <td className="spec-value">深层清洁、温和卸妆、毛孔细致</td>
                        <td className="spec-label">主要成分</td>
                        <td className="spec-value">白茶精华、矿物油、水</td>
                      </tr>
                      <tr>
                        <td className="spec-label">包装清单</td>
                        <td className="spec-value" colSpan={3}>卸妆油1瓶、使用说明书</td>
                      </tr>
                    </>
                  ) : id === 'p2' || id === 'yogurt1' ? (
                    <>
                      <tr>
                        <td className="spec-label">品牌</td>
                        <td className="spec-value">德亚</td>
                        <td className="spec-label">商品编号</td>
                        <td className="spec-value">15698732144</td>
                      </tr>
                      <tr>
                        <td className="spec-label">产地</td>
                        <td className="spec-value">德国</td>
                        <td className="spec-label">净含量</td>
                        <td className="spec-value">200ml*10/24盒</td>
                      </tr>
                      <tr>
                        <td className="spec-label">口味</td>
                        <td className="spec-value">原味</td>
                        <td className="spec-label">保质期</td>
                        <td className="spec-value">21天</td>
                      </tr>
                      <tr>
                        <td className="spec-label">储存方法</td>
                        <td className="spec-value">冷藏保存，2-6℃</td>
                        <td className="spec-label">是否进口</td>
                        <td className="spec-value">是</td>
                      </tr>
                      <tr>
                        <td className="spec-label">包装方式</td>
                        <td className="spec-value">利乐包装</td>
                        <td className="spec-label">生产日期</td>
                        <td className="spec-value">见包装标识</td>
                      </tr>
                      <tr>
                        <td className="spec-label">包装清单</td>
                        <td className="spec-value" colSpan={3}>原味酸奶200ml*N盒</td>
                      </tr>
                    </>
                  ) : id === 'p4' ? (
                    <>
                      <tr>
                        <td className="spec-label">品牌</td>
                        <td className="spec-value">倩碧Clinique</td>
                        <td className="spec-label">商品编号</td>
                        <td className="spec-value">17852364998</td>
                      </tr>
                      <tr>
                        <td className="spec-label">产地</td>
                        <td className="spec-value">美国</td>
                        <td className="spec-label">净含量</td>
                        <td className="spec-value">黄油125ml+粉水200ml</td>
                      </tr>
                      <tr>
                        <td className="spec-label">适用肤质</td>
                        <td className="spec-value">干性皮肤、敏感肌肤</td>
                        <td className="spec-label">保质期</td>
                        <td className="spec-value">36个月</td>
                      </tr>
                      <tr>
                        <td className="spec-label">功效</td>
                        <td className="spec-value">补水保湿、修护、舒缓</td>
                        <td className="spec-label">使用顺序</td>
                        <td className="spec-value">洁面→爽肤水→乳液→面霜</td>
                      </tr>
                      <tr>
                        <td className="spec-label">包装清单</td>
                        <td className="spec-value" colSpan={3}>倩碧黄油125ml*1+倩碧粉水200ml*1、包装盒*1</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td className="spec-label">品牌</td>
                      <td className="spec-value">{product.brand}</td>
                      <td className="spec-label">商品编号</td>
                      <td className="spec-value">10000000000</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="detail-content" dangerouslySetInnerHTML={{ __html: product.details || '暂无详细介绍' }} />
          </TabPane>
          <TabPane tab={`商品评价(${reviews.length})`} key="2">
            <div className="reviews-section" id="reviews">
              <div className="review-summary">
                <div className="review-rate">
                  <div className="overall-rate">{product.rating.toFixed(1)}</div>
                  <div className="rate-text">商品评分</div>
                  <Rate disabled defaultValue={product.rating} style={{ fontSize: 16 }} />
                </div>
                <div className="review-tags">
                  <Tag className="review-tag active">全部({reviews.length})</Tag>
                  <Tag className="review-tag">好评({Math.floor(reviews.length * 0.8)})</Tag>
                  <Tag className="review-tag">中评({Math.floor(reviews.length * 0.15)})</Tag>
                  <Tag className="review-tag">差评({Math.floor(reviews.length * 0.05)})</Tag>
                  <Tag className="review-tag">有图({reviews.filter(r => r.images && r.images.length > 0).length})</Tag>
                </div>
              </div>
              {reviews.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={reviews}
                  pagination={{
                    onChange: (page) => {
                      console.log(page);
                    },
                    pageSize: 5,
                  }}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      actions={[
                        <span><LikeOutlined /> 有用</span>,
                        <span><MessageOutlined /> 回复</span>,
                      ]}
                    >
                      <div className="review-item">
                        <div className="reviewer-info">
                          <Avatar src={item.avatar || 'https://joeschmoe.io/api/v1/random'} />
                          <span className="reviewer-name">{item.isAnonymous ? '匿名用户' : item.username}</span>
                          <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} />
                          <span className="review-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="review-content">{item.content}</div>
                        {item.images && item.images.length > 0 && (
                          <div className="review-images">
                            {item.images.map((img, index) => (
                              <Image
                                key={index}
                                src={img}
                                alt="评论图片"
                                width={80}
                                height={80}
                                style={{ objectFit: 'cover', marginRight: 8 }}
                              />
                            ))}
                          </div>
                        )}
                        {item.reply && (
                          <div className="review-reply">
                            <strong>商家回复：</strong> {item.reply}
                            {item.replyAt && <span className="reply-date">({new Date(item.replyAt).toLocaleDateString()})</span>}
                          </div>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="暂无评价" />
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>

      {/* 相关推荐 */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <Title level={4} className="section-title">相关商品推荐</Title>
          <Row gutter={[16, 16]}>
            {relatedProducts.map(item => (
              <Col xs={12} sm={8} md={6} lg={4} key={item.id}>
                <Link to={`/products/${item.id}`}>
                  <Card
                    hoverable
                    cover={
                      <img 
                        alt={item.name} 
                        src={item.mainImage} 
                        style={{ height: 160, objectFit: 'cover' }}
                      />
                    }
                    className="related-product-card"
                  >
                    <Card.Meta
                      title={item.name}
                      description={<div className="related-price">¥{item.price}</div>}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* 相关商品推荐 */}
      <div className="similar-products-container">
        <div className="section-title">
          <h2>猜你喜欢</h2>
        </div>
        <div className="similar-products-list">
          {similarProducts.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="similar-product-item">
              <div className="similar-product-image">
                <img src={item.mainImage} alt={item.name} />
              </div>
              <div className="similar-product-info">
                <h3 className="similar-product-name">{item.name}</h3>
                <div className="similar-product-price">
                  <span className="price-symbol">¥</span>
                  <span className="price-value">{item.price.toFixed(2)}</span>
                </div>
                <div className="similar-product-category">
                  {item.categoryName.split(' > ').pop()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 添加规格选择模态框 */}
      {product && (
        <ProductSpecModal
          visible={isSpecModalVisible}
          onClose={() => setIsSpecModalVisible(false)}
          onAddToCart={handleSubmitToCart}
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            mainImage: product.mainImage,
            stock: product.stock
          }}
          specOptions={getSpecOptions()}
          selectedSpecs={selectedSpec}
          onSpecChange={handleSpecSelection}
          initialQuantity={quantity}
        />
      )}
      
      {/* 添加悬浮购物车按钮 */}
      <FloatingCartButton onClick={() => window.location.href = '/cart'} />
    </div>
  );
};

// 添加购买信息和商品参数的展示组件
const PurchaseInfo: React.FC<PurchaseInfoProps> = ({ info }) => {
  if (!info) return null;
  
  return (
    <div className="purchase-info-section">
      <div className="section-row">
        <span className="section-label">购买</span>
        <div className="purchase-info-content">
          {info.gift && (
            <div className="purchase-info-item gift-info-item">
              <div className="info-item-icon">
                <GiftOutlined className="icon-gift" />
              </div>
              <div className="info-item-content">
                <div className="info-item-title">赠品</div>
                <div className="info-item-desc">{info.gift}</div>
              </div>
            </div>
          )}
          {info.bundle && (
            <div className="purchase-info-item bundle-info-item">
              <div className="info-item-icon">
                <DollarOutlined className="icon-bundle" />
              </div>
              <div className="info-item-content">
                <div className="info-item-title">优惠</div>
                <div className="info-item-desc">{info.bundle}</div>
              </div>
            </div>
          )}
          {info.warranty && (
            <div className="purchase-info-item warranty-info-item">
              <div className="info-item-icon">
                <SafetyOutlined className="icon-warranty" />
              </div>
              <div className="info-item-content">
                <div className="info-item-title">保障</div>
                <div className="info-item-desc">{info.warranty}</div>
              </div>
            </div>
          )}
          {info.shipment && (
            <div className="purchase-info-item shipment-info-item">
              <div className="info-item-icon">
                <CarOutlined className="icon-shipment" />
              </div>
              <div className="info-item-content">
                <div className="info-item-title">配送</div>
                <div className="info-item-desc">{info.shipment}</div>
              </div>
            </div>
          )}
          {info.payment && (
            <div className="purchase-info-item payment-info-item">
              <div className="info-item-icon">
                <CreditCardOutlined className="icon-payment" />
              </div>
              <div className="info-item-content">
                <div className="info-item-title">支付</div>
                <div className="info-item-desc">{info.payment}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 