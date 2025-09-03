import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const EmailVerify = lazy(() => import("./pages/EmailVerify"));
const ResetPass = lazy(() => import("./pages/ResetPass"));
const TodoList = lazy(() => import("./pages/TodoList"));

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPass />} />
          <Route path="/todo" element={<TodoList />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
