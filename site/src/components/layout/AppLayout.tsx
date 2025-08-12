import { Layout, Menu, Typography, Space, Switch, Button, Drawer } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleTheme } from "../../store/uiSlice";

const { Header, Content, Footer } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const [open, setOpen] = useState(false);

  const selectedKeys = useMemo(() => {
    if (location.pathname.startsWith("/json")) return ["json"];
    if (location.pathname.startsWith("/url")) return ["url"];
    if (location.pathname.startsWith("/base64")) return ["base64"];
    if (location.pathname.startsWith("/qr")) return ["qr"];
    if (location.pathname.startsWith("/hash")) return ["hash"];
    return ["home"];
  }, [location.pathname]);

  const items = [
    { key: "home", label: <Link to="/">首页</Link> },
    { key: "json", label: <Link to="/json">JSON格式化</Link> },
    { key: "url", label: <Link to="/url">URL编解码</Link> },
    { key: "base64", label: <Link to="/base64">Base64</Link> },
    { key: "qr", label: <Link to="/qr">二维码</Link> },
    { key: "hash", label: <Link to="/hash">Hash</Link> },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ position: "sticky", top: 0, zIndex: 100, width: "100%" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Space size="large" style={{ alignItems: "center" }}>
            <Typography.Title level={4} style={{ margin: 0, color: "white" }}>
              实用工具集合
            </Typography.Title>
            <div className="hide-on-mobile" style={{ maxWidth: '70vw', overflowX: 'auto' }}>
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={selectedKeys}
                items={items}
              />
            </div>
          </Space>
          <Space>
            <span style={{ color: "white" }}>暗色</span>
            <Switch
              checked={theme === "dark"}
              onChange={() => dispatch(toggleTheme())}
            />
            <Button onClick={() => setOpen(true)}>全部工具</Button>
          </Space>
        </div>
      </Header>
      <Drawer
        title="全部工具"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={items}
          onClick={() => setOpen(false)}
        />
      </Drawer>
      <Content
        style={{
          padding: "24px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          minHeight: "calc(100vh - 134px)", // 减去header和footer的高度
        }}
      >
        {children}
      </Content>
      <Footer style={{ textAlign: "center" }}>
        隐私优先 · 全本地处理 · PWA
      </Footer>
    </Layout>
  );
}
