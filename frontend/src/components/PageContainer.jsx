import React from "react";

const PageContainer = ({ children }) => {
  return (
    <div
      className="fixed inset-0 overflow-y-auto bg-cover bg-center bg-no-repeat bg-fixed font-poppins"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
          url('/assets/IMG-20251013-WA0000.jpg')
        `,
        top: "60px", // height of your navbar
      }}
    >
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 py-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;
