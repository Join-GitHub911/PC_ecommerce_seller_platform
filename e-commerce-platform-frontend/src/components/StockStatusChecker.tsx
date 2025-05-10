import React from 'react';
import { Tag, Tooltip } from 'antd';
import { 
  ExclamationCircleOutlined, 
  CloseCircleOutlined, 
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import './StockStatusChecker.css';

interface StockStatusCheckerProps {
  stock: number;
  quantity: number;
  status: 'normal' | 'soldout' | 'removed' | 'limited';
}

const StockStatusChecker: React.FC<StockStatusCheckerProps> = ({
  stock,
  quantity,
  status
}) => {
  // 根据状态和库存数量返回不同的组件
  const getStatusComponent = () => {
    if (status === 'removed') {
      return (
        <Tag color="error" className="stock-status stock-status-removed">
          <CloseCircleOutlined /> 商品已下架
        </Tag>
      );
    }
    
    if (status === 'soldout') {
      return (
        <Tag color="default" className="stock-status stock-status-soldout">
          <CloseCircleOutlined /> 商品已售罄
        </Tag>
      );
    }
    
    if (status === 'limited') {
      return (
        <Tooltip title={`库存紧张，仅剩 ${stock} 件`}>
          <Tag color="warning" className="stock-status stock-status-limited">
            <WarningOutlined /> 库存紧张
          </Tag>
        </Tooltip>
      );
    }
    
    if (stock < quantity) {
      return (
        <Tooltip title={`库存不足，当前库存 ${stock} 件，已自动调整数量`}>
          <Tag color="warning" className="stock-status stock-status-insufficient">
            <ExclamationCircleOutlined /> 库存不足
          </Tag>
        </Tooltip>
      );
    }
    
    return (
      <Tooltip title="库存充足">
        <Tag color="success" className="stock-status stock-status-sufficient">
          <CheckCircleOutlined /> 库存充足
        </Tag>
      </Tooltip>
    );
  };

  return (
    <div className="stock-status-container">
      {getStatusComponent()}
    </div>
  );
};

export default StockStatusChecker; 