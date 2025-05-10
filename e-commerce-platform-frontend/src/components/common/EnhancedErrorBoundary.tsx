import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Result } from 'antd';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // 更新 state 使下一次渲染显示错误 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    console.error(`EnhancedErrorBoundary caught an error in ${this.props.componentName || 'unknown component'}:`, error, errorInfo);
    this.setState({ errorInfo });
    
    // 可以在这里添加错误上报逻辑
    // this.reportError(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  // 错误上报方法
  reportError(error: Error, errorInfo: ErrorInfo) {
    // 实现错误上报逻辑，例如发送到日志服务器
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      componentName: this.props.componentName,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    console.log('Would report error:', errorData);
    
    // 实际上报代码，例如：
    // fetch('/api/error-reporting', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData)
    // });
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，则使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // 默认错误 UI
      return (
        <Result
          status="error"
          title="页面出现错误"
          subTitle={this.state.error?.message || "抱歉，组件渲染时发生错误"}
          extra={[
            <Button key="refresh" type="primary" onClick={() => window.location.reload()}>
              刷新页面
            </Button>,
            <Button key="retry" onClick={this.resetError}>
              重试
            </Button>,
            <Button key="home" onClick={() => window.location.href = '/'}>
              返回首页
            </Button>
          ]}
        >
          {process.env.NODE_ENV !== 'production' && this.state.errorInfo && (
            <div className="error-details">
              <details style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>
                <summary>错误详情</summary>
                <p>{this.state.error && this.state.error.toString()}</p>
                <p>组件调用栈:</p>
                <p>{this.state.errorInfo.componentStack}</p>
              </details>
            </div>
          )}
        </Result>
      );
    }

    return this.props.children;
  }
} 