// 模拟API数据处理器
import { SITE_INFO } from '../config';
import { mockOrders, getMockOrders } from './mock/orderData';

// 确保商品使用正确的图片
const ensureProductImages = (order: any) => {
  if (!order || !order.items) return order;
  
  const orderCopy = JSON.parse(JSON.stringify(order));
  
  // 为各类产品准备多个图片选项
  const fanxiImages = [
    '/src/assets/product1-1.png',
    '/src/assets/product1-2.png',
    '/src/assets/product1-3.png',
    '/src/assets/product1-4.png'
  ];
  
  const iphoneImages = [
    '/src/assets/iPhone6s玫瑰金.png',
    '/src/assets/iPhone6s金色.png',
    '/src/assets/iPhone6s深空灰.png',
    '/src/assets/iPhone6银色.png'
  ];
  
  const deyaImages = [
    '/src/assets/德亚酸奶1.png',
    '/src/assets/德亚酸奶2.png',
    '/src/assets/德亚酸奶3.png',
    '/src/assets/德亚酸奶4.png'
  ];
  
  const pinliImages = [
    '/src/assets/品利1.png',
    '/src/assets/品利2.png',
    '/src/assets/品利3.png',
    '/src/assets/品利4.png',
    '/src/assets/品利5.png'
  ];
  
  const qingbiImages = [
    '/src/assets/倩碧1.png',
    '/src/assets/倩碧2.png',
    '/src/assets/倩碧3.png',
    '/src/assets/倩碧4.png',
    '/src/assets/倩碧5.png'
  ];
  
  orderCopy.items = orderCopy.items.map((item: any) => {
    // 根据产品类型确保图片正确
    const productName = item.productName || item.name || '';
    const lowerName = productName.toLowerCase();
    
    // 检查当前图片是否与商品类型匹配
    const isFanxi = lowerName.includes('凡茜');
    const isIPhone = lowerName.includes('iphone') || lowerName.includes('苹果');
    const isDeya = lowerName.includes('德亚') || lowerName.includes('酸奶');
    const isPinli = lowerName.includes('品利') || lowerName.includes('橄榄油');
    const isQingbi = lowerName.includes('倩碧');
    
    // 根据产品ID或名称选择特定图片
    const productId = String(item.productId || '');
    const idNumber = productId.replace(/\D/g, '');
    const itemId = String(item.id || '');
    const itemNumber = parseInt(itemId.replace(/\D/g, ''), 10) || 0;
    
    // 为每个品类选择图片 - 优先使用已有图片，否则根据ID选择合适的图片
    if (isFanxi) {
      const index = (itemNumber % fanxiImages.length);
      item.productImage = fanxiImages[index];
    } else if (isIPhone) {
      const index = (itemNumber % iphoneImages.length);
      item.productImage = iphoneImages[index];
    } else if (isDeya) {
      const index = (itemNumber % deyaImages.length);
      item.productImage = deyaImages[index];
    } else if (isPinli) {
      const index = (itemNumber % pinliImages.length);
      item.productImage = pinliImages[index];
    } else if (isQingbi) {
      const index = (itemNumber % qingbiImages.length);
      item.productImage = qingbiImages[index];
    }
    
    return item;
  });
  
  return orderCopy;
};

// 模拟产品数据
const mockProducts = [
  {
    id: 'p1',
    name: '尤洪智能手机Pro Max',
    price: 4999,
    originalPrice: 5999,
    mainImage: 'https://picsum.photos/300/300?random=1',
    images: Array(4).fill(null).map((_, i) => `https://picsum.photos/300/300?random=1_${i}`),
    description: '尤洪最新旗舰智能手机，搭载高通骁龙8 Gen2处理器',
    details: '<p>这是尤洪智能手机Pro Max的详细介绍</p><p>规格: 高通骁龙8 Gen2、8+256GB、6.7英寸OLED屏幕</p><p>特点: 超长续航、IP68防水、五年系统更新</p>',
    rating: 4.9,
    sales: 2568,
    stock: 120,
    categoryId: 'c1',
    categoryName: '手机数码',
    isNew: true,
    discount: 8,
    brand: '尤洪'
  },
  {
    id: 'p2',
    name: '尤洪无线降噪耳机',
    price: 899,
    originalPrice: 999,
    mainImage: 'https://picsum.photos/300/300?random=2',
    images: Array(4).fill(null).map((_, i) => `https://picsum.photos/300/300?random=2_${i}`),
    description: '主动降噪耳机，40小时超长续航',
    details: '<p>尤洪无线降噪耳机采用先进的降噪算法</p><p>规格: 蓝牙5.3、40小时续航、IPX4防水</p><p>特点: HIFI音质、智能语音助手、环境音模式</p>',
    rating: 4.7,
    sales: 1859,
    stock: 350,
    categoryId: 'c1',
    categoryName: '手机数码',
    isNew: false,
    discount: 9,
    brand: '尤洪'
  },
  {
    id: 'p3',
    name: '尤洪超薄移动电源20000mAh',
    price: 159,
    originalPrice: 199,
    mainImage: 'https://picsum.photos/300/300?random=3',
    images: Array(4).fill(null).map((_, i) => `https://picsum.photos/300/300?random=3_${i}`),
    description: '大容量移动电源，支持65W快充',
    details: '<p>尤洪超薄移动电源采用高密度电芯</p><p>规格: 20000mAh、65W输出功率、Type-C接口</p><p>特点: 双向快充、超薄设计、多重安全保护</p>',
    rating: 4.5,
    sales: 3671,
    stock: 0,
    categoryId: 'c1',
    categoryName: '手机数码',
    isNew: false,
    discount: 8,
    brand: '尤洪'
  },
  {
    id: 'p4',
    name: '尤洪智能手表Pro',
    price: 1299,
    originalPrice: 1499,
    mainImage: 'https://picsum.photos/300/300?random=4',
    images: Array(4).fill(null).map((_, i) => `https://picsum.photos/300/300?random=4_${i}`),
    description: '多功能健康监测，14天长续航',
    details: '<p>尤洪智能手表Pro功能丰富</p><p>规格: 1.74英寸AMOLED屏幕、GPS定位、NFC支付</p><p>特点: 心率血氧监测、100+运动模式、防水防尘</p>',
    rating: 4.6,
    sales: 2354,
    stock: 89,
    categoryId: 'c1',
    categoryName: '手机数码',
    isNew: true,
    discount: null,
    brand: '尤洪'
  },
  {
    id: 'p5',
    name: '尤洪多彩手机壳',
    price: 49,
    originalPrice: 69,
    mainImage: 'https://picsum.photos/300/300?random=5',
    images: Array(4).fill(null).map((_, i) => `https://picsum.photos/300/300?random=5_${i}`),
    description: '适配多款手机型号，环保材质',
    details: '<p>尤洪多彩手机壳采用环保TPU材质</p><p>规格: 适配尤洪智能手机系列、多色可选</p><p>特点: 轻薄透明、精准开孔、防摔抗黄</p>',
    rating: 4.3,
    sales: 8756,
    stock: 5,
    categoryId: 'c1',
    categoryName: '手机数码',
    isNew: false,
    discount: 7,
    brand: '尤洪'
  },
  {
    id: 'p6',
    name: '尤洪超级会员礼品',
    price: 0,
    originalPrice: 99,
    mainImage: 'https://picsum.photos/300/300?random=6',
    images: Array(4).fill(null).map((_, i) => `https://picsum.photos/300/300?random=6_${i}`),
    description: '会员专属赠品，数量有限',
    details: '<p>尤洪超级会员专属礼品</p><p>规格: 限量版、收藏价值高</p><p>特点: 仅限超级会员领取，限时限量</p>',
    rating: 5.0,
    sales: 999,
    stock: 50,
    categoryId: 'c1',
    categoryName: '手机数码',
    isNew: false,
    discount: null,
    brand: '尤洪'
  },
  {
    id: 'p7',
    name: '尤洪限量版手机挂绳',
    price: 19,
    originalPrice: 39,
    mainImage: 'https://picsum.photos/300/300?random=7',
    images: Array(4).fill(null).map((_, i) => `https://picsum.photos/300/300?random=7_${i}`),
    description: '潮流设计，结实耐用',
    details: '<p>尤洪限量版手机挂绳采用高强度尼龙材质</p><p>规格: 长度可调、多色可选</p><p>特点: 个性设计、防滑防丢、限量发售</p>',
    rating: 4.4,
    sales: 1677,
    stock: 0,
    categoryId: 'c1',
    categoryName: '手机数码',
    isNew: false,
    discount: 5,
    brand: '尤洪'
  },
  {
    id: 'p8',
    name: '尤洪双重防护膜',
    price: 29,
    originalPrice: 49,
    mainImage: 'https://picsum.photos/300/300?random=8',
    images: Array(4).fill(null).map((_, i) => `https://picsum.photos/300/300?random=8_${i}`),
    description: '全屏覆盖，防蓝光护眼',
    details: '<p>尤洪双重防护膜采用纳米材质</p><p>规格: 9H硬度、防蓝光、指纹防护</p><p>特点: 高清透光、贴合无气泡、防刮耐用</p>',
    rating: 4.5,
    sales: 5698,
    stock: 230,
    categoryId: 'c1',
    categoryName: '手机数码',
    isNew: false,
    discount: 6,
    brand: '尤洪'
  },
  {
    id: 'p9',
    name: '尤洪智能家居套装',
    price: 899,
    originalPrice: 1299,
    mainImage: 'https://picsum.photos/300/300?random=9',
    images: Array(4).fill(null).map((_, i) => `https://picsum.photos/300/300?random=9_${i}`),
    description: '一键控制家电，语音智能助手',
    details: '<p>尤洪智能家居套装包含智能音箱、智能插座、智能灯泡</p><p>规格: WiFi连接、APP远程控制</p><p>特点: 语音控制、定时设置、场景联动</p>',
    rating: 4.7,
    sales: 1243,
    stock: 78,
    categoryId: 'c3',
    categoryName: '家用电器',
    isNew: true,
    discount: 7,
    brand: '尤洪'
  },
  {
    id: 'p10',
    name: '尤洪便携蓝牙音箱',
    price: 199,
    originalPrice: 299,
    mainImage: 'https://picsum.photos/300/300?random=10',
    images: Array(4).fill(null).map((_, i) => `https://picsum.photos/300/300?random=10_${i}`),
    description: '高保真音质，防水设计',
    details: '<p>尤洪便携蓝牙音箱采用高性能扬声器</p><p>规格: 蓝牙5.0、10小时续航、IPX7防水</p><p>特点: 360°环绕音效、便携式设计、户外必备</p>',
    rating: 4.6,
    sales: 3567,
    stock: 156,
    categoryId: 'c1',
    categoryName: '手机数码',
    isNew: false,
    discount: 6.6,
    brand: '尤洪'
  }
];

// 模拟分类数据
const mockCategories = [
  { id: 'c1', name: '手机数码', icon: 'mobile', image: 'https://picsum.photos/300/150?random=c1' },
  { id: 'c2', name: '电脑办公', icon: 'laptop', image: 'https://picsum.photos/300/150?random=c2' },
  { id: 'c3', name: '家用电器', icon: 'home', image: 'https://picsum.photos/300/150?random=c3' },
  { id: 'c4', name: '服装鞋包', icon: 'shopping', image: 'https://picsum.photos/300/150?random=c4' },
  { id: 'c5', name: '食品生鲜', icon: 'shopping-cart', image: 'https://picsum.photos/300/150?random=c5' },
  { id: 'c6', name: '美妆护肤', icon: 'heart', image: 'https://picsum.photos/300/150?random=c6' },
];

// 模拟购物车数据
let mockCartItems = [
  {
    id: 'cart1',
    productId: 'p1',
    productName: '尤洪智能手机Pro Max',
    productImage: 'https://picsum.photos/300/300?random=1',
    price: 4999,
    originalPrice: 5999,
    quantity: 1,
    stock: 120,
    selected: true,
    status: 'normal',
    shopId: 'shop1',
    shopName: '尤洪官方旗舰店',
    specifications: {
      颜色: '深空黑',
      内存: '8GB+256GB'
    },
    promotion: {
      type: 'discount',
      description: '限时8折优惠',
      value: 80
    }
  },
  {
    id: 'cart2',
    productId: 'p2',
    productName: '尤洪无线降噪耳机',
    productImage: 'https://picsum.photos/300/300?random=2',
    price: 899,
    originalPrice: 999,
    quantity: 2,
    stock: 350,
    selected: true,
    status: 'normal',
    shopId: 'shop1',
    shopName: '尤洪官方旗舰店',
    specifications: {
      颜色: '珍珠白'
    },
    promotion: {
      type: 'discount',
      description: '限时9折优惠',
      value: 90
    }
  },
  {
    id: 'cart3',
    productId: 'p3',
    productName: '尤洪超薄移动电源20000mAh',
    productImage: 'https://picsum.photos/300/300?random=3',
    price: 159,
    originalPrice: 199,
    quantity: 1,
    stock: 0,
    selected: false,
    status: 'soldout',
    shopId: 'shop2',
    shopName: '尤洪数码专营店',
    specifications: {
      容量: '20000mAh',
      颜色: '星空蓝'
    },
    promotion: {
      type: 'discount',
      description: '限时8折优惠',
      value: 80
    }
  },
  {
    id: 'cart4',
    productId: 'p4',
    productName: '尤洪智能手表Pro',
    productImage: 'https://picsum.photos/300/300?random=4',
    price: 1299,
    originalPrice: 1499,
    quantity: 1,
    stock: 89,
    selected: true,
    status: 'normal',
    shopId: 'shop1',
    shopName: '尤洪官方旗舰店',
    maxBuy: 2,
    specifications: {
      颜色: '银月灰',
      尺寸: '46mm'
    },
    promotion: {
      type: 'reduction',
      description: '满1000减100',
      value: 100
    }
  },
  {
    id: 'cart5',
    productId: 'p5',
    productName: '尤洪多彩手机壳',
    productImage: 'https://picsum.photos/300/300?random=5',
    price: 49,
    originalPrice: 69,
    quantity: 1,
    stock: 5,
    selected: true,
    status: 'limited',
    shopId: 'shop3',
    shopName: '尤洪潮品店',
    specifications: {
      适用机型: '尤洪智能手机Pro Max',
      颜色: '透明蓝'
    },
    promotion: {
      type: 'discount',
      description: '限时7折优惠',
      value: 70
    }
  },
  {
    id: 'cart6',
    productId: 'p6',
    productName: '尤洪超级会员礼品',
    productImage: 'https://picsum.photos/300/300?random=6',
    price: 0,
    originalPrice: 99,
    quantity: 1,
    stock: 50,
    selected: true,
    status: 'normal',
    isGift: true,
    shopId: 'shop1',
    shopName: '尤洪官方旗舰店'
  },
  {
    id: 'cart7',
    productId: 'p7',
    productName: '尤洪限量版手机挂绳',
    productImage: 'https://picsum.photos/300/300?random=7',
    price: 19,
    originalPrice: 39,
    quantity: 1,
    stock: 0,
    selected: false,
    status: 'removed',
    shopId: 'shop4',
    shopName: '尤洪电子产品店',
    promotion: {
      type: 'discount',
      description: '限时5折特价',
      value: 50
    }
  },
  {
    id: 'cart8',
    productId: 'p8',
    productName: '尤洪双重防护膜',
    productImage: 'https://picsum.photos/300/300?random=8',
    price: 29,
    originalPrice: 49,
    quantity: 2,
    stock: 230,
    selected: true,
    status: 'normal',
    shopId: 'shop2',
    shopName: '尤洪数码专营店',
    specifications: {
      适用机型: '尤洪智能手机Pro Max',
      类型: '防蓝光款'
    },
    promotion: {
      type: 'discount',
      description: '限时6折特惠',
      value: 60
    }
  },
  {
    id: 'cart9',
    productId: 'p9',
    productName: '尤洪智能家居套装',
    productImage: 'https://picsum.photos/300/300?random=9',
    price: 899,
    originalPrice: 1299,
    quantity: 1,
    stock: 78,
    selected: true,
    status: 'normal',
    shopId: 'shop1',
    shopName: '尤洪官方旗舰店',
    specifications: {
      颜色: '暮光白',
      版本: '标准版'
    },
    promotion: {
      type: 'discount',
      description: '新品7折',
      value: 70
    }
  },
  {
    id: 'cart10',
    productId: 'p10',
    productName: '尤洪便携蓝牙音箱',
    productImage: 'https://picsum.photos/300/300?random=10',
    price: 199,
    originalPrice: 299,
    quantity: 1,
    stock: 156,
    selected: true,
    status: 'normal',
    shopId: 'shop2',
    shopName: '尤洪数码专营店',
    specifications: {
      颜色: '炫酷黑',
      类型: '户外防水版'
    },
    promotion: {
      type: 'discount',
      description: '6.6折特惠',
      value: 66
    }
  }
];

// 模拟用户数据
const mockUsers = [
  {
    id: 'u1',
    username: 'test',
    password: '123456', // 实际应用中密码应该是加密的
    email: 'test@example.com',
    phone: '13800138000',
    role: 'user',
    avatar: 'https://joeschmoe.io/api/v1/random',
    lastLoginTime: new Date().toISOString(),
    addresses: [
      {
        id: 'addr1',
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        address: '科技园路1号',
        isDefault: true
      }
    ]
  },
  {
    id: 'u2',
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    phone: '13900139000',
    role: 'admin',
    avatar: 'https://joeschmoe.io/api/v1/joe',
    lastLoginTime: new Date().toISOString(),
    addresses: []
  },
  {
    id: 'u3',
    username: 'demo',
    password: 'demo123',
    email: 'demo@example.com',
    phone: '13700137000',
    role: 'user',
    avatar: 'https://joeschmoe.io/api/v1/jane',
    lastLoginTime: new Date().toISOString(),
    addresses: []
  }
];

// 模拟验证码存储
const verificationCodes = new Map<string, string>();

// 模拟token存储和刷新
const tokenStore = new Map<string, {
  userId: string,
  expiresAt: number,
  refreshToken: string
}>();

// 创建token黑名单
const tokenBlacklist = new Set<string>();

// 生成随机令牌
const generateToken = (userId: string) => {
  const token = `token_${userId}_${Math.random().toString(36).substring(2)}`;
  const refreshToken = `refresh_${userId}_${Math.random().toString(36).substring(2)}`;
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1小时后过期
  
  tokenStore.set(token, {
    userId,
    expiresAt,
    refreshToken
  });
  
  return { token, refreshToken, expiresAt };
};

// 验证令牌
const verifyToken = (token: string) => {
  // 检查token是否在黑名单中
  if (tokenBlacklist.has(token)) {
    return null;
  }
  
  const tokenData = tokenStore.get(token);
  if (!tokenData) return null;
  
  if (tokenData.expiresAt < Date.now()) {
    tokenStore.delete(token);
    return null;
  }
  
  return tokenData;
};

// 生成随机验证码
const generateVerificationCode = (target: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6位数字验证码
  verificationCodes.set(target, code);
  
  // 5分钟后过期
  setTimeout(() => {
    verificationCodes.delete(target);
  }, 5 * 60 * 1000);
  
  return code;
};

// 模拟评论数据
const generateReviews = (productId: string) => {
  return Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, index) => ({
    id: `r${productId}_${index}`,
    userId: `u${index + 1}`,
    username: `用户${index + 1}`,
    avatar: `https://picsum.photos/40/40?random=${index}`,
    rating: Math.floor(Math.random() * 5) + 1,
    content: `这是对商品${productId}的评价，整体使用感受不错，推荐购买！`,
    images: Math.random() > 0.5 ? [
      `https://picsum.photos/100/100?random=${index}_1`,
      `https://picsum.photos/100/100?random=${index}_2`
    ] : [],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    isAnonymous: Math.random() > 0.8,
    reply: Math.random() > 0.7 ? '感谢您的评价，我们会继续提供优质服务！' : undefined,
    replyAt: Math.random() > 0.7 ? new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString() : undefined
  }));
};

// 模拟API请求处理
export const mockApiHandler = async (url: string, method: string = 'GET', data?: any) => {
  console.log(`Mock API 请求: ${method} ${url}`, data ? `数据: ${JSON.stringify(data)}` : '');
  await new Promise(resolve => setTimeout(resolve, 300)); // 模拟网络延迟

  try {
    // 产品相关API
    if (url.includes('/products/hot')) {
      return {
        code: 200,
        message: 'success',
        data: mockProducts.sort((a, b) => b.sales - a.sales).slice(0, 8)
      };
    }

    if (url.includes('/products/recommended')) {
      const limit = url.includes('limit=') ? Number(url.split('limit=')[1]) : 4;
      return {
        code: 200,
        message: 'success',
        data: mockProducts.slice(0, limit)
      };
    }

    // 处理产品详情请求 - 支持两种格式: /products/p1 或 /products/1
    if (url.match(/\/products\/p\d+$/) || url.match(/\/products\/\d+$/)) {
      const productId = url.split('/').pop() || '';
      // 如果是纯数字ID，转换为p前缀格式
      const normalizedId = productId.startsWith('p') ? productId : `p${productId}`;
      const product = mockProducts.find(p => p.id === normalizedId);
      
      if (!product) {
        return { code: 404, message: '商品不存在' };
      }
      return {
        code: 200,
        message: 'success',
        data: product
      };
    }

    if (url.match(/\/products\/p\d+\/reviews$/) || url.match(/\/products\/\d+\/reviews$/)) {
      const matches = url.match(/\/products\/(p?\d+)\/reviews/);
      if (!matches) {
        return { code: 404, message: '商品不存在' };
      }
      
      const productId = matches[1];
      // 如果是纯数字ID，转换为p前缀格式
      const normalizedId = productId.startsWith('p') ? productId : `p${productId}`;
      
      return {
        code: 200,
        message: 'success',
        data: {
          total: Math.floor(Math.random() * 50) + 5,
          records: generateReviews(normalizedId)
        }
      };
    }

    if (url.includes('/products/search') || url === '/products') {
      return {
        code: 200,
        message: 'success',
        data: {
          total: mockProducts.length,
          records: mockProducts.slice(0, 10),
          current: 1,
          pageSize: 10
        }
      };
    }

    // 分类相关API
    if (url === '/categories') {
      return {
        code: 200,
        message: 'success',
        data: mockCategories
      };
    }

    // 购物车相关API
    if (url === '/api/cart') {
      return {
        code: 200,
        message: 'success',
        data: {
          items: mockCartItems,
          total: mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        }
      };
    }

    // 获取购物车商品数量
    if (url === '/api/cart/count') {
      const count = mockCartItems.reduce((sum, item) => sum + item.quantity, 0);
      return {
        code: 200,
        message: 'success',
        data: {
          count
        }
      };
    }

    // 添加商品到购物车
    if (url === '/api/cart/add' && method === 'POST') {
      try {
        const { productId, quantity, specifications, productInfo } = data;
        
        // 检查商品是否存在
        const productIndex = mockProducts.findIndex(p => 
          p.id === `p${productId}` || p.id === productId
        );
        
        if (productIndex === -1) {
          return { code: 404, message: '商品不存在' };
        }
        
        const product = mockProducts[productIndex];
        
        // 创建购物车项
        const cartItem = {
          id: `cart${mockCartItems.length + 1}`,
          productId: product.id,
          productName: productInfo?.name || product.name,
          productImage: productInfo?.image || product.mainImage,
          price: productInfo?.price || product.price,
          originalPrice: product.originalPrice,
          quantity: quantity,
          specifications: specifications || {},
          stock: product.stock,
          selected: true,
          status: product.stock > 0 ? 'normal' : 'soldout',
          shopName: '官方旗舰店'
        };
        
        // 添加到购物车
        mockCartItems.push(cartItem);
        
        return {
          code: 200,
          message: 'success',
          data: cartItem
        };
      } catch (error) {
        console.error('模拟添加商品到购物车失败:', error);
        return {
          code: 500,
          message: '服务器内部错误',
          data: null
        };
      }
    }

    // 更新购物车商品数量
    if (url.match(/\/api\/cart\/items\/[\w-]+$/) && method === 'PUT') {
      const itemId = url.split('/').pop() || '';
      const { quantity } = data;
      
      const itemIndex = mockCartItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        return { code: 404, message: '购物车商品不存在' };
      }
      
      mockCartItems[itemIndex].quantity = quantity;
      
      return {
        code: 200,
        message: 'success',
        data: mockCartItems[itemIndex]
      };
    }
    
    // 更新购物车商品规格
    if (url.match(/\/api\/cart\/items\/[\w-]+\/specifications$/) && method === 'PUT') {
      const itemId = url.match(/\/api\/cart\/items\/([\w-]+)\/specifications$/)?.[1] || '';
      const { specifications } = data;
      
      const itemIndex = mockCartItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        return { code: 404, message: '购物车商品不存在' };
      }
      
      mockCartItems[itemIndex].specifications = specifications;
      
      return {
        code: 200,
        message: 'success',
        data: mockCartItems[itemIndex]
      };
    }
    
    // 删除购物车商品
    if (url.match(/\/api\/cart\/items\/[\w-]+$/) && method === 'DELETE') {
      const itemId = url.split('/').pop() || '';
      const itemIndex = mockCartItems.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        return { 
          code: 200, 
          message: 'success',
          data: { 
            success: true, 
            message: '商品已从购物车中移除',
            itemId: itemId
          }
        };
      }
      
      const removedItem = mockCartItems.splice(itemIndex, 1)[0];
      
      return {
        code: 200,
        message: 'success',
        data: { 
          success: true,
          removedItem,
          message: '商品已从购物车中移除'
        }
      };
    }
    
    // 批量删除购物车商品
    if (url === '/api/cart/items' && method === 'DELETE') {
      const { itemIds } = data;
      
      const removedItems = [];
      mockCartItems = mockCartItems.filter(item => {
        if (itemIds.includes(item.id)) {
          removedItems.push(item);
          return false;
        }
        return true;
      });
      
      return {
        code: 200,
        message: 'success',
        data: { removedItems }
      };
    }
    
    // 清空购物车
    if (url === '/api/cart' && method === 'DELETE') {
      const removedItems = [...mockCartItems];
      mockCartItems = [];
      
      return {
        code: 200,
        message: 'success',
        data: { removedItems }
      };
    }
    
    // 校验购物车商品库存
    if (url === '/api/cart/validate-stock' && method === 'POST') {
      const { items } = data;
      
      const validationResults = items.map(({ itemId, quantity }) => {
        const cartItem = mockCartItems.find(item => item.id === itemId);
        if (!cartItem) {
          return { itemId, valid: false, message: '商品不存在' };
        }
        
        const productId = cartItem.productId;
        const product = mockProducts.find(p => p.id === productId);
        const stock = product?.stock || 0;
        
        return {
          itemId,
          valid: quantity <= stock,
          quantity,
          stock,
          message: quantity <= stock ? '库存充足' : '库存不足'
        };
      });
      
      return {
        code: 200,
        message: 'success',
        data: {
          valid: validationResults.every(r => r.valid),
          items: validationResults
        }
      };
    }
    
    // 批量更新购物车商品选中状态
    if (url === '/api/cart/items/selection' && method === 'PUT') {
      const { itemIds, selected } = data;
      
      mockCartItems.forEach(item => {
        if (itemIds.includes(item.id)) {
          item.selected = selected;
        }
      });
      
      return {
        code: 200,
        message: 'success',
        data: {
          updatedItems: mockCartItems.filter(item => itemIds.includes(item.id))
        }
      };
    }
    
    // 获取商品规格
    if (url.match(/\/api\/products\/[\w-]+\/specifications$/)) {
      const productId = url.match(/\/api\/products\/([\w-]+)\/specifications$/)?.[1] || '';
      
      return {
        code: 200,
        message: 'success',
        data: {
          specifications: {
            颜色: ['红色', '蓝色', '黑色', '白色'],
            尺寸: ['S', 'M', 'L', 'XL'],
            型号: ['标准版', '豪华版', '至尊版']
          }
        }
      };
    }

    // 用户相关API
    if (url === '/auth/login' && method === 'POST') {
      const { username, password, phone, email, verificationCode, captcha } = data;
      
      // 验证码登录
      if (phone && verificationCode) {
        const storedCode = verificationCodes.get(phone);
        if (!storedCode || storedCode !== verificationCode) {
          return {
            code: 400,
            message: '验证码错误或已过期'
          };
        }
        
        const user = mockUsers.find(u => u.phone === phone);
        if (!user) {
          return {
            code: 404,
            message: '用户不存在'
          };
        }
        
        // 生成token
        const { token } = generateToken(user.id);
        
        // 更新最后登录时间
        user.lastLoginTime = new Date().toISOString();
        
        return {
          code: 200,
          message: 'success',
          data: {
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              phone: user.phone,
              role: user.role,
              avatar: user.avatar,
              lastLoginTime: user.lastLoginTime
            }
          }
        };
      }
      
      // 邮箱登录
      if (email && password) {
        const user = mockUsers.find(u => u.email === email);
        if (!user || user.password !== password) {
          return {
            code: 401,
            message: '邮箱或密码错误'
          };
        }
        
        // 生成token
        const { token } = generateToken(user.id);
        
        // 更新最后登录时间
        user.lastLoginTime = new Date().toISOString();
        
        return {
          code: 200,
          message: 'success',
          data: {
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              phone: user.phone,
              role: user.role,
              avatar: user.avatar,
              lastLoginTime: user.lastLoginTime
            }
          }
        };
      }
      
      // 用户名登录
      if (username && password) {
        const user = mockUsers.find(u => u.username === username);
        if (!user || user.password !== password) {
          return {
            code: 401,
            message: '用户名或密码错误'
          };
        }
        
        // 生成token
        const { token } = generateToken(user.id);
        
        // 更新最后登录时间
        user.lastLoginTime = new Date().toISOString();
        
        return {
          code: 200,
          message: 'success',
          data: {
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              phone: user.phone,
              role: user.role,
              avatar: user.avatar,
              lastLoginTime: user.lastLoginTime
            }
          }
        };
      }
      
      return {
        code: 400,
        message: '请提供正确的登录信息'
      };
    }

    if (url === '/auth/register' && method === 'POST') {
      const { username, password, email, phone } = data;
      
      // 验证用户名是否已存在
      if (mockUsers.some(u => u.username === username)) {
        return {
          code: 400,
          message: '用户名已存在'
        };
      }
      
      // 验证邮箱是否已存在
      if (email && mockUsers.some(u => u.email === email)) {
        return {
          code: 400,
          message: '邮箱已被注册'
        };
      }
      
      // 验证手机号是否已存在
      if (phone && mockUsers.some(u => u.phone === phone)) {
        return {
          code: 400,
          message: '手机号已被注册'
        };
      }
      
      // 创建新用户
      const newUser = {
        id: `u${mockUsers.length + 1}`,
        username,
        password,
        email,
        phone,
        role: 'user',
        avatar: `https://joeschmoe.io/api/v1/${username}`,
        lastLoginTime: new Date().toISOString(),
        addresses: []
      };
      
      mockUsers.push(newUser);
      
      // 生成token
      const { token } = generateToken(newUser.id);
      
      return {
        code: 200,
        message: 'success',
        data: {
          token,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            avatar: newUser.avatar,
            lastLoginTime: newUser.lastLoginTime
          }
        }
      };
    }

    if (url === '/auth/me' && method === 'GET') {
      const token = data?.token;
      
      if (!token) {
        return {
          code: 401,
          message: '未登录'
        };
      }
      
      const tokenData = verifyToken(token);
      if (!tokenData) {
        return {
          code: 401,
          message: 'token无效或已过期'
        };
      }
      
      const user = mockUsers.find(u => u.id === tokenData.userId);
      if (!user) {
        return {
          code: 404,
          message: '用户不存在'
        };
      }
      
      return {
        code: 200,
        message: 'success',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          lastLoginTime: user.lastLoginTime,
          addresses: user.addresses
        }
      };
    }

    if (url === '/auth/refreshToken' && method === 'POST') {
      const { token } = data;
      
      if (!token) {
        return {
          code: 400,
          message: '请提供token'
        };
      }
      
      const tokenData = tokenStore.get(token);
      if (!tokenData) {
        return {
          code: 401,
          message: 'token不存在'
        };
      }
      
      // 生成新token
      const newTokenData = generateToken(tokenData.userId);
      
      // 删除旧token
      tokenStore.delete(token);
      
      return {
        code: 200,
        message: 'success',
        data: {
          token: newTokenData.token,
          expiresAt: newTokenData.expiresAt
        }
      };
    }

    if (url === '/auth/sendSmsCode' && method === 'POST') {
      const { phone } = data;
      
      if (!phone) {
        return {
          code: 400,
          message: '请提供手机号'
        };
      }
      
      // 生成验证码
      const code = generateVerificationCode(phone);
      
      // 在实际应用中，这里会调用短信服务发送验证码
      console.log(`向手机号 ${phone} 发送验证码: ${code}`);
      
      return {
        code: 200,
        message: 'success',
        data: {
          // 在开发环境中返回验证码，方便测试
          code: process.env.NODE_ENV === 'development' ? code : undefined
        }
      };
    }

    if (url === '/auth/sendEmailCode' && method === 'POST') {
      const { email } = data;
      
      if (!email) {
        return {
          code: 400,
          message: '请提供邮箱地址'
        };
      }
      
      // 生成验证码
      const code = generateVerificationCode(email);
      
      // 在实际应用中，这里会调用邮件服务发送验证码
      console.log(`向邮箱 ${email} 发送验证码: ${code}`);
      
      return {
        code: 200,
        message: 'success',
        data: {
          // 在开发环境中返回验证码，方便测试
          code: process.env.NODE_ENV === 'development' ? code : undefined
        }
      };
    }

    if (url === '/auth/phoneLogin' && method === 'POST') {
      const { phone, verificationCode } = data;
      
      if (!phone || !verificationCode) {
        return {
          code: 400,
          message: '请提供手机号和验证码'
        };
      }
      
      const storedCode = verificationCodes.get(phone);
      if (!storedCode || storedCode !== verificationCode) {
        return {
          code: 400,
          message: '验证码错误或已过期'
        };
      }
      
      let user = mockUsers.find(u => u.phone === phone);
      
      // 如果用户不存在，创建一个新用户
      if (!user) {
        user = {
          id: `u${mockUsers.length + 1}`,
          username: `user_${phone.substring(phone.length - 4)}`,
          password: Math.random().toString(36).substring(2),
          email: '',
          phone,
          role: 'user',
          avatar: `https://joeschmoe.io/api/v1/random${mockUsers.length + 1}`,
          lastLoginTime: new Date().toISOString(),
          addresses: []
        };
        mockUsers.push(user);
      }
      
      // 更新最后登录时间
      user.lastLoginTime = new Date().toISOString();
      
      // 生成token
      const { token } = generateToken(user.id);
      
      return {
        code: 200,
        message: 'success',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            lastLoginTime: user.lastLoginTime
          }
        }
      };
    }

    // 第三方登录，如微信、QQ等
    if (url.includes('/auth/') && url.includes('Login') && method === 'POST') {
      // 处理第三方登录，如微信、QQ等
      const platform = url.split('/').pop()?.replace('Login', '');
      const { code } = data;
      
      if (!platform || !code) {
        return {
          code: 400,
          message: '请提供平台和授权码'
        };
      }
      
      // 在实际应用中，这里会调用第三方平台API验证授权码并获取用户信息
      // 这里简化处理，直接使用mock数据
      const mockThirdPartyUser = {
        id: `thirdparty_${platform}_${Math.random().toString(36).substring(2)}`,
        nickname: `${platform}用户${Math.floor(Math.random() * 1000)}`,
        avatar: `https://joeschmoe.io/api/v1/${platform}${Math.floor(Math.random() * 100)}`
      };
      
      // 查找是否存在绑定的用户
      let user = mockUsers.find(u => u.username === mockThirdPartyUser.nickname);
      
      // 如果用户不存在，创建一个新用户
      if (!user) {
        user = {
          id: `u${mockUsers.length + 1}`,
          username: mockThirdPartyUser.nickname,
          password: Math.random().toString(36).substring(2),
          email: '',
          phone: '',
          role: 'user',
          avatar: mockThirdPartyUser.avatar,
          lastLoginTime: new Date().toISOString(),
          addresses: []
        };
        mockUsers.push(user);
      }
      
      // 更新最后登录时间
      user.lastLoginTime = new Date().toISOString();
      
      // 生成token
      const { token } = generateToken(user.id);
      
      return {
        code: 200,
        message: 'success',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            lastLoginTime: user.lastLoginTime
          }
        }
      };
    }

    // 登出处理
    if (url === '/auth/logout' && method === 'POST') {
      const { token } = data;
      
      if (!token) {
        return { 
          code: 400, 
          message: '缺少token参数'
        };
      }
      
      // 将token添加到黑名单
      tokenBlacklist.add(token);
      
      // 设置一个定时器，模拟token过期后从黑名单中移除
      setTimeout(() => {
        tokenBlacklist.delete(token);
      }, 24 * 60 * 60 * 1000); // 24小时后自动从黑名单移除
      
      return {
        code: 200,
        message: 'success',
        data: {
          success: true
        }
      };
    }

    if (url === '/auth/forgot-password' && method === 'POST') {
      const { email, phone } = data;
      
      if (!email && !phone) {
        return {
          code: 400,
          message: '请提供邮箱或手机号'
        };
      }
      
      let user = null;
      
      if (email) {
        user = mockUsers.find(u => u.email === email);
      } else if (phone) {
        user = mockUsers.find(u => u.phone === phone);
      }
      
      if (!user) {
        return {
          code: 404,
          message: '用户不存在'
        };
      }
      
      // 生成重置密码的临时token
      const resetToken = `reset_${user.id}_${Math.random().toString(36).substring(2)}`;
      
      // 在实际应用中，这里会发送重置密码链接到用户邮箱或手机
      console.log(`向用户 ${user.username} 发送重置密码链接: /reset-password?token=${resetToken}`);
      
      return {
        code: 200,
        message: 'success',
        data: {
          // 在开发环境中返回重置token，方便测试
          resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
        }
      };
    }

    if (url === '/auth/reset-password' && method === 'POST') {
      const { token, password } = data;
      
      if (!token || !password) {
        return {
          code: 400,
          message: '请提供令牌和新密码'
        };
      }
      
      // 在实际应用中，这里会验证重置密码的token
      // 这里简化处理，只要有token和password就认为有效
      const userId = token.split('_')[1];
      const user = mockUsers.find(u => u.id === userId);
      
      if (!user) {
        return {
          code: 404,
          message: '用户不存在或令牌无效'
        };
      }
      
      // 更新密码
      user.password = password;
      
      return {
        code: 200,
        message: 'success',
        data: {
          success: true
        }
      };
    }

    // 获取订单列表
    if (url === '/orders' || url.startsWith('/orders?')) {
      console.log('模拟请求订单列表, 参数:', data);
      
      // 使用getMockOrders函数获取订单数据
      const orderData = getMockOrders(data);
      
      // 处理每个订单中的商品图片
      const processedOrders = orderData.data.map((order: any) => ensureProductImages(order));
      
      return {
        code: 200,
        message: 'success',
        data: {
          ...orderData,
          data: processedOrders
        }
      };
    }
    
    // 获取订单详情
    if (url.match(/\/orders\/[\w-]+$/) && method === 'GET') {
      console.log('模拟请求订单详情, URL:', url);
      // 从URL中提取订单ID，确保不是"list"
      const orderId = url.split('/').pop();
      if (orderId === 'list') {
        console.warn('无效的订单ID:', orderId);
        return {
          code: 400,
          message: '无效的订单ID',
          data: null
        };
      }
      
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) {
        console.warn(`订单 ${orderId} 不存在`);
        return {
          code: 404,
          message: '订单不存在',
          data: null
        };
      }
      
      console.log('找到订单:', order.id, order.orderNumber);
      return {
        code: 200,
        message: 'success',
        data: ensureProductImages(order)
      };
    }
    
    // 取消订单
    if (url.match(/\/orders\/[\w-]+\/cancel$/) && method === 'POST') {
      const orderId = url.split('/')[2];
      const { reason } = data;
      const order = mockOrders.find(o => o.id === orderId);
      
      if (!order) {
        return {
          code: 404,
          message: '订单不存在',
          data: null
        };
      }
      
      // 更新订单状态
      order.status = 'cancelled';
      order.cancelReason = reason;
      order.cancelTime = new Date().toISOString();
      
      return {
        code: 200,
        message: 'success',
        data: {
          success: true
        }
      };
    }
    
    // 申请售后/退款
    if (url.match(/\/orders\/[\w-]+\/refund$/) && method === 'POST') {
      const orderId = url.split('/')[2];
      const order = mockOrders.find(o => o.id === orderId);
      
      if (!order) {
        return {
          code: 404,
          message: '订单不存在',
          data: null
        };
      }
      
      // 生成唯一的退款ID
      const refundId = `refund_${Date.now()}`;
      
      // 创建退款记录
      const newRefund = {
        id: refundId,
        orderId: orderId,
        status: 'pending',
        amount: data.amount || 0,
        reason: data.reason || '用户申请退款',
        description: data.description || '',
        type: data.type || 'refund',
        items: data.items || [],
        images: data.images || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 如果订单没有refunds数组，创建一个
      if (!order.refunds) {
        order.refunds = [];
      }
      
      // 添加退款记录
      order.refunds.push(newRefund);
      
      return {
        code: 200,
        message: 'success',
        data: {
          success: true,
          refundId: refundId
        }
      };
    }

    // 获取订单物流信息
    if (url.match(/\/orders\/[\w-]+\/tracking$/) && method === 'GET') {
      console.log('模拟请求订单物流信息, URL:', url);
      // 从URL中提取订单ID，确保不是"list"
      const orderId = url.split('/')[2];
      if (orderId === 'list') {
        console.warn('无效的订单ID:', orderId);
        return {
          code: 400,
          message: '无效的订单ID',
          data: null
        };
      }
      
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) {
        console.warn(`订单 ${orderId} 不存在`);
        return {
          code: 404,
          message: '订单不存在',
          data: null
        };
      }
      
      // 只有已发货、已送达或已完成的订单才有物流信息
      if (!['shipping', 'delivered', 'completed'].includes(order.status)) {
        console.warn(`订单 ${orderId} 尚未发货，状态为 ${order.status}`);
        return {
          code: 400,
          message: '订单尚未发货',
          data: null
        };
      }
      
      // 模拟物流信息
      const trackingInfo = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber || `SF${Math.floor(Math.random() * 1000000000)}`,
        trackingCompany: order.trackingCompany || '顺丰速运',
        status: order.status === 'shipping' ? '运输中' : '已送达',
        productInfo: ensureProductImages(order).items.map((item: any) => ({
          id: item.id,
          name: item.productName || item.name,
          image: item.productImage,
          quantity: item.quantity
        })),
        traces: [
          {
            time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            content: '【广州市】快件已发车',
            location: '广州转运中心'
          },
          {
            time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            content: '【广州市】快件已到达 广州转运中心',
            location: '广州转运中心'
          },
          {
            time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            content: '【深圳市】快件已发车',
            location: '深圳转运中心'
          },
          {
            time: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
            content: '【深圳市】快件已揽收',
            location: '深圳南山区'
          }
        ]
      };
      
      console.log('返回物流信息:', trackingInfo.trackingNumber);
      
      return {
        code: 200,
        message: 'success',
        data: trackingInfo
      };
    }

    // 如果没有匹配的路由，返回404
    return {
      code: 404,
      message: '接口不存在',
      data: null
    };
  } catch (error) {
    console.error('模拟API处理出错:', error);
    return {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 导出mockCartItems以便其他模块可以访问
export const getMockCartItems = () => [...mockCartItems];
export const setMockCartItems = (items: typeof mockCartItems) => {
  mockCartItems = [...items];
}; 