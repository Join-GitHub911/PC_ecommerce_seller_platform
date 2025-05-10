import { useState, useEffect, useMemo } from 'react';

export interface ResponsiveConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export const defaultBreakpoints: ResponsiveConfig = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

export type BreakpointType = keyof ResponsiveConfig;

export interface UseResponsiveOptions {
  breakpoints?: Partial<ResponsiveConfig>;
}

export function useResponsive(options?: UseResponsiveOptions) {
  const breakpoints = useMemo(() => {
    return {
      ...defaultBreakpoints,
      ...(options?.breakpoints || {}),
    };
  }, [options]);
  
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // 添加事件监听器
    window.addEventListener('resize', handleResize);
    
    // 确保初始化时设置正确的值
    handleResize();
    
    // 清除事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const screens = useMemo(() => {
    return {
      xs: windowWidth >= breakpoints.xs,
      sm: windowWidth >= breakpoints.sm,
      md: windowWidth >= breakpoints.md,
      lg: windowWidth >= breakpoints.lg,
      xl: windowWidth >= breakpoints.xl,
      xxl: windowWidth >= breakpoints.xxl,
    };
  }, [windowWidth, breakpoints]);
  
  const screenSize = useMemo<BreakpointType>(() => {
    if (windowWidth >= breakpoints.xxl) return 'xxl';
    if (windowWidth >= breakpoints.xl) return 'xl';
    if (windowWidth >= breakpoints.lg) return 'lg';
    if (windowWidth >= breakpoints.md) return 'md';
    if (windowWidth >= breakpoints.sm) return 'sm';
    return 'xs';
  }, [windowWidth, breakpoints]);

  const isMobile = useMemo(() => {
    return windowWidth < breakpoints.md;
  }, [windowWidth, breakpoints]);
  
  const isTablet = useMemo(() => {
    return windowWidth >= breakpoints.md && windowWidth < breakpoints.lg;
  }, [windowWidth, breakpoints]);
  
  const isDesktop = useMemo(() => {
    return windowWidth >= breakpoints.lg;
  }, [windowWidth, breakpoints]);
  
  return {
    windowWidth,
    screens,
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints,
  };
} 