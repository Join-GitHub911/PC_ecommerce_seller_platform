import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

interface VirtualListProps<T> {
  data: T[];
  itemHeight: number;
  windowHeight: number | string;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  loadingMore?: boolean;
  estimatedItemSize?: number;
  itemKey?: (item: T, index: number) => string | number;
  className?: string;
  style?: React.CSSProperties;
  scrollToIndex?: number;
}

const ListContainer = styled.div`
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  will-change: transform;
`;

const ListInner = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  position: relative;
`;

const ListItem = styled.div<{ top: number, height: number }>`
  position: absolute;
  top: ${props => props.top}px;
  height: ${props => props.height}px;
  width: 100%;
`;

const LoadingIndicator = styled.div`
  padding: 16px 0;
  text-align: center;
`;

export function VirtualList<T>({
  data,
  itemHeight,
  windowHeight,
  renderItem,
  overscan = 3,
  onEndReached,
  endReachedThreshold = 0.8,
  loadingMore = false,
  estimatedItemSize,
  itemKey,
  className,
  style,
  scrollToIndex,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  // 获取容器高度
  const height = typeof windowHeight === 'number' ? windowHeight : '100%';
  
  // 计算总高度
  const totalHeight = useMemo(() => {
    if (estimatedItemSize && data.length > 0) {
      return data.length * estimatedItemSize;
    }
    return data.length * itemHeight;
  }, [data.length, itemHeight, estimatedItemSize]);
  
  // 计算可见区域的起始和结束索引
  const { startIndex, endIndex } = useMemo(() => {
    const scrollTopValue = Math.max(0, scrollTop);
    const visibleStartIndex = Math.floor(scrollTopValue / itemHeight);
    const visibleEndIndex = Math.min(
      data.length - 1,
      Math.floor((scrollTopValue + (typeof windowHeight === 'number' ? windowHeight : 0)) / itemHeight)
    );
    
    return {
      startIndex: Math.max(0, visibleStartIndex - overscan),
      endIndex: Math.min(data.length - 1, visibleEndIndex + overscan)
    };
  }, [scrollTop, windowHeight, itemHeight, data.length, overscan]);
  
  // 获取可见范围内的数据
  const visibleData = useMemo(() => {
    return data.slice(startIndex, endIndex + 1);
  }, [data, startIndex, endIndex]);
  
  // 滚动事件处理
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setScrollTop(scrollTop);
      
      // 触发底部加载
      if (onEndReached && 
          !loadingMore && 
          scrollTop + clientHeight >= scrollHeight * endReachedThreshold) {
        onEndReached();
      }
    }
  };
  
  // 滚动到指定位置
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current) {
      containerRef.current.scrollTop = scrollToIndex * itemHeight;
    }
  }, [scrollToIndex, itemHeight]);
  
  return (
    <ListContainer 
      ref={containerRef} 
      className={className}
      style={{ height, ...style }}
      onScroll={handleScroll}
    >
      <ListInner height={totalHeight}>
        {visibleData.map((item, index) => {
          const actualIndex = startIndex + index;
          const key = itemKey ? itemKey(item, actualIndex) : actualIndex;
          
          return (
            <ListItem 
              key={key} 
              top={actualIndex * itemHeight}
              height={itemHeight}
            >
              {renderItem(item, actualIndex)}
            </ListItem>
          );
        })}
        
        {loadingMore && (
          <LoadingIndicator style={{ top: totalHeight }}>
            <Spin size="small" /> 加载更多...
          </LoadingIndicator>
        )}
      </ListInner>
    </ListContainer>
  );
} 