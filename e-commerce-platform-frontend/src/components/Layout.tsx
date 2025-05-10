import React from 'react';
import { Layout as AntLayout } from 'antd';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Content>
        <div className="content-wrapper" style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          padding: '20px',
          width: '100%',
          minHeight: 'calc(100vh - 64px)'
        }}>
          {children}
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout; 