import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Table, 
  InputNumber, 
  Button, 
  Space, 
  Typography, 
  Divider, 
  Image, 
  Checkbox, 
  message, 
  Empty,
  Skeleton,
  Card,
  Row,
  Col,
  Tag,
  Tooltip,
  Spin,
  Badge,
  Popconfirm,
  Modal,
  Alert
} from 'antd';
import { 
  DeleteOutlined, 
  ShoppingOutlined, 
  ShoppingCartOutlined, 
  ArrowRightOutlined,
  HeartOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  FireOutlined,
  ShopOutlined,
  TagOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  StarOutlined,
  InfoCircleOutlined,
  CreditCardOutlined,
  TruckOutlined,
  HomeOutlined,
  BellOutlined,
  RightOutlined,
  EditOutlined,
  SyncOutlined,
  PercentageOutlined,
  CustomerServiceOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';
import { 
  getCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart, 
  batchRemoveCartItems,
  updateCartItemSpec,
  updateCartItemsSelection,
  validateCartItemStock,
  getProductSpecifications,
  batchMoveToWishlist,
  moveToWishlist,
  CartItem,
  getLocalCart,
  saveLocalCart
} from '../api/cart';
import { getRecommendedProducts } from '../api/product';
import './Cart.css';
import { CART_COUNT_UPDATE_EVENT, updateGlobalCartCount } from '../components/Header';
import { isUserLoggedIn } from '../api/auth';

// 导入新组件
import CartItemSpecSelector from '../components/CartItemSpecSelector';
import CartBatchToolbar from '../components/CartBatchToolbar';
import StockStatusChecker from '../components/StockStatusChecker';
import CartPromotions from '../components/CartPromotions';

const { Title, Text } = Typography;

interface AvailableSpecs {
  [productId: string]: Record<string, string[]>;
}

interface Promotion {
  id: string;
  type: 'discount' | 'reduction' | 'gift' | 'bundle' | 'coupon';
  name: string;
  description: string;
  value: number;
  threshold?: number;
  maxValue?: number;
  color?: string;
  promotionTag?: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockLoading, setStockLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [specModalVisible, setSpecModalVisible] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<CartItem | null>(null);
  const [availableSpecs, setAvailableSpecs] = useState<AvailableSpecs>({});
  const [shopPromotions, setShopPromotions] = useState<Promotion[]>([]);
  const [globalPromotions, setGlobalPromotions] = useState<Promotion[]>([]);
  const [stockValidationTime, setStockValidationTime] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    fetchRecommendedProducts();
    
    // 登录状态变化时刷新购物车
    const handleLoginStatusChange = () => {
      fetchCartItems();
    };
    
    window.addEventListener('loginStatusChange', handleLoginStatusChange);
    
    return () => {
      window.removeEventListener('loginStatusChange', handleLoginStatusChange);
    };
  }, []);
  
  // 新增：每15分钟校验一次库存
  useEffect(() => {
    const now = Date.now();
    // 如果上次校验时间超过15分钟或者没有校验过，则校验库存
    if (now - stockValidationTime > 15 * 60 * 1000 && cartItems.length > 0) {
      validateStock();
      setStockValidationTime(now);
    }
  }, [cartItems, stockValidationTime]);

  // 检查用户登录状态并获取购物车
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      // 检查用户是否已登录，为了演示，假设用户已登录
      const loggedIn = true; // 强制使用API数据而不是本地存储
      
      if (loggedIn) {
        // 用户已登录，从API获取购物车
        const response = await getCart();
        const items = response.data.items || [];
        
        // 处理商品状态
        const itemsWithStatus = items.map((item: CartItem) => ({
          ...item,
          selected: true, // 设置所有商品默认选中
          status: item.status || getItemStatus(item) // 使用已有状态或计算状态
        }));
        
        setCartItems(itemsWithStatus);
        setSelectedItems(itemsWithStatus.filter(item => isItemSelectable(item)).map(item => item.id));
        
        // 同步获取可用规格
        fetchItemsSpecifications(itemsWithStatus);
        
        // 获取促销信息
        fetchPromotions();
      } else {
        // 保留原有的本地存储逻辑以防需要
        const localCart = getLocalCart();
        setCartItems(localCart);
        setSelectedItems(localCart.filter(item => isItemSelectable(item)).map(item => item.id));
      }
    } catch (error) {
      console.error('获取购物车失败:', error);
      message.error('获取购物车失败，请稍后重试');
      
      // 发生错误时，尝试从本地存储加载
      const localCart = getLocalCart();
      setCartItems(localCart);
      setSelectedItems(localCart.filter(item => isItemSelectable(item)).map(item => item.id));
    } finally {
      setLoading(false);
    }
  };

  // 获取本地存储的购物车
  const getLocalCart = (): CartItem[] => {
    try {
      const localCartJson = localStorage.getItem('localCart');
      return localCartJson ? JSON.parse(localCartJson) : [];
    } catch (error) {
      console.error('解析本地购物车失败:', error);
      return [];
    }
  };

  // 保存购物车到本地存储
  const saveLocalCart = (items: CartItem[]) => {
    try {
      localStorage.setItem('localCart', JSON.stringify(items));
    } catch (error) {
      console.error('保存本地购物车失败:', error);
    }
  };

  // 清空本地购物车
  const clearLocalCart = () => {
    localStorage.removeItem('localCart');
  };

  const fetchRecommendedProducts = async () => {
    try {
      const response = await getRecommendedProducts(8); // 增加推荐商品数量
      setRecommendedProducts(response.data);
    } catch (error) {
      console.error('获取推荐商品失败:', error);
    }
  };

  // 更新本地购物车项
  const updateLocalCartItem = (itemId: string, update: Partial<CartItem>) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, ...update };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    saveLocalCart(updatedCart);
    
    // 更新全局购物车数量
    updateGlobalCartCount(calculateTotalItems(updatedCart));
  };
  
  // 从本地购物车移除项目
  const removeLocalCartItem = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    saveLocalCart(updatedCart);
    
    // 从选中项中移除
    setSelectedItems(selectedItems.filter(id => id !== itemId));
    
    // 更新全局购物车数量
    updateGlobalCartCount(calculateTotalItems(updatedCart));
  };

  const handleQuantityChange = async (id: string, newQuantity: number | null) => {
    // 如果数量为null或负数，使用1作为默认值
    const quantity = newQuantity === null || newQuantity < 0 ? 1 : newQuantity;
    
    // 获取当前购物车项
    const currentItem = cartItems.find(item => item.id === id);
    if (!currentItem) return;
    
    // 检查库存
    if (quantity > currentItem.stock) {
      message.warning(`商品库存不足，最多可购买${currentItem.stock}件`);
      // 将数量设置为库存上限
      const limitedQuantity = currentItem.stock;
      
      if (id.startsWith('local_')) {
        // 本地购物车项
        updateLocalCartItem(id, { quantity: limitedQuantity });
        return;
      }
      
      try {
        await updateCartItem(id, limitedQuantity);
        // 更新本地状态
        setCartItems(
          cartItems.map(item => 
            item.id === id ? { ...item, quantity: limitedQuantity } : item
          )
        );
        
        // 更新全局购物车数量
        updateGlobalCartCount(calculateTotalItems());
      } catch (error) {
        console.error('更新购物车失败:', error);
      }
      return;
    }
    
    // 检查最小和最大购买限制
    if (currentItem.minBuy && quantity < currentItem.minBuy) {
      message.warning(`该商品最少需购买${currentItem.minBuy}件`);
      // 将数量设置为最小限制
      const minQuantity = currentItem.minBuy;
      
      if (id.startsWith('local_')) {
        // 本地购物车项
        updateLocalCartItem(id, { quantity: minQuantity });
        return;
      }
      
      try {
        await updateCartItem(id, minQuantity);
        // 更新本地状态
        setCartItems(
          cartItems.map(item => 
            item.id === id ? { ...item, quantity: minQuantity } : item
          )
        );
      } catch (error) {
        console.error('更新购物车失败:', error);
      }
      return;
    }
    
    if (currentItem.maxBuy && quantity > currentItem.maxBuy) {
      message.warning(`该商品最多限购${currentItem.maxBuy}件`);
      // 将数量设置为最大限制
      const maxQuantity = currentItem.maxBuy;
      
      if (id.startsWith('local_')) {
        // 本地购物车项
        updateLocalCartItem(id, { quantity: maxQuantity });
        return;
      }
      
      try {
        await updateCartItem(id, maxQuantity);
        // 更新本地状态
        setCartItems(
          cartItems.map(item => 
            item.id === id ? { ...item, quantity: maxQuantity } : item
          )
        );
      } catch (error) {
        console.error('更新购物车失败:', error);
      }
      return;
    }
    
    if (id.startsWith('local_')) {
      // 本地购物车项
      updateLocalCartItem(id, { quantity });
      return;
    }
    
    try {
      await updateCartItem(id, quantity);
      // 更新本地状态
      setCartItems(
        cartItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
      
      // 更新全局购物车数量
      updateGlobalCartCount(calculateTotalItems());
    } catch (error) {
      console.error('更新购物车失败:', error);
      message.error('更新购物车失败，请稍后重试');
    }
  };

  const handleRemoveItem = async (id: string) => {
    if (id.startsWith('local_')) {
      // 本地购物车项
      removeLocalCartItem(id);
      message.success('商品已成功从购物车移除');
      return;
    }
    
    try {
      // 在删除前先获取将要删除的商品数量
      const itemToRemove = cartItems.find(item => item.id === id);
      const itemQuantity = itemToRemove ? itemToRemove.quantity : 0;
      
      await removeCartItem(id);
      
      // 从选中项中移除
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
      
      // 更新本地状态
      setCartItems(cartItems.filter(item => item.id !== id));
      
      // 计算新的购物车总数量并更新全局购物车数量
      const newTotalItems = calculateTotalItems() - itemQuantity;
      updateGlobalCartCount(newTotalItems >= 0 ? newTotalItems : 0);
      
      message.success('商品已成功从购物车移除');
    } catch (error) {
      console.error('删除购物车商品失败:', error);
      message.error('删除购物车商品失败，请稍后重试');
    }
  };

  const handleClearCart = async () => {
    Modal.confirm({
      title: '确认清空购物车',
      content: '您确定要清空购物车中的所有商品吗？此操作不可恢复。',
      okText: '确认清空',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await clearCart();
              
          // 清空本地状态
          setCartItems([]);
          setSelectedItems([]);
          
          // 更新全局购物车数量
          updateGlobalCartCount(0);
              
          message.success('购物车已清空');
        } catch (error) {
          console.error('清空购物车失败:', error);
          message.error('清空购物车失败，请稍后重试');
        }
      }
    });
  };

  const handleCheckout = () => {
    // 检查是否有选中的商品
    if (selectedItems.length === 0) {
      message.warning('请选择要结算的商品');
      return;
    }
    
    // 检查选中的商品是否都有库存
    const invalidItems = selectedItems
      .map(id => cartItems.find(item => item.id === id))
      .filter(item => item && (item.status === 'soldout' || item.status === 'removed'));
    
    if (invalidItems.length > 0) {
      message.error('您选择的商品中有已售罄或已下架的商品，请重新选择');
      return;
    }
    
    // 跳转到结算页面，并传递选中的商品ID
    navigate(`/checkout?items=${selectedItems.join(',')}`);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // 仅选择可购买的商品
      const selectableItems = cartItems
        .filter(isItemSelectable)
        .map(item => item.id);
      setSelectedItems(selectableItems);
    } else {
      setSelectedItems([]);
    }
  };

  // 新增：批量更新选中状态的API调用
  const updateSelectionInBackend = async (itemIds: string[], selected: boolean) => {
    try {
      await updateCartItemsSelection(itemIds, selected);
    } catch (error) {
      console.error('更新选中状态失败:', error);
      // 这里不显示错误提示，因为不影响用户操作
    }
  };

  const handleMoveToWishlist = (itemId: string) => {
    // 移动单个商品到收藏夹
    moveToWishlist(itemId)
      .then(() => {
        // 从购物车中移除
        setCartItems(cartItems.filter(item => item.id !== itemId));
        // 从选中项中移除
        setSelectedItems(selectedItems.filter(id => id !== itemId));
        message.success('商品已移入收藏夹');
      })
      .catch(error => {
        console.error('移入收藏夹失败:', error);
        message.error('移入收藏夹失败，请稍后重试');
      });
  };
  
  // 新增：批量移动到收藏夹
  const handleBatchMoveToWishlist = () => {
    if (selectedItems.length === 0) {
      message.warning('请先选择商品');
      return;
    }
    
    batchMoveToWishlist(selectedItems)
      .then(() => {
        // 从购物车中移除
        setCartItems(cartItems.filter(item => !selectedItems.includes(item.id)));
        // 清空选中项
        setSelectedItems([]);
        message.success(`${selectedItems.length}件商品已移入收藏夹`);
      })
      .catch(error => {
        console.error('批量移入收藏夹失败:', error);
        message.error('批量移入收藏夹失败，请稍后重试');
      });
  };

  // 新增：编辑商品规格
  const handleEditSpecs = (item: CartItem) => {
    setCurrentEditItem(item);
    setSpecModalVisible(true);
  };
  
  // 新增：确认修改规格
  const handleSpecChange = async (specs: Record<string, string>) => {
    if (!currentEditItem) return;
    
    try {
      await updateCartItemSpec(currentEditItem.id, specs);
      
      // 更新本地状态
      setCartItems(cartItems.map(item => 
        item.id === currentEditItem.id 
          ? { ...item, specifications: specs } 
          : item
      ));
      
      return Promise.resolve();
    } catch (error) {
      console.error('更新规格失败:', error);
      return Promise.reject(error);
    }
  };

  const renderItemStatusTag = (item: CartItem) => {
    return (
      <StockStatusChecker 
        stock={item.stock} 
        quantity={item.quantity} 
        status={item.status} 
      />
    );
  };

  const renderPromotionInfo = (item: CartItem) => {
    if (!item.promotion) return null;
    
    const { type, description, value } = item.promotion;
    
    let icon = <TagOutlined />;
    let color = 'blue';
    
    if (type === 'discount') {
      icon = <PercentageOutlined />;
        color = 'orange';
    } else if (type === 'reduction') {
        icon = <DollarOutlined />;
      color = 'red';
    } else if (type === 'gift') {
        icon = <GiftOutlined />;
      color = 'green';
    }
    
    return (
      <div className="cart-item-promotion">
        <Tag color={color} icon={icon}>{description}</Tag>
      </div>
    );
  };

  // 计算单品价格
  const calculateItemPrice = (item: CartItem) => {
    // 如果有促销信息，则根据促销类型计算价格
    if (item.promotion) {
      const { type, value } = item.promotion;
      
      if (type === 'discount') {
        // 折扣，例如80折就是value=80
        return (item.price * value / 100);
      }
    }
    
    return item.price;
  };

  // 计算单品小计
  const calculateItemSubtotal = (item: CartItem) => {
    const price = calculateItemPrice(item);
    return (price * item.quantity);
  };

  // 计算总价
  const calculateTotal = () => {
    if (cartItems.length === 0) return 0;
    
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => {
        return total + calculateItemSubtotal(item);
      }, 0);
  };

  // 新增：应用促销计算最终价格
  const calculateFinalPrice = (): number => {
    const total = calculateTotal();
    const shipping = total >= 99 ? 0 : 10;
    
    // 计算满减优惠
    const reductionInfo = getOrderReductionInfo();
    const reduction = reductionInfo.satisfied ? reductionInfo.reduction : 0;
    
    return total + shipping - reduction;
  };

  const getOrderReductionInfo = () => {
    const subtotal = calculateTotal();
    
    // 找出所有可用的满减促销
    const availableReductions = [...shopPromotions, ...globalPromotions]
      .filter(promo => 
        promo.type === 'reduction' && 
        promo.threshold && 
        subtotal >= promo.threshold
      )
      .sort((a, b) => {
        // 安全地访问threshold
        const aThreshold = a.threshold || 0;
        const bThreshold = b.threshold || 0;
        return bThreshold - aThreshold; // 按满减金额从大到小排序
      });
    
    // 找出最优的满减促销
    const bestReduction = availableReductions[0];
    
    if (bestReduction) {
      return {
        satisfied: true,
        reduction: bestReduction.value,
        description: bestReduction.description,
        // 计算差额
        difference: 0 // 已满足条件，差额为0
      };
    }
    
    // 如果没有满足条件的满减，找出最接近的一个
    const nearestReduction = [...shopPromotions, ...globalPromotions]
      .filter(promo => 
        promo.type === 'reduction' && 
        promo.threshold && 
        subtotal < promo.threshold
      )
      .sort((a, b) => {
        // 安全地访问threshold
        const aThreshold = a.threshold || 0;
        const bThreshold = b.threshold || 0;
        return aThreshold - bThreshold; // 按门槛从小到大排序，取第一个
      })[0];
    
    if (nearestReduction && nearestReduction.threshold) {
      return {
        satisfied: false,
        reduction: 0,
        description: nearestReduction.description,
        threshold: nearestReduction.threshold,
        difference: nearestReduction.threshold - subtotal
      };
    }
    
    return {
      satisfied: false,
      reduction: 0,
      description: '',
      difference: 0
    };
  };

  const calculateTotalQuantity = () => {
    if (cartItems.length === 0) return 0;
    
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.quantity, 0);
  };
  
  const calculateTotalDiscount = () => {
    if (cartItems.length === 0) return 0;
    
    return cartItems
      .filter(item => selectedItems.includes(item.id) && item.originalPrice)
      .reduce((total, item) => {
        const originalSubtotal = (item.originalPrice || 0) * item.quantity;
        const currentSubtotal = calculateItemSubtotal(item);
        return total + (originalSubtotal - currentSubtotal);
      }, 0);
  };

  const calculateTotalItems = (items = cartItems) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleInverseSelection = () => {
    // 反选操作：将当前未选中的可选择商品选中，将已选中的商品取消选中
    const newSelectedItems = cartItems
      .filter(item => isItemSelectable(item))
      .filter(item => !selectedItems.includes(item.id))
      .map(item => item.id);
    
    setSelectedItems(newSelectedItems);
    
    // 更新后端选中状态
    updateSelectionInBackend(newSelectedItems, true);
  };

  const handleSelectByStatus = (status: 'normal' | 'all') => {
    let itemsToSelect = [];
    
    if (status === 'normal') {
      // 选择所有可购买的商品
      itemsToSelect = cartItems
        .filter(item => item.status === 'normal')
        .map(item => item.id);
    } else {
      // 选择所有商品
      itemsToSelect = cartItems
        .filter(isItemSelectable)
        .map(item => item.id);
    }
    
    setSelectedItems(itemsToSelect);
    
    // 更新后端选中状态
    updateSelectionInBackend(itemsToSelect, true);
  };

  const isItemSelectable = (item: CartItem) => {
    // 赠品、已下架的商品不可选择
    return !item.isGift && item.status !== 'removed';
  };

  const handleBatchRemove = async () => {
    if (selectedItems.length === 0) {
      message.warning('请先选择要删除的商品');
      return;
    }

    try {
      // 计算要删除的商品总数量
      const itemsToRemove = cartItems.filter(item => selectedItems.includes(item.id));
      const totalQuantityToRemove = itemsToRemove.reduce((total, item) => total + item.quantity, 0);
      
      await batchRemoveCartItems(selectedItems);
      
      // 更新本地状态
      setCartItems(cartItems.filter(item => !selectedItems.includes(item.id)));
      
      // 清空选中项
      setSelectedItems([]);
      
      // 更新全局购物车数量，减去要删除商品的总数量
      const currentTotal = calculateTotalItems();
      const newTotalItems = currentTotal - totalQuantityToRemove;
      updateGlobalCartCount(newTotalItems >= 0 ? newTotalItems : 0);
      
      message.success(`已成功删除${selectedItems.length}件商品`);
    } catch (error) {
      console.error('批量删除商品失败:', error);
      message.error('批量删除商品失败，请稍后重试');
    }
  };

  // 新增：获取商品规格信息
  const fetchItemsSpecifications = async (items: CartItem[]) => {
    try {
      const promises = items.map(item => 
        getProductSpecifications(item.productId)
          .then(response => ({
            productId: item.productId,
            specs: response.data.specifications
          }))
          .catch(() => ({
            productId: item.productId,
            specs: {}
          }))
      );
      
      const results = await Promise.all(promises);
      const specsMap: AvailableSpecs = {};
      
      results.forEach(result => {
        specsMap[result.productId] = result.specs;
      });
      
      setAvailableSpecs(specsMap);
    } catch (error) {
      console.error('获取商品规格信息失败:', error);
    }
  };
  
  // 新增：获取促销信息
  const fetchPromotions = async () => {
    try {
      // 这里应该调用API获取促销信息
      // 由于没有实际API，这里使用模拟数据
      
      // 模拟店铺促销
      const mockShopPromotions: Promotion[] = [
        {
          id: 'shop-promo-1',
          type: 'reduction',
          name: '满减优惠',
          description: '全场满199元减20元',
          value: 20,
          threshold: 199,
          promotionTag: '满减',
          color: 'red'
        },
        {
          id: 'shop-promo-2',
          type: 'discount',
          name: '店铺折扣',
          description: '全场9折',
          value: 90,
          promotionTag: '折扣',
          color: 'orange'
        }
      ];
      
      // 模拟全局促销
      const mockGlobalPromotions: Promotion[] = [
        {
          id: 'global-promo-1',
          type: 'reduction',
          name: '跨店满减',
          description: '全平台满299元减30元',
          value: 30,
          threshold: 299,
          promotionTag: '跨店满减',
          color: 'blue'
        },
        {
          id: 'global-promo-2',
          type: 'gift',
          name: '赠品活动',
          description: '购物满399元赠送精美礼品',
          value: 0,
          threshold: 399,
          promotionTag: '赠品',
          color: 'purple'
        }
      ];
      
      setShopPromotions(mockShopPromotions);
      setGlobalPromotions(mockGlobalPromotions);
    } catch (error) {
      console.error('获取促销信息失败:', error);
    }
  };
  
  // 新增：判断商品状态
  const getItemStatus = (item: CartItem): 'normal' | 'soldout' | 'removed' | 'limited' => {
    if (item.stock <= 0) {
      return 'soldout';
    }
    // 库存紧张，定义为少于5件
    if (item.stock < 5) {
      return 'limited';
    }
    return 'normal';
  };
  
  // 新增：校验库存
  const validateStock = async () => {
    try {
      setStockLoading(true);
      
      // 构建需要校验的商品列表
      const itemsToValidate = cartItems.map(item => ({
        itemId: item.id,
        quantity: item.quantity
      }));
      
      // 调用验证库存API
      const response = await validateCartItemStock(itemsToValidate);
      const validationResults = response.data.results || [];
      
      // 更新商品状态
      const updatedItems = cartItems.map(item => {
        const result = validationResults.find((r: any) => r.itemId === item.id);
        if (result) {
          return {
            ...item,
            stock: result.stock,
            status: result.stock <= 0 ? 'soldout' : result.stock < 5 ? 'limited' : 'normal',
            // 如果当前数量超过库存，则自动调整
            quantity: result.stock < item.quantity ? result.stock : item.quantity
          };
        }
        return item;
      });
      
      setCartItems(updatedItems);
      
      // 如果有库存变化，则显示提醒
      const hasStockChanged = validationResults.some((r: any) => {
        const item = cartItems.find(item => item.id === r.itemId);
        return item && (r.stock !== item.stock || (item.quantity > r.stock));
      });
      
      if (hasStockChanged) {
        message.warning('部分商品库存已更新，请检查您的购物车');
      }
    } catch (error) {
      console.error('校验库存失败:', error);
    } finally {
      setStockLoading(false);
    }
  };

  // 购物车表格列配置
  const columns = [
    {
      title: <div className="cart-column-header">
              <Checkbox 
                checked={selectedItems.length === cartItems.filter(item => item.status === 'normal').length && cartItems.length > 0}
                onChange={e => handleSelectAll(e.target.checked)}
              >
                全选
              </Checkbox>
            </div>,
      dataIndex: 'product',
      key: 'product',
      render: (text: string, record: CartItem) => (
        <div className="cart-product-cell">
          <Checkbox 
            checked={selectedItems.includes(record.id)}
            onChange={e => handleSelectItem(record.id, e.target.checked)}
            disabled={record.status !== 'normal'} // 非正常商品不可选择
          />
          <div className="cart-product-image">
            <Link to={`/products/${record.productId}`}>
              <Image 
                src={record.productImage} 
                alt={record.productName} 
                width={100} 
                height={100}
                style={{ 
                  objectFit: 'cover',
                  opacity: record.status !== 'normal' ? 0.5 : 1 // 非正常商品图片半透明
                }}
                preview={false}
              />
              {record.isGift && (
                <Badge 
                  count="赠品" 
                  style={{ backgroundColor: '#52c41a' }}
                  className="gift-badge"
                />
              )}
            </Link>
          </div>
          <div className="cart-product-info">
            <Link to={`/products/${record.productId}`}>
              <Text 
                strong 
                className="cart-product-name"
                style={{ color: record.status !== 'normal' ? '#ccc' : 'inherit' }}
              >
                {record.productName}
              </Text>
            </Link>
            
            {/* 商品状态标签 */}
            {renderItemStatusTag(record)}
            
            {/* 促销信息 */}
            {renderPromotionInfo(record)}
            
            {/* 规格信息 */}
            {record.specifications && Object.keys(record.specifications).length > 0 && (
              <div className="cart-product-specs">
                {Object.entries(record.specifications).map(([key, value]) => (
                  <Tag key={key} color="default" className="spec-tag">
                    {key}: {value}
                  </Tag>
                ))}
              </div>
            )}
            
            {/* 库存提示 */}
            {record.status === 'normal' && record.stock < 10 && (
              <Text type="danger" className="stock-warning">
                仅剩{record.stock}件
              </Text>
            )}
            
            {/* 商家信息 */}
            {record.shopName && (
              <div className="shop-info">
                <ShopOutlined /> {record.shopName}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: <div className="cart-column-header">单价</div>,
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number, record: CartItem) => (
        <div className="cart-price-cell">
          <Text 
            className="current-price"
            style={{ color: record.status !== 'normal' ? '#ccc' : 'inherit' }}
          >
            ¥{calculateItemPrice(record).toFixed(2)}
          </Text>
          {(record.originalPrice || (record.promotion?.type === 'discount')) && (
            <Text delete type="secondary" className="original-price">
              ¥{(record.originalPrice || record.price).toFixed(2)}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: <div className="cart-column-header">数量</div>,
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      render: (quantity: number, record: CartItem) => (
        <div className="cart-quantity-cell">
          <InputNumber
            min={record.minBuy || 1}
            max={record.maxBuy || record.stock}
            value={quantity}
            onChange={value => handleQuantityChange(record.id, value as number)}
            className="quantity-input"
            disabled={record.status !== 'normal'}
            addonBefore={
              <Button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(record.id, quantity - 1)}
                disabled={quantity <= (record.minBuy || 1) || record.status !== 'normal'}
              >
                -
              </Button>
            }
            addonAfter={
              <Button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(record.id, quantity + 1)}
                disabled={quantity >= (record.maxBuy || record.stock) || record.status !== 'normal'}
              >
                +
              </Button>
            }
          />
          
          {/* 购买数量限制提示 */}
          {record.maxBuy && (
            <div className="quantity-limit-tip">
              <InfoCircleOutlined /> 限购{record.maxBuy}件
            </div>
          )}
        </div>
      ),
    },
    {
      title: <div className="cart-column-header">小计</div>,
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 120,
      render: (text: string, record: CartItem) => (
        <div className="cart-subtotal-cell">
          <Text 
            type={record.status === 'normal' ? "danger" : "secondary"} 
            strong 
            className="subtotal-price"
          >
            ¥{calculateItemSubtotal(record).toFixed(2)}
          </Text>
        </div>
      ),
    },
    {
      title: <div className="cart-column-header">操作</div>,
      key: 'action',
      width: 120,
      render: (text: string, record: CartItem) => (
        <div className="cart-action-cell">
          <Space direction="vertical" size="small">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveItem(record.id)}
              className="action-btn"
            >
              删除
            </Button>
            {record.status === 'normal' && (
              <Button
                type="text"
                icon={<HeartOutlined />}
                onClick={() => handleMoveToWishlist(record.id)}
                className="action-btn"
              >
                移入收藏
              </Button>
            )}
          </Space>
        </div>
      ),
    },
  ];

  // 购物车为空时显示的内容
  const renderEmptyCart = () => (
    <div className="empty-cart-container">
      <Empty
        image={<ShoppingCartOutlined className="empty-cart-icon" />}
        description={
          <div className="empty-cart-text">
            <p className="empty-cart-heading">购物车还是空的</p>
            <p className="empty-cart-subheading">快去添加你喜欢的商品吧</p>
          </div>
        }
      >
        <Button type="primary" size="large" icon={<ShoppingOutlined />} className="go-shopping-btn">
          <Link to="/products">去购物</Link>
        </Button>
      </Empty>

      {recommendedProducts.length > 0 && (
        <div className="recommended-products">
          <Title level={4} className="section-title">
            <span className="title-text">为您推荐</span>
          </Title>
          <Divider className="section-divider" />
          <Row gutter={[24, 24]}>
            {recommendedProducts.map(item => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <Card
                  hoverable
                  className="product-card"
                  cover={
                    <div className="product-card-image-container">
                      <Link to={`/products/${item.id}`}>
                        <img 
                          alt={item.name} 
                          src={item.mainImage} 
                          className="product-card-image"
                        />
                      </Link>
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <Link to={`/products/${item.id}`} className="product-card-title">
                        {item.name}
                      </Link>
                    }
                    description={
                      <div className="product-card-info">
                        <Text type="danger" className="product-card-price">¥{item.price}</Text>
                        <div className="product-card-extra">
                          <Text type="secondary" className="product-card-sales">销量: {item.sales}</Text>
                          <Button 
                            type="primary" 
                            size="small" 
                            shape="round"
                            className="add-to-cart-btn"
                          >
                            加入购物车
                          </Button>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="cart-loading">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div>
      {/* 顶部导航栏 */}
      <div className="cart-nav-container">
        <div className="cart-nav-wrapper">
          <div className="cart-nav-left">
            <Link to="/" className="cart-nav-logo">
              <span className="you-text">尤</span><span className="hong-text">洪</span>
              <span className="nav-logo-text">商城</span>
            </Link>
            <div className="cart-nav-breadcrumb">
              <Link to="/">首页</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">购物车</span>
            </div>
          </div>
          <div className="cart-nav-right">
            <div className="cart-nav-search">
              <input type="text" placeholder="搜索商品" className="nav-search-input" />
              <Button type="primary" icon={<SearchOutlined />} className="nav-search-btn">搜索</Button>
            </div>
            <div className="cart-nav-links">
              <Link to="/orders" className="nav-link">
                <ClockCircleOutlined />
                <span>我的订单</span>
              </Link>
              <Link to="/user/wishlist" className="nav-link">
                <HeartOutlined />
                <span>收藏夹</span>
              </Link>
              <Link to="/user/center" className="nav-link">
                <UserOutlined />
                <span>个人中心</span>
              </Link>
              <Link to="/service" className="nav-link">
                <CustomerServiceOutlined />
                <span>客服</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 购物车主体内容 */}
    <div className="cart-container">
      <div className="cart-header">
        <Title level={2} className="cart-title">我的购物车</Title>
        <div className="cart-process">
          <div className="process-step current">
            <div className="step-number">1</div>
              <div className="step-text">购物车</div>
          </div>
            <div className="process-arrow">
              <RightOutlined />
            </div>
          <div className="process-step">
            <div className="step-number">2</div>
              <div className="step-text">确认订单</div>
          </div>
            <div className="process-arrow">
              <RightOutlined />
            </div>
          <div className="process-step">
            <div className="step-number">3</div>
              <div className="step-text">支付</div>
          </div>
            <div className="process-arrow">
              <RightOutlined />
            </div>
          <div className="process-step">
            <div className="step-number">4</div>
              <div className="step-text">完成</div>
          </div>
        </div>
      </div>
      <Divider className="cart-divider" />

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <div className="cart-content">
          <div className="cart-main">
            {/* 批量操作区域 */}
            <div className="batch-actions">
              <Space size="middle">
                <Button 
                  type="text" 
                  onClick={handleInverseSelection}
                  icon={<SyncOutlined />}
                >
                  反选
                </Button>
                <Button 
                  type="text"
                  onClick={() => handleSelectByStatus('normal')}
                  icon={<CheckCircleOutlined />}
                >
                  选择可购买
                </Button>
                <Button 
                  type="text"
                  onClick={handleBatchRemove} 
                  disabled={selectedItems.length === 0}
                  icon={<DeleteOutlined />}
                  danger
                >
                批量删除
                </Button>
                <Popconfirm
                  title="确定要清空购物车吗?"
                  description="此操作将删除所有商品，无法恢复"
                  onConfirm={handleClearCart}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button 
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                  >
                    清空购物车
                  </Button>
                </Popconfirm>
              </Space>
                
                {stockLoading ? (
                  <Button type="link" icon={<SyncOutlined spin />}>
                    正在校验库存...
                  </Button>
                ) : (
                  <Button 
                    type="link" 
                    onClick={validateStock}
                    icon={<SafetyOutlined />}
                  >
                    校验库存
                  </Button>
                )}
            </div>
          
            <Table
              columns={columns}
              dataSource={cartItems}
              rowKey="id"
              pagination={false}
              className="cart-table"
              rowClassName={(record) => record.status !== 'normal' ? 'disabled-row' : ''}
              footer={() => (
                <div className="cart-footer">
                  <div className="cart-footer-left">
                    <Button 
                      className="batch-action-btn" 
                      onClick={handleBatchRemove} 
                      disabled={selectedItems.length === 0}
                      icon={<DeleteOutlined />}
                    >
                    批量删除
                    </Button>
                    <Popconfirm
                      title="确定要清空购物车吗?"
                      description="此操作将删除所有商品，无法恢复"
                      onConfirm={handleClearCart}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button className="batch-action-btn" icon={<DeleteOutlined />}>
                    清空购物车
                      </Button>
                    </Popconfirm>
                    <Button 
                      className="batch-action-btn" 
                      onClick={handleBatchMoveToWishlist}
                      disabled={selectedItems.length === 0}
                      icon={<HeartOutlined />}
                    >
                      移入收藏夹
                    </Button>
                  </div>
                  <div className="cart-footer-right">
                    <div className="cart-summary">
                      <div className="summary-row">
                        <Text>已选择 <Text strong type="danger">{calculateTotalQuantity()}</Text> 件商品</Text>
                      </div>
                      <div className="summary-row">
                        <Text>商品总价：</Text>
                        <Text strong type="danger" className="summary-price">
                            ¥{calculateTotal().toFixed(2)}
                        </Text>
                      </div>
                      
                      {/* 显示满减优惠信息 */}
                      {(() => {
                        const reductionInfo = getOrderReductionInfo();
                          if (reductionInfo.satisfied) {
                          return (
                            <div className="summary-row">
                              <Text>满减优惠：</Text>
                                <Text type="success"><PercentageOutlined /> - ¥{reductionInfo.reduction.toFixed(2)}</Text>
                            </div>
                          );
                          } else if (reductionInfo.difference && reductionInfo.difference > 0) {
                          return (
                            <div className="summary-row">
                                <Text>再买 <Text type="warning">¥{reductionInfo.difference.toFixed(2)}</Text> 可享 <Tag color="orange"><PercentageOutlined /> 满{reductionInfo.threshold}减{reductionInfo.reduction}</Tag></Text>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      
                      {/* 显示单品优惠信息 */}
                      {calculateTotalDiscount() > 0 && (
                        <div className="summary-row">
                          <Text>商品优惠：</Text>
                            <Text type="success"><TagOutlined /> - ¥{calculateTotalDiscount().toFixed(2)}</Text>
                        </div>
                      )}
                      
                      {/* 运费信息 */}
                      <div className="summary-row">
                          <Text><TruckOutlined style={{ marginRight: 5 }} />运费：</Text>
                        <Text>
                            {calculateTotal() >= 99 ? <Tag color="green">免运费</Tag> : '+¥10.00'}
                          <Tooltip title="订单满99元免运费">
                            <QuestionCircleOutlined style={{ marginLeft: 5 }} />
                          </Tooltip>
                        </Text>
                      </div>
                      
                      <Divider className="summary-divider" />
                      <div className="summary-row total-row">
                        <Text>实付款：</Text>
                        <Text className="total-price">
                            ¥{(calculateFinalPrice()).toFixed(2)}
                        </Text>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      className="checkout-button"
                      onClick={handleCheckout}
                      disabled={selectedItems.length === 0}
                        icon={<CreditCardOutlined />}
                    >
                      去结算({calculateTotalQuantity()})
                    </Button>
                  </div>
                </div>
              )}
            />
          </div>

          {/* 推荐商品 */}
          {recommendedProducts.length > 0 && (
            <div className="recommended-products">
              <Title level={4} className="section-title">
                <span className="title-icon">🔥</span>
                <span className="title-text">猜你喜欢</span>
              </Title>
              <Divider className="section-divider" />
              <Row gutter={[24, 24]}>
                {recommendedProducts.map(item => (
                  <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                    <Card
                      hoverable
                      className="product-card"
                      cover={
                        <div className="product-card-image-container">
                          <Link to={`/products/${item.id}`}>
                            <img 
                              alt={item.name} 
                              src={item.mainImage} 
                              className="product-card-image"
                            />
                          </Link>
                            {item.discount && (
                              <div className="product-discount-tag">
                                {item.discount}折
                              </div>
                            )}
                        </div>
                      }
                    >
                      <Card.Meta
                        title={
                          <Link to={`/products/${item.id}`} className="product-card-title">
                            {item.name}
                          </Link>
                        }
                        description={
                          <div className="product-card-info">
                            <Text type="danger" className="product-card-price">¥{item.price}</Text>
                              {item.originalPrice && (
                                <Text delete type="secondary" className="product-card-original">
                                  ¥{item.originalPrice}
                                </Text>
                              )}
                            <div className="product-card-extra">
                                <Text type="secondary" className="product-card-sales">
                                  <FireOutlined style={{ marginRight: 5 }} />
                                  已售: {item.sales}
                                </Text>
                              <Button 
                                type="primary" 
                                size="small" 
                                shape="round"
                                className="add-to-cart-btn"
                                  icon={<ShoppingCartOutlined />}
                              >
                                加入购物车
                              </Button>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

            {/* 服务承诺 */}
            <div className="service-promises">
              <Row gutter={16}>
                <Col xs={24} sm={6}>
                  <div className="service-item">
                    <SafetyOutlined className="service-icon" />
                    <div className="service-text">
                      <div className="service-title">正品保障</div>
                      <div className="service-desc">品质保证 放心选购</div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div className="service-item">
                    <TruckOutlined className="service-icon" />
                    <div className="service-text">
                      <div className="service-title">极速配送</div>
                      <div className="service-desc">多仓直发 极速配送</div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div className="service-item">
                    <RocketOutlined className="service-icon" />
                    <div className="service-text">
                      <div className="service-title">无忧退换</div>
                      <div className="service-desc">7天无理由 安心购物</div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div className="service-item">
                    <CustomerServiceOutlined className="service-icon" />
                    <div className="service-text">
                      <div className="service-title">贴心服务</div>
                      <div className="service-desc">专业客服 全程跟进</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Cart; 