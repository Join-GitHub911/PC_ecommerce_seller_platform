import React, { useState, useEffect } from 'react';
import { Modal, Button, InputNumber } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './ProductSpecModal.css';

interface ProductSpecModalProps {
  visible: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number, specs: Record<string, string>) => Promise<void>;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    mainImage: string;
    stock: number;
  };
  specOptions: Record<string, string[]>;
  selectedSpecs: Record<string, string>;
  onSpecChange: (specType: string, value: string) => void;
  initialQuantity: number;
}

const ProductSpecModal: React.FC<ProductSpecModalProps> = ({
  visible,
  onClose,
  onAddToCart,
  product,
  specOptions,
  selectedSpecs,
  onSpecChange,
  initialQuantity = 1
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  // 重置数量
  useEffect(() => {
    if (visible) {
      setQuantity(initialQuantity);
    }
  }, [visible, initialQuantity]);
  
  // 处理确认添加
  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      await onAddToCart(quantity, selectedSpecs);
      onClose();
    } catch (error) {
      console.error('添加到购物车失败:', error);
    } finally {
      setConfirmLoading(false);
    }
  };
  
  // 渲染已选规格文本
  const renderSelectedSpecsText = () => {
    const selected = Object.entries(selectedSpecs)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`);
    
    if (selected.length === 0) {
      return '请选择规格';
    }
    
    return selected.join('，');
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={onClose}
      width={520}
      className="spec-modal"
      title={null}
      closable={true}
      destroyOnClose={true}
    >
      <div className="spec-modal-header">
        <div className="spec-modal-product-image">
          <img src={product.mainImage} alt={product.name} />
        </div>
        <div className="spec-modal-product-info">
          <div className="spec-modal-product-price">
            ¥{product.price}
            {product.originalPrice && (
              <span className="spec-modal-original-price">¥{product.originalPrice}</span>
            )}
          </div>
          <div className="spec-modal-product-name">{product.name}</div>
          <div className="spec-modal-selected">
            已选：{renderSelectedSpecsText()}
          </div>
        </div>
      </div>
      
      <div className="spec-modal-body">
        {Object.entries(specOptions).map(([specType, options]) => (
          <div key={specType} className="spec-modal-section">
            <div className="spec-modal-section-title">{specType}</div>
            <div className="spec-modal-options">
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`spec-modal-option ${selectedSpecs[specType] === option ? 'selected' : ''}`}
                  onClick={() => onSpecChange(specType, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="spec-modal-section">
          <div className="spec-modal-section-title">数量</div>
          <div className="spec-modal-quantity">
            <InputNumber
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
            />
            <span className="spec-modal-stock">库存 {product.stock} 件</span>
          </div>
        </div>
      </div>
      
      <div className="spec-modal-footer">
        <Button
          type="primary"
          size="large"
          icon={<ShoppingCartOutlined />}
          onClick={handleConfirm}
          loading={confirmLoading}
          className="spec-modal-confirm-btn"
        >
          确定
        </Button>
      </div>
    </Modal>
  );
};

export default ProductSpecModal; 