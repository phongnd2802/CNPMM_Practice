import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Spin } from "antd";
import Header from "./components/layout/header.jsx";
import axios from "./util/axios.customize.js";
import { AuthContext } from "./components/context/auth.context.jsx";

export default function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setAppLoading(true);
      try {
        const res = await axios.get(`/v1/api/account`);
        if (mounted && res && res.email) {
          setAuth({ isAuthenticated: true, user: { email: res.email, name: res.name } });
        } else if (mounted) {
          setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
        }
      } catch {
        if (mounted) setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
      } finally {
        if (mounted) setAppLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [setAuth, setAppLoading]);

  if (appLoading) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin />
      </div>
    );
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
