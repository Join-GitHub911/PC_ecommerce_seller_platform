// 导入默认产品图片
import pinliDefaultImage from '../assets/品利1.png';
import deyaDefaultImage from '../assets/德亚酸奶1.png';
import qingbiDefaultImage from '../assets/倩碧1.png';
import iphoneDefaultImage from '../assets/iPhone6s玫瑰金.png';
import fanxiDefaultImage from '../assets/product1-1.png';

// 为各类产品准备多个图片选项
export const fanxiImages = [
  '/src/assets/product1-1.png',
  '/src/assets/product1-2.png',
  '/src/assets/product1-3.png',
  '/src/assets/product1-4.png'
];

export const iphoneImages = [
  '/src/assets/iPhone6s玫瑰金.png',
  '/src/assets/iPhone6s金色.png',
  '/src/assets/iPhone6s深空灰.png',
  '/src/assets/iPhone6银色.png'
];

export const deyaImages = [
  '/src/assets/德亚酸奶1.png',
  '/src/assets/德亚酸奶2.png',
  '/src/assets/德亚酸奶3.png',
  '/src/assets/德亚酸奶4.png'
];

export const pinliImages = [
  '/src/assets/品利1.png',
  '/src/assets/品利2.png',
  '/src/assets/品利3.png',
  '/src/assets/品利4.png',
  '/src/assets/品利5.png'
];

export const qingbiImages = [
  '/src/assets/倩碧1.png',
  '/src/assets/倩碧2.png',
  '/src/assets/倩碧3.png',
  '/src/assets/倩碧4.png',
  '/src/assets/倩碧5.png'
];

/**
 * 根据产品名称识别商品品牌
 * @param productName 产品名称
 * @returns 品牌标识
 */
export const identifyProductBrand = (productName: string = ''): string => {
  const lowerName = productName.toLowerCase();
  if (lowerName.includes('iphone') || lowerName.includes('苹果')) {
    return 'iphone';
  } else if (lowerName.includes('酸奶') || lowerName.includes('德亚')) {
    return 'deya';
  } else if (lowerName.includes('橄榄油') || lowerName.includes('品利')) {
    return 'pinli';
  } else if (lowerName.includes('凡茜')) {
    return 'fanxi';
  } else if (lowerName.includes('倩碧')) {
    return 'qingbi';
  }
  return 'unknown';
};

/**
 * 获取产品图片路径，处理不同来源的图片路径格式
 * @param imagePath 原始图片路径
 * @param productName 产品名称，用于在图片不存在时根据产品类型选择默认图片
 * @returns 处理后的图片路径
 */
export const getProductImagePath = (imagePath: string | undefined, productName: string = ''): string => {
  // 对于"我的订单"页面，返回null
  if (window.location.pathname.includes('/orders') || 
      window.location.pathname.includes('/order/')) {
    return '';
  }
  
  // 如果有图片路径
  if (imagePath) {
    // 如果路径以/src/assets/开头，需要特殊处理
    if (imagePath.startsWith('/src/assets/')) {
      // 截取/src部分，直接使用相对路径
      return imagePath.replace('/src', '.');
    }
    return imagePath;
  }
  
  // 如果没有图片路径，根据产品名称选择默认图片
  const brand = identifyProductBrand(productName);
  switch (brand) {
    case 'iphone':
      return iphoneDefaultImage;
    case 'deya':
      return deyaDefaultImage;
    case 'pinli':
      return pinliDefaultImage;
    case 'fanxi':
      return fanxiDefaultImage;
    case 'qingbi':
    default:
      return qingbiDefaultImage; // 默认使用倩碧图片
  }
};

/**
 * 为特定品牌选择一张随机图片
 * @param brand 品牌标识
 * @param seed 随机种子，通常可以使用商品ID
 * @returns 图片路径
 */
export const getRandomBrandImage = (brand: string, seed: string = ''): string => {
  // 对于"我的订单"页面，返回null
  if (window.location.pathname.includes('/orders') || 
      window.location.pathname.includes('/order/')) {
    return '';
  }
  
  // 将seed转换为数字，用于选择图片
  const seedNumber = seed ? parseInt(seed.replace(/\D/g, ''), 10) || 0 : 0;
  
  let imageArray: string[] = [];
  switch (brand) {
    case 'iphone':
      imageArray = iphoneImages;
      break;
    case 'deya':
      imageArray = deyaImages;
      break;
    case 'pinli':
      imageArray = pinliImages;
      break;
    case 'fanxi':
      imageArray = fanxiImages;
      break;
    case 'qingbi':
    default:
      imageArray = qingbiImages;
      break;
  }
  
  // 使用seed选择图片，确保同一个商品始终使用相同的图片
  const index = seedNumber % imageArray.length;
  const imagePath = imageArray[index];
  
  // 转换路径格式
  return imagePath.replace('/src', '.');
}; 