import React from 'react';
import { Outlet } from 'react-router-dom';

const BlankLayout: React.FC = () => {
  return (
    <div className="blank-layout">
      <Outlet />
    </div>
  );
};

export default BlankLayout;
