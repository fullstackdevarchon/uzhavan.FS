import React from 'react';

const PageContainer = ({ children }) => {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('/assets/IMG-20251013-WA0000.jpg')`,
        minHeight: '100vh',
        width: '100%',
        position: 'fixed',
        top: 60, // Assuming 60px for the navbar height
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto'
      }}
    >
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;