import React from 'react';
import { Button, Popconfirm, Space, Badge, Tooltip } from 'antd';
import { 
  DeleteOutlined, 
  HeartOutlined, 
  CheckSquareOutlined,
  SwapOutlined,
  SortAscendingOutlined
} from '@ant-design/icons';
import './CartBatchToolbar.css';

interface CartBatchToolbarProps {
  selectedCount: number;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onSelectAll: (checked: boolean) => void;
  onInverseSelection: () => void;
  onSelectByStatus: (status: 'normal' | 'all') => void;
  onBatchDelete: () => void;
  onBatchMoveToWishlist: () => void;
}

const CartBatchToolbar: React.FC<CartBatchToolbarProps> = ({
  selectedCount,
  isAllSelected,
  isIndeterminate,
  onSelectAll,
  onInverseSelection,
  onSelectByStatus,
  onBatchDelete,
  onBatchMoveToWishlist
}) => {
  return (
    <div className="cart-batch-toolbar">
      <div className="cart-batch-toolbar-left">
        <Space>
          <Tooltip title={isAllSelected ? "取消全选" : "全选"}>
            <Button 
              type="text" 
              icon={<CheckSquareOutlined 
                className={isAllSelected || isIndeterminate ? 'selected' : ''}
              />} 
              onClick={() => onSelectAll(!isAllSelected)}
            >
              {isAllSelected ? "取消全选" : "全选"}
            </Button>
          </Tooltip>
          
          <Tooltip title="反选">
            <Button 
              type="text" 
              icon={<SwapOutlined />} 
              onClick={onInverseSelection}
            >
              反选
            </Button>
          </Tooltip>
          
          <Tooltip title="仅选择可购买商品">
            <Button 
              type="text" 
              icon={<SortAscendingOutlined />} 
              onClick={() => onSelectByStatus('normal')}
            >
              仅选择可购买
            </Button>
          </Tooltip>
        </Space>
      </div>
      
      <div className="cart-batch-toolbar-right">
        <Space>
          {selectedCount > 0 && (
            <>
              <Tooltip title="移入收藏夹">
                <Button 
                  type="text" 
                  icon={<HeartOutlined />} 
                  onClick={onBatchMoveToWishlist}
                >
                  移入收藏夹
                  <Badge count={selectedCount} size="small" offset={[5, -5]} />
                </Button>
              </Tooltip>
              
              <Popconfirm
                title="确定要删除选中的商品吗？"
                onConfirm={onBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                >
                  删除
                  <Badge count={selectedCount} size="small" offset={[5, -5]} />
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      </div>
    </div>
  );
};

export default CartBatchToolbar; 