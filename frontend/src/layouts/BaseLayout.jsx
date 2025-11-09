// src/layouts/BaseLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components";

const BaseLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;