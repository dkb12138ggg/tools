import { Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Typography.Title level={2}>简洁在线工具集合</Typography.Title>
      <Typography.Paragraph type="secondary">
        所有处理均在本地浏览器完成，隐私优先，无需登录。
      </Typography.Paragraph>
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={12} lg={8}>
          <Link to="/json" style={{ textDecoration: "none" }}>
            <Card
              title="JSON 格式化/校验"
              hoverable
              style={{ height: "100%", minHeight: "120px" }}
              bodyStyle={{ padding: "16px" }}
            >
              粘贴JSON，一键格式化、压缩、校验并定位错误位置。
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Link to="/url" style={{ textDecoration: "none" }}>
            <Card
              title="URL 编码/解码"
              hoverable
              style={{ height: "100%", minHeight: "120px" }}
              bodyStyle={{ padding: "16px" }}
            >
              支持中文与特殊字符，实时对照查看，支持批量处理。
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Link to="/base64" style={{ textDecoration: "none" }}>
            <Card
              title="Base64 编解码"
              hoverable
              style={{ height: "100%", minHeight: "120px" }}
              bodyStyle={{ padding: "16px" }}
            >
              文本编解码、文件编码为 DataURL，支持 URL 安全与去填充。
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Link to="/qr" style={{ textDecoration: "none" }}>
            <Card
              title="二维码生成"
              hoverable
              style={{ height: "100%", minHeight: "120px" }}
              bodyStyle={{ padding: "16px" }}
            >
              文本/URL/WiFi，尺寸与纠错级别可调，支持批量按行生成与下载。
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Link to="/hash" style={{ textDecoration: "none" }}>
            <Card
              title="Hash 生成器"
              hoverable
              style={{ height: "100%", minHeight: "120px" }}
              bodyStyle={{ padding: "16px" }}
            >
              支持 MD5/SHA1/SHA256，文本与文件哈希，结果大小写切换与对比验证。
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
}
