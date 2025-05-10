import React, { ReactNode, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

type TransitionType = 'fade' | 'slide' | 'scale' | 'flip' | 'rotate';
type DirectionType = 'left' | 'right' | 'up' | 'down';

interface EnhancedPageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  direction?: DirectionType;
  duration?: number;
  delay?: number;
  className?: string;
  isActive?: boolean;
}

const getTransitionStyles = (type: TransitionType, direction: DirectionType, duration: number, delay: number) => {
  let transform = '';
  
  switch (type) {
    case 'slide':
      switch (direction) {
        case 'left':
          transform = 'translateX(30px)';
          break;
        case 'right':
          transform = 'translateX(-30px)';
          break;
        case 'up':
          transform = 'translateY(30px)';
          break;
        case 'down':
          transform = 'translateY(-30px)';
          break;
      }
      break;
      
    case 'scale':
      transform = 'scale(0.9)';
      break;
      
    case 'flip':
      transform = 'rotateY(90deg)';
      break;
      
    case 'rotate':
      transform = 'rotate(-5deg)';
      break;
  }
  
  return `
    .transition-${type}-${direction}-enter {
      opacity: 0;
      ${transform ? `transform: ${transform};` : ''}
    }
    
    .transition-${type}-${direction}-enter-active {
      opacity: 1;
      ${transform ? 'transform: translateX(0) translateY(0) scale(1) rotate(0) rotateY(0);' : ''}
      transition: opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms;
    }
    
    .transition-${type}-${direction}-exit {
      opacity: 1;
      ${transform ? 'transform: translateX(0) translateY(0) scale(1) rotate(0) rotateY(0);' : ''}
    }
    
    .transition-${type}-${direction}-exit-active {
      opacity: 0;
      ${transform ? `transform: ${transform};` : ''}
      transition: opacity ${duration}ms ease-in, transform ${duration}ms ease-in;
    }
  `;
};

const TransitionContainer = styled.div<{
  type: TransitionType;
  direction: DirectionType;
  duration: number;
  delay: number;
}>`
  width: 100%;
  height: 100%;
  
  ${props => getTransitionStyles(props.type, props.direction, props.duration, props.delay)}
`;

export const EnhancedPageTransition: React.FC<EnhancedPageTransitionProps> = ({
  children,
  type = 'fade',
  direction = 'left',
  duration = 300,
  delay = 0,
  className,
  isActive = true,
}) => {
  const [key, setKey] = useState(0);
  
  // 当内容变化时强制重新渲染动画
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [children]);
  
  return (
    <TransitionContainer
      type={type}
      direction={direction}
      duration={duration}
      delay={delay}
      className={className}
    >
      <CSSTransition
        key={key}
        in={isActive}
        timeout={duration + delay}
        classNames={`transition-${type}-${direction}`}
        unmountOnExit
      >
        <div>{children}</div>
      </CSSTransition>
    </TransitionContainer>
  );
}; 