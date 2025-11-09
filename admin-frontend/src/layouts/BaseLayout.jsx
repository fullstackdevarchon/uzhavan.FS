import React from 'react';

const BaseLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default BaseLayout;