import { useMemo, useState, useEffect } from 'react'
import { Button, Card, Col, Divider, Input, Progress, Row, Select, Space, Typography, Upload, message } from 'antd'
import { CopyOutlined, UploadOutlined } from '@ant-design/icons'
import type { HashAlgo } from '../utils/hash'
import { hashFile, hashText } from '../utils/hash'

const { TextArea } = Input

export default function HashGenerator() {
  const [algo, setAlgo] = useState<HashAlgo>('MD5')
  const [text, setText] = useState('')
  const [textHash, setTextHash] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileHash, setFileHash] = useState('')
  const [fileProgress, setFileProgress] = useState(0)
  const [compare, setCompare] = useState('')

  // 实时计算文本 Hash
  useEffect(() => {
    const h = hashText(text, algo)
    setTextHash(h)
  }, [text, algo])

  const beforeUpload = async (file: File) => {
    setFileName(file.name)
    setFileProgress(0)
    setFileHash('')
    try {
      const h = await hashFile(file, algo, setFileProgress)
      setFileHash(h)
    } catch (e: any) {
      message.error(String(e?.message || e))
    }
    return false
  }

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      message.success('已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }

  const upper = useMemo(() => textHash.toUpperCase(), [textHash])
  const match = useMemo(() => !!compare && textHash && compare.trim().toLowerCase() === textHash.toLowerCase(), [compare, textHash])

  return (
    <div>
      <Typography.Title level={3}>Hash 生成器</Typography.Title>
      <Typography.Paragraph type="secondary">支持 MD5 / SHA1 / SHA256；文本与文件哈希；大小写切换；哈希值对比验证。</Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="文本哈希">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <span>算法:</span>
                <Select
                  value={algo}
                  onChange={setAlgo}
                  options={['MD5', 'SHA1', 'SHA256'].map((x) => ({ value: x, label: x }))}
                />
              </Space>
              <TextArea value={text} onChange={(e) => setText(e.target.value)} autoSize={{ minRows: 8 }} />
              <Divider />
              {textHash ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Input value={textHash} readOnly addonBefore="小写" suffix={<Button size="small" icon={<CopyOutlined />} onClick={() => copy(textHash)}>复制</Button>} />
                  <Input value={upper} readOnly addonBefore="大写" suffix={<Button size="small" icon={<CopyOutlined />} onClick={() => copy(upper)}>复制</Button>} />
                  <Input value={compare} onChange={(e) => setCompare(e.target.value)} placeholder="输入另一个哈希进行对比" />
                  <Typography.Text type={match ? 'success' : 'secondary'}>{compare ? (match ? '匹配' : '不匹配') : '输入对比哈希以校验'}</Typography.Text>
                </Space>
              ) : (
                <Typography.Text type="secondary">计算后显示结果</Typography.Text>
              )}
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="文件哈希">
            <Upload beforeUpload={beforeUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>选择文件并计算</Button>
            </Upload>
            <Divider />
            {fileName ? <Typography.Paragraph>文件: {fileName}</Typography.Paragraph> : <Typography.Text type="secondary">未选择文件</Typography.Text>}
            {fileProgress > 0 && fileProgress < 100 ? <Progress percent={fileProgress} /> : null}
            {fileHash ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input value={fileHash} readOnly addonBefore="结果" suffix={<Button size="small" icon={<CopyOutlined />} onClick={() => copy(fileHash)}>复制</Button>} />
              </Space>
            ) : null}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
