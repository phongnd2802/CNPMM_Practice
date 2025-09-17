import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "antd/dist/reset.css";
import "./styles/global.css";

import App from "./App.jsx";
import { AuthWrapper } from "./components/context/auth.context.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import UserPage from "./pages/User.jsx";
import ProductsPage from "./pages/Products.jsx";
import SearchPage from "./pages/Search.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword.jsx";
import ResetPasswordPage from "./pages/ResetPassword.jsx";
import NotFoundPage from "./pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
      },
      { path: "products", element: <ProductsPage /> },
      { path: "search", element: <SearchPage /> },
    ],
  },
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },
  { path: "reset-password", element: <ResetPasswordPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </StrictMode>
);
