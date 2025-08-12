import { useMemo, useRef, useState } from 'react'
import { Button, Card, Col, Divider, Flex, Input, Row, Space, Switch, Tabs, Typography, Upload, message, Select } from 'antd'
import { CopyOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { decodeTextBase64, encodeTextBase64 } from '../utils/base64'

const { TextArea } = Input

export default function Base64Tool() {
  const [text, setText] = useState('')
  const [b64, setB64] = useState('')
  const [urlSafe, setUrlSafe] = useState(true)
  const [noPadding, setNoPadding] = useState(false)
  const [fileDataUrl, setFileDataUrl] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const aRef = useRef<HTMLAnchorElement | null>(null)
  const [decodeMime, setDecodeMime] = useState<string>('application/octet-stream')
  const [decodeName, setDecodeName] = useState<string>('decoded.bin')

  const encoded = useMemo(() => encodeTextBase64(text, urlSafe, noPadding), [text, urlSafe, noPadding])
  const decoded = useMemo(() => {
    if (!b64) return ''
    try {
      return decodeTextBase64(b64)
    } catch (e: any) {
      return `[解码失败] ${String(e?.message || e)}`
    }
  }, [b64])

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      message.success('已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }

  const beforeUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setFileDataUrl(String(reader.result || ''))
      setFileName(file.name)
    }
    reader.readAsDataURL(file)
    return false
  }

  const downloadDataUrl = () => {
    if (!fileDataUrl) return
    const a = aRef.current || document.createElement('a')
    if (!aRef.current) aRef.current = a
    a.href = fileDataUrl
    a.download = fileName || 'download'
    a.click()
  }

  const downloadDecoded = () => {
    if (!b64) return
    try {
      const std = b64.startsWith('data:') ? (b64.split(',')[1] || '') : b64
      const binary = atob(std)
      const len = binary.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
      const blob = new Blob([bytes], { type: decodeMime || 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = decodeName || 'decoded.bin'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      message.error(String(e?.message || e))
    }
  }

  const sizeInfo = useMemo(() => {
    if (!fileDataUrl) return ''
    const b64 = fileDataUrl.split(',')[1] || ''
    const sizeBytes = Math.ceil((b64.length * 3) / 4)
    const kb = (sizeBytes / 1024).toFixed(2)
    return `${kb} KB`
  }, [fileDataUrl])

  return (
    <div>
      <Typography.Title level={3}>Base64 编解码</Typography.Title>
      <Typography.Paragraph type="secondary">支持文本编解码，图片/文件编码，URL 安全选项与去填充。</Typography.Paragraph>
      <Tabs
        items={[
          {
            key: 'text',
            label: '文本',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="原始文本">
                    <TextArea value={text} onChange={(e) => setText(e.target.value)} autoSize={{ minRows: 12 }} />
                    <Divider />
                    <Flex gap={12} wrap>
                      <Space>
                        <span>URL安全:</span>
                        <Switch checked={urlSafe} onChange={setUrlSafe} />
                      </Space>
                      <Space>
                        <span>去填充:</span>
                        <Switch checked={noPadding} onChange={setNoPadding} />
                      </Space>
                    </Flex>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title={
                    <Space>
                      Base64 结果
                      <Button size="small" icon={<CopyOutlined />} onClick={() => copy(encoded)}>复制</Button>
                    </Space>
                  }>
                    <TextArea value={encoded} readOnly autoSize={{ minRows: 12 }} />
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Base64 输入（解码）">
                    <TextArea value={b64} onChange={(e) => setB64(e.target.value)} autoSize={{ minRows: 12 }} />
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title={
                    <Space>
                      解码结果
                      <Button size="small" icon={<CopyOutlined />} onClick={() => copy(decoded)}>复制</Button>
                    </Space>
                  }>
                    <TextArea value={decoded} readOnly autoSize={{ minRows: 12 }} />
                    <Divider />
                    <Space wrap>
                      <Input style={{ width: 220 }} placeholder="MIME类型 (如 image/png)" value={decodeMime} onChange={(e) => setDecodeMime(e.target.value)} />
                      <Input style={{ width: 220 }} placeholder="文件名 (如 file.png)" value={decodeName} onChange={(e) => setDecodeName(e.target.value)} />
                      <Button onClick={downloadDecoded}>解码为文件下载</Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'batch',
            label: '批量文本',
            children: (
              <BatchBase64 />
            ),
          },
          {
            key: 'file',
            label: '文件',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="上传文件编码为Base64">
                    <Upload beforeUpload={beforeUpload} showUploadList={false}>
                      <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>
                    <Divider />
                    {fileDataUrl ? (
                      <div>
                        <Typography.Paragraph>文件名: {fileName}</Typography.Paragraph>
                        <Typography.Paragraph>编码后大小: {sizeInfo}</Typography.Paragraph>
                        <Space>
                          <Button icon={<CopyOutlined />} onClick={() => copy(fileDataUrl)}>
                            复制DataURL
                          </Button>
                          <Button icon={<DownloadOutlined />} onClick={downloadDataUrl}>
                            下载
                          </Button>
                        </Space>
                      </div>
                    ) : (
                      <Typography.Text type="secondary">未选择文件</Typography.Text>
                    )}
                    <a ref={aRef} style={{ display: 'none' }} />
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="预览">
                    {fileDataUrl && fileDataUrl.startsWith('data:image') ? (
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      <img src={fileDataUrl} alt="preview" style={{ maxWidth: '100%' }} />
                    ) : (
                      <Typography.Text type="secondary">选择图片文件可预览</Typography.Text>
                    )}
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </div>
  )
}

function BatchBase64() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [encode, setEncode] = useState(true)
  const [urlSafe, setUrlSafe] = useState(true)
  const [noPadding, setNoPadding] = useState(false)

  const apply = () => {
    const arr = input.split(/\r?\n/)
    const out = arr.map((l) => {
      if (!l) return ''
      try {
        return encode ? encodeTextBase64(l, urlSafe, noPadding) : decodeTextBase64(l)
      } catch (e: any) {
        return `[错误] ${String(e?.message || e)}`
      }
    }).join('\n')
    setOutput(out)
  }

  const exportCSV = () => {
    const inArr = input.split(/\r?\n/)
    const outArr = output.split(/\r?\n/)
    const len = Math.max(inArr.length, outArr.length)
    const header = 'input,output\n'
    const esc = (s: string) => '"' + s.replace(/"/g, '""') + '"'
    const body = Array.from({ length: len }).map((_, i) => `${esc(inArr[i] || '')},${esc(outArr[i] || '')}`).join('\n')
    const csv = header + body
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'base64_batch.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="批量输入（按行）">
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} autoSize={{ minRows: 12 }} />
          <Divider />
          <Space wrap>
            <span>模式:</span>
            <Select value={encode ? 'encode' : 'decode'} onChange={(v: 'encode' | 'decode') => setEncode(v === 'encode')} options={[{value:'encode',label:'编码'},{value:'decode',label:'解码'}]} />
            {encode ? (
              <>
                <span>URL安全</span>
                <Switch checked={urlSafe} onChange={setUrlSafe} />
                <span>去填充</span>
                <Switch checked={noPadding} onChange={setNoPadding} />
              </>
            ) : null}
            <Button type="primary" onClick={apply}>应用</Button>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title={<Space>批量结果<Button size="small" onClick={exportCSV}>导出CSV</Button></Space>}>
          <TextArea value={output} readOnly autoSize={{ minRows: 12 }} />
        </Card>
      </Col>
    </Row>
  )
}
