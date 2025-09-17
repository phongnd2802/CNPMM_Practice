import { useContext, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Button } from "antd";
import { AuthContext } from "../context/auth.context.jsx";

export default function Header() {
  const { auth, setAuth } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const current = useMemo(() => {
    if (location.pathname.startsWith("/products")) return "products";
    if (location.pathname.startsWith("/search")) return "search";
    if (location.pathname.startsWith("/user")) return "user";
    return "home";
  }, [location.pathname]);

  const onLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
    navigate("/");
  };

  return (
    <div style={{ borderBottom: "1px solid #eee", marginBottom: 12 }}>
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", gap: 16 }}
      >
        <Menu mode="horizontal" selectedKeys={[current]} style={{ flex: 1 }}>
          <Menu.Item key="home">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="products">
            <Link to="/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="search">
            <Link to="/search">Search</Link>
          </Menu.Item>
          <Menu.Item key="user">
            <Link to="/user">Users</Link>
          </Menu.Item>
        </Menu>
        {auth?.isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span>👋 {auth?.user?.name || auth?.user?.email}</span>
            <Button onClick={onLogout}>Logout</Button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
}
