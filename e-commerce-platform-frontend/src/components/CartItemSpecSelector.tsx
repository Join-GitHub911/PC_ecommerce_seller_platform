import React, { useState } from 'react';
import { Modal, Button, Row, Col, Tag, message } from 'antd';
import { TagsOutlined } from '@ant-design/icons';
import './CartItemSpecSelector.css';

interface CartItemSpecSelectorProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (specs: Record<string, string>) => Promise<void>;
  itemId: string;
  productName: string;
  productImage: string;
  currentSpecs: Record<string, string>;
  availableSpecs: Record<string, string[]>;
  price: number;
  stock: number;
}

const CartItemSpecSelector: React.FC<CartItemSpecSelectorProps> = ({
  visible,
  onClose,
  onConfirm,
  itemId,
  productName,
  productImage,
  currentSpecs,
  availableSpecs,
  price,
  stock
}) => {
  // 使用当前规格作为初始状态
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>(currentSpecs);
  const [loading, setLoading] = useState(false);
  
  // 处理规格选择
  const handleSpecChange = (specType: string, value: string) => {
    setSelectedSpecs({
      ...selectedSpecs,
      [specType]: value
    });
  };
  
  // 检查是否所有必选规格都已选择
  const isAllSpecsSelected = () => {
    return Object.keys(availableSpecs).every(specType => selectedSpecs[specType]);
  };
  
  // 处理确认更改
  const handleSubmit = async () => {
    if (!isAllSpecsSelected()) {
      message.warning('请选择所有规格');
      return;
    }
    
    setLoading(true);
    try {
      await onConfirm(selectedSpecs);
      message.success('规格修改成功');
      onClose();
    } catch (error) {
      console.error('修改规格失败:', error);
      message.error('修改规格失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 比较两个规格对象是否相同
  const areSpecsEqual = (specs1: Record<string, string>, specs2: Record<string, string>) => {
    const keys1 = Object.keys(specs1);
    const keys2 = Object.keys(specs2);
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => specs1[key] === specs2[key]);
  };
  
  // 检查规格是否有变化
  const hasSpecsChanged = () => {
    return !areSpecsEqual(currentSpecs, selectedSpecs);
  };

  return (
    <Modal
      open={visible}
      title="修改商品规格"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          disabled={!hasSpecsChanged() || !isAllSpecsSelected()}
          onClick={handleSubmit}
        >
          确认修改
        </Button>
      ]}
      width={520}
    >
      <div className="spec-selector-container">
        <Row className="spec-selector-header" gutter={16}>
          <Col span={6}>
            <img 
              src={productImage} 
              alt={productName} 
              className="spec-selector-image" 
            />
          </Col>
          <Col span={18}>
            <h4 className="spec-selector-product-name">{productName}</h4>
            <div className="spec-selector-price">¥{price.toFixed(2)}</div>
            <div className="spec-selector-stock">库存: {stock}件</div>
          </Col>
        </Row>
        
        <div className="spec-selector-specs">
          <h4 className="spec-selector-current">
            <TagsOutlined /> 当前已选:
          </h4>
          <div className="spec-selector-current-specs">
            {Object.entries(currentSpecs).map(([type, value]) => (
              <Tag key={type} color="blue">
                {type}: {value}
              </Tag>
            ))}
          </div>
          
          <div className="spec-selector-options">
            {Object.entries(availableSpecs).map(([specType, options]) => (
              <div key={specType} className="spec-selector-option-group">
                <div className="spec-selector-option-title">{specType}:</div>
                <div className="spec-selector-option-items">
                  {options.map((option) => (
                    <Tag
                      key={option}
                      color={selectedSpecs[specType] === option ? 'green' : 'default'}
                      className="spec-selector-option-item"
                      onClick={() => handleSpecChange(specType, option)}
                    >
                      {option}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CartItemSpecSelector; 