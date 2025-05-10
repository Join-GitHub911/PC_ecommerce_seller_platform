import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 'calc(100vh - 64px - 288px)'
    }}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={[
          <Button type="primary" key="home">
            <Link to="/">返回首页</Link>
          </Button>,
          <Button key="products">
            <Link to="/products">浏览商品</Link>
          </Button>
        ]}
      />
    </div>
  );
};

export default NotFound; 