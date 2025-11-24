// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./redux/store";
import App from "./App";
import "./index.css";

// ⭐ Your Google OAuth Client ID
const GOOGLE_CLIENT_ID = "913849584754-g8v9huh37a6rojrq9bqupnja4pnkvp77.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ⭐ Google OAuth Provider must wrap the entire app */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* ⭐ Redux Provider */}
      <Provider store={store}>
        {/* ⭐ React Router */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
