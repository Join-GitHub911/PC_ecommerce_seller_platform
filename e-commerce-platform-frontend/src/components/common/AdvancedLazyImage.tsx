import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Skeleton } from 'antd';

interface AdvancedLazyImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  placeholder?: string;
  blurEffect?: boolean;
  threshold?: number;
  loadingRatio?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const ImageContainer = styled.div<{ width?: string | number, height?: string | number, ratio?: number }>`
  position: relative;
  width: ${props => typeof props.width === 'number' ? `${props.width}px` : props.width || '100%'};
  height: ${props => typeof props.height === 'number' ? `${props.height}px` : props.height || 'auto'};
  ${props => props.ratio ? `
    aspect-ratio: ${props.ratio};
  ` : ''}
  overflow: hidden;
`;

const StyledImg = styled.img<{ isLoaded: boolean, blurEffect: boolean, objectFit?: string }>`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.objectFit || 'cover'};
  transition: opacity 0.3s, filter 0.5s;
  opacity: ${props => props.isLoaded ? 1 : 0};
  ${props => props.blurEffect ? `
    filter: blur(${props.isLoaded ? 0 : 20}px);
  ` : ''}
`;

const PlaceholderImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px);
  transition: opacity 0.3s;
`;

export const AdvancedLazyImage: React.FC<AdvancedLazyImageProps> = ({
  src,
  alt,
  width,
  height,
  placeholder,
  blurEffect = true,
  threshold = 0.1,
  loadingRatio,
  onLoad,
  onError,
  className,
  style,
  objectFit = 'cover',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (onError) onError(new Error('Image failed to load'));
    console.error('Image failed to load:', src);
  };

  return (
    <ImageContainer 
      ref={containerRef} 
      width={width} 
      height={height} 
      ratio={loadingRatio} 
      className={className}
      style={style}
    >
      {!isLoaded && !placeholder && (
        <Skeleton.Image 
          active 
          style={{ 
            width: '100%', 
            height: '100%' 
          }} 
        />
      )}
      
      {placeholder && !isLoaded && (
        <PlaceholderImg src={placeholder} alt={`${alt} placeholder`} />
      )}
      
      {isVisible && (
        <StyledImg
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          isLoaded={isLoaded}
          blurEffect={blurEffect}
          objectFit={objectFit}
        />
      )}
    </ImageContainer>
  );
}; 