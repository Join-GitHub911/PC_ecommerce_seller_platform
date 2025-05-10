import { CartItem } from '../cart';

// 根据ProductDetail.tsx中的数据创建购物车数据
export const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: 'p1',
    productName: "凡茜白茶毛孔细致卸妆油200ml官方旗舰店正品卸妆女",
    productImage: "/src/assets/product1-1.png",
    price: 53,
    originalPrice: 99,
    quantity: 1,
    specifications: {
      "规格": "200ml正装",
      "功效": "深层清洁型"
    },
    stock: 999,
    status: 'normal',
    shopName: "凡茜官方旗舰店",
    shopId: '1002',
    promotion: {
      type: 'discount',
      description: '特价5.3折',
      value: 53 // 表示5.3折
    }
  },
  {
    id: '2',
    productId: 'p2',
    productName: "德国原装进口德亚原味酸奶纯牛奶制作200ml*24盒整箱",
    productImage: "/src/assets/德亚酸奶1.png",
    price: 189,
    originalPrice: 239,
    quantity: 1,
    specifications: {
      "规格": "200ml*24盒",
      "口味": "原味"
    },
    stock: 500,
    status: 'normal',
    shopName: "德亚优选进口食品店",
    shopId: '1003',
    promotion: {
      type: 'discount',
      description: '限时8折',
      value: 80
    }
  },
  {
    id: '3',
    productId: 'p3',
    productName: "Apple/iPhone 6s Plus全网通手机正品学生老人机备用6s苹果手机",
    productImage: "/src/assets/iPhone6s玫瑰金.png",
    price: 5288,
    originalPrice: 6288,
    quantity: 1,
    specifications: {
      "颜色": "玫瑰金色",
      "存储容量": "64GB",
      "网络类型": "全网通"
    },
    stock: 200,
    status: 'normal',
    shopName: "智汇数码专营店",
    shopId: '1001',
    promotion: {
      type: 'discount',
      description: '直降1000元',
      value: 84
    }
  },
  {
    id: '4',
    productId: 'p4',
    productName: "倩碧(Clinique)保湿修护水乳套装（黄油125ml+粉水200ml）干皮补水护肤品礼盒",
    productImage: "/src/assets/倩碧1.png",
    price: 368,
    originalPrice: 498,
    quantity: 1,
    specifications: {
      "套装类型": "基础护肤套装(黄油+粉水)",
      "适用肤质": "干性肌肤"
    },
    stock: 300,
    status: 'normal',
    shopName: "倩碧悦颜官方旗舰店",
    shopId: '1004',
    promotion: {
      type: 'discount',
      description: '7.4折优惠',
      value: 74
    }
  },
  {
    id: '5',
    productId: 'p5',
    productName: "西班牙原装进口MUELOLIVA品利特级初榨橄榄油750ml",
    productImage: "/src/assets/品利1.png",
    price: 280,
    originalPrice: 399,
    quantity: 1,
    specifications: {
      "规格": "750ml单瓶",
      "产地": "西班牙",
      "种类": "特级初榨"
    },
    stock: 500,
    status: 'normal',
    shopName: "品利橄榄油官方旗舰店",
    shopId: '1005',
    promotion: {
      type: 'discount',
      description: '7折优惠',
      value: 70
    }
  }
];

// 导出获取推荐商品的函数 - 用于购物车页面的"猜你喜欢"区域
export const getRecommendedProductsData = () => {
  return [
    {
      id: 'rec1',
      name: "凡茜白茶控油洁面乳120ml 深层清洁",
      price: 68,
      originalPrice: 128,
      sales: 2354,
      discount: 5.3,
      mainImage: "/src/assets/product2.png"
    },
    {
      id: 'rec2',
      name: "德亚低脂纯牛奶200ml*24盒 德国原装进口",
      price: 159,
      originalPrice: 209,
      sales: 3568,
      discount: 7.6,
      mainImage: "/src/assets/德亚酸奶2.png"
    },
    {
      id: 'rec3',
      name: "Apple AirPods Pro 主动降噪无线耳机",
      price: 1999,
      originalPrice: 2299,
      sales: 9865,
      discount: 8.7,
      mainImage: "/src/assets/product3.png"
    },
    {
      id: 'rec4',
      name: "倩碧明星护肤三步曲套装",
      price: 450,
      originalPrice: 650,
      sales: 5621,
      discount: 6.9,
      mainImage: "/src/assets/倩碧2.png"
    },
    {
      id: 'rec5',
      name: "品利特级初榨橄榄油礼盒装750ml*2瓶",
      price: 499,
      originalPrice: 699,
      sales: 1356,
      discount: 7.1,
      mainImage: "/src/assets/品利3.png"
    },
    {
      id: 'rec6',
      name: "凡茜白茶护肤礼盒 水乳面霜套装",
      price: 399,
      originalPrice: 698,
      sales: 4256,
      discount: 5.7,
      mainImage: "/src/assets/product4.png"
    },
    {
      id: 'rec7',
      name: "德亚常温酸奶200ml*10盒",
      price: 99,
      originalPrice: 158,
      sales: 2145,
      discount: 6.3,
      mainImage: "/src/assets/德亚酸奶3.png"
    },
    {
      id: 'rec8',
      name: "iPhone 6s Plus手机壳保护套全包防摔",
      price: 39,
      originalPrice: 99,
      sales: 12568,
      discount: 3.9,
      mainImage: "/src/assets/product5.png"
    }
  ];
}; 