import React from 'react';
import { Spin, Progress, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

interface SmartLoaderProps {
  spinning: boolean;
  message?: string;
  progress?: number;
  size?: 'small' | 'default' | 'large';
  fullScreen?: boolean;
  transparent?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const LoaderContainer = styled.div<{ fullScreen?: boolean, transparent?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${props => props.fullScreen ? `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background-color: ${props.transparent ? 'rgba(255,255,255,0.7)' : 'white'};
  ` : 'position: relative;'}
  min-height: 80px;
  padding: ${props => props.fullScreen ? '0' : '20px'};
`;

const SpinnerWrapper = styled.div`
  z-index: 10;
`;

const MessageText = styled(Text)`
  margin-top: 12px;
  margin-bottom: 8px;
  z-index: 10;
`;

const ProgressContainer = styled.div`
  width: 80%;
  max-width: 300px;
  z-index: 10;
`;

const ChildrenWrapper = styled.div<{ spinning: boolean }>`
  opacity: ${props => props.spinning ? 0.5 : 1};
  transition: opacity 0.3s;
  width: 100%;
  height: 100%;
`;

export const SmartLoader: React.FC<SmartLoaderProps> = ({
  spinning,
  message,
  progress,
  size = 'default',
  fullScreen = false,
  transparent = true,
  className,
  children,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 40 : (size === 'small' ? 16 : 24) }} spin />;

  // 如果有子元素，创建包装容器
  if (children) {
    return (
      <div className={className} style={{ position: 'relative' }}>
        <ChildrenWrapper spinning={spinning}>
          {children}
        </ChildrenWrapper>
        
        {spinning && (
          <LoaderContainer fullScreen={fullScreen} transparent={transparent}>
            <SpinnerWrapper>
              <Spin indicator={antIcon} size={size} />
            </SpinnerWrapper>
            {message && <MessageText>{message}</MessageText>}
            {typeof progress === 'number' && (
              <ProgressContainer>
                <Progress percent={progress} status="active" />
              </ProgressContainer>
            )}
          </LoaderContainer>
        )}
      </div>
    );
  }

  // 如果没有子元素，只显示加载状态
  if (!spinning) return null;
  
  return (
    <LoaderContainer fullScreen={fullScreen} transparent={transparent} className={className}>
      <SpinnerWrapper>
        <Spin indicator={antIcon} size={size} />
      </SpinnerWrapper>
      {message && <MessageText>{message}</MessageText>}
      {typeof progress === 'number' && (
        <ProgressContainer>
          <Progress percent={progress} status="active" />
        </ProgressContainer>
      )}
    </LoaderContainer>
  );
}; 