// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // ✅ React Router for client-side routing
import store from "./redux/store"; // ✅ Redux store
import App from "./App";
import "./index.css"; // Tailwind or global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Provide Redux store to the app */}
    <Provider store={store}>
      {/* Wrap the entire app with BrowserRouter for routing */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
