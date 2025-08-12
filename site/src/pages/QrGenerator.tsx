import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Col, Divider, Input, Row, Select, Slider, Space, Typography, message, ColorPicker, Upload } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'

type ECLevel = 'L' | 'M' | 'Q' | 'H'

function downloadCanvasAsPng(canvas: HTMLCanvasElement | null, fileName: string) {
  if (!canvas) return
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
}

function WifiForm({ onChange }: { onChange: (v: string) => void }) {
  const [ssid, setSsid] = useState('')
  const [pass, setPass] = useState('')
  const [type, setType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA')
  const [hidden, setHidden] = useState<'true' | 'false'>('false')
  useEffect(() => {
    const v = `WIFI:S:${ssid};T:${type};P:${pass};H:${hidden};;`
    onChange(v)
  }, [ssid, pass, type, hidden, onChange])
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input placeholder="WiFi 名称(SSID)" value={ssid} onChange={(e) => setSsid(e.target.value)} />
      <Input.Password placeholder="密码(可空)" value={pass} onChange={(e) => setPass(e.target.value)} />
      <Space wrap>
        <Select
          value={type}
          onChange={setType}
          options={[
            { value: 'WPA', label: 'WPA' },
            { value: 'WEP', label: 'WEP' },
            { value: 'nopass', label: '无密码' },
          ]}
        />
        <Select
          value={hidden}
          onChange={setHidden}
          options={[
            { value: 'false', label: '非隐藏' },
            { value: 'true', label: '隐藏' },
          ]}
        />
      </Space>
    </Space>
  )
}

export default function QrGenerator() {
  const [mode, setMode] = useState<'text' | 'url' | 'wifi' | 'batch'>('text')
  const [value, setValue] = useState('Hello, QR!')
  const [level, setLevel] = useState<ECLevel>('M')
  const [size, setSize] = useState(256)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<HTMLDivElement | null>(null)
  const [fgColor, setFgColor] = useState<string>('#000000')
  const [bgColor, setBgColor] = useState<string>('#ffffff')
  const [format, setFormat] = useState<'png' | 'jpg' | 'svg'>('png')
  const [logoDataUrl, setLogoDataUrl] = useState<string>('')
  const [logoScale, setLogoScale] = useState<number>(22) // percent of QR size
  const [logoRadius, setLogoRadius] = useState<number>(12) // percent of logo size
  const [preset, setPreset] = useState<'custom' | 'classic' | 'ocean' | 'grape' | 'contrast' | 'inverted'>('classic')

  function applyPreset(p: typeof preset) {
    setPreset(p)
    switch (p) {
      case 'classic':
        setFgColor('#000000'); setBgColor('#ffffff'); break
      case 'ocean':
        setFgColor('#1677ff'); setBgColor('#e6f4ff'); break
      case 'grape':
        setFgColor('#722ed1'); setBgColor('#f9f0ff'); break
      case 'contrast':
        setFgColor('#141414'); setBgColor('#f0f0f0'); break
      case 'inverted':
        setFgColor('#ffffff'); setBgColor('#141414'); break
      case 'custom':
        break
    }
  }

  function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const rr = Math.min(r, Math.min(w, h) / 2)
    ctx.beginPath()
    ctx.moveTo(x + rr, y)
    ctx.arcTo(x + w, y, x + w, y + h, rr)
    ctx.arcTo(x + w, y + h, x, y + h, rr)
    ctx.arcTo(x, y + h, x, y, rr)
    ctx.arcTo(x, y, x + w, y, rr)
    ctx.closePath()
  }

  const batchLines = useMemo(() => (mode === 'batch' ? value.split(/\r?\n/).filter(Boolean) : []), [mode, value])

  const currentValue = useMemo(() => value, [value])

  const download = async () => {
    if (mode === 'batch') return message.info('请在每张二维码下方单独下载')
    if (format === 'svg') {
      const svg = svgRef.current?.querySelector('svg')
      if (!svg) return
      const svgStr = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([svgStr], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'qrcode.svg'
      a.click()
      URL.revokeObjectURL(url)
      return
    }
    const canvas = canvasRef.current?.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return
    if (!logoDataUrl) {
      const mime = format === 'jpg' ? 'image/jpeg' : 'image/png'
      const url = canvas.toDataURL(mime)
      const a = document.createElement('a')
      a.href = url
      a.download = `qrcode.${format}`
      a.click()
      return
    }
    // composite logo on an offscreen canvas
    const off = document.createElement('canvas')
    off.width = canvas.width
    off.height = canvas.height
    const ctx = off.getContext('2d')!
    ctx.drawImage(canvas, 0, 0)
    await new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.max(10, Math.min(40, logoScale)) / 100
        const w = Math.floor(canvas.width * scale)
        const h = Math.floor(canvas.height * scale)
        const x = Math.floor((canvas.width - w) / 2)
        const y = Math.floor((canvas.height - h) / 2)
        ctx.fillStyle = bgColor
        const pad = Math.floor(w * 0.15)
        const radius = Math.floor((Math.max(0, Math.min(50, logoRadius)) / 100) * (w + pad * 2) * 0.2)
        roundedRect(ctx, x - pad, y - pad, w + pad * 2, h + pad * 2, radius)
        ctx.fill()
        ctx.drawImage(img, x, y, w, h)
        resolve()
      }
      img.onerror = () => reject(new Error('Logo 加载失败'))
      img.src = logoDataUrl
    })
    const mime = format === 'jpg' ? 'image/jpeg' : 'image/png'
    const url = off.toDataURL(mime)
    const a = document.createElement('a')
    a.href = url
    a.download = `qrcode.${format}`
    a.click()
  }

  const beforeUploadLogo = (file: File) => {
    const r = new FileReader()
    r.onload = () => setLogoDataUrl(String(r.result || ''))
    r.readAsDataURL(file)
    return false
  }

  const clearLogo = () => setLogoDataUrl('')

  const downloadBatchZip = async () => {
    if (mode !== 'batch') return
    if (format === 'svg') {
      message.info('批量ZIP暂不支持SVG，建议选择PNG/JPG')
      return
    }
    const canvases = Array.from(document.querySelectorAll('[data-qr-batch] canvas')) as HTMLCanvasElement[]
    if (!canvases.length) return
    const JSZip = (await import('jszip')).default as any
    const zip = new JSZip()
    for (let i = 0; i < canvases.length; i++) {
      const c = canvases[i]
      let dataURL: string
      if (logoDataUrl) {
        const off = document.createElement('canvas')
        off.width = c.width
        off.height = c.height
        const ctx = off.getContext('2d')!
        ctx.drawImage(c, 0, 0)
        await new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => {
            const scale = Math.max(10, Math.min(40, logoScale)) / 100
            const w = Math.floor(c.width * scale)
            const h = Math.floor(c.height * scale)
            const x = Math.floor((c.width - w) / 2)
            const y = Math.floor((c.height - h) / 2)
            ctx.fillStyle = bgColor
            const pad = Math.floor(w * 0.15)
            const radius = Math.floor((Math.max(0, Math.min(50, logoRadius)) / 100) * (w + pad * 2) * 0.2)
            roundedRect(ctx, x - pad, y - pad, w + pad * 2, h + pad * 2, radius)
            ctx.fill()
            ctx.drawImage(img, x, y, w, h)
            resolve()
          }
          img.src = logoDataUrl
        })
        const mime = format === 'jpg' ? 'image/jpeg' : 'image/png'
        dataURL = off.toDataURL(mime)
      } else {
        const mime = format === 'jpg' ? 'image/jpeg' : 'image/png'
        dataURL = c.toDataURL(mime)
      }
      const base64 = dataURL.split(',')[1]
      zip.file(`qrcode-${i + 1}.${format}`, base64, { base64: true })
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcodes.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <Typography.Title level={3}>二维码生成器</Typography.Title>
      <Typography.Paragraph type="secondary">
        支持文本、URL、WiFi，多尺寸与纠错级别。可批量按行生成。
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="输入">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Select
                value={mode}
                onChange={setMode}
                options={[
                  { value: 'text', label: '文本' },
                  { value: 'url', label: 'URL' },
                  { value: 'wifi', label: 'WiFi' },
                  { value: 'batch', label: '批量(按行)' },
                ]}
              />
              {mode === 'wifi' ? (
                <WifiForm onChange={setValue} />
              ) : (
                <Input.TextArea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoSize={{ minRows: 8 }}
                  placeholder={mode === 'batch' ? '每行一个文本/链接' : '输入内容'}
                />
              )}
              <Divider />
              <Space wrap>
                <span>纠错等级:</span>
                <Select
                  value={level}
                  onChange={(v) => setLevel(v as ECLevel)}
                  options={['L', 'M', 'Q', 'H'].map((x) => ({ value: x, label: x }))}
                />
                <span>尺寸:</span>
                <Slider style={{ width: 200 }} min={128} max={512} step={32} value={size} onChange={setSize} />
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="预览与下载">
            {mode !== 'batch' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 12 }}>
                  <Space wrap>
                    <span>前景色</span>
                    <ColorPicker value={fgColor} onChange={(c) => { setPreset('custom'); setFgColor(c.toHexString()) }} />
                    <span>背景色</span>
                    <ColorPicker value={bgColor} onChange={(c) => { setPreset('custom'); setBgColor(c.toHexString()) }} />
                    <span>预设</span>
                    <Select value={preset} onChange={applyPreset} options={[
                      {value:'classic',label:'经典'},
                      {value:'ocean',label:'海洋'},
                      {value:'grape',label:'葡萄'},
                      {value:'contrast',label:'对比'},
                      {value:'inverted',label:'反色'},
                      {value:'custom',label:'自定义'},
                    ]} />
                    <span>格式</span>
                    <Select value={format} onChange={(v) => setFormat(v as any)} options={[{value:'png',label:'PNG'},{value:'jpg',label:'JPG'},{value:'svg',label:'SVG'}]} />
                    <Upload beforeUpload={beforeUploadLogo} showUploadList={false}>
                      <Button icon={<UploadOutlined />}>上传Logo</Button>
                    </Upload>
                    {logoDataUrl ? <Button onClick={clearLogo}>移除Logo</Button> : null}
                    <span>Logo大小</span>
                    <Slider style={{ width: 140 }} min={10} max={40} value={logoScale} onChange={setLogoScale} />
                    <span>圆角</span>
                    <Slider style={{ width: 120 }} min={0} max={50} value={logoRadius} onChange={setLogoRadius} />
                  </Space>
                </div>
                {format === 'svg' ? (
                  <div ref={svgRef}>
                    <QRCodeSVG value={currentValue || ' '} size={size} level={level} includeMargin fgColor={fgColor} bgColor={bgColor} />
                  </div>
                ) : (
                  <div ref={canvasRef}>
                    <QRCodeCanvas value={currentValue || ' '} size={size} level={level} includeMargin fgColor={fgColor} bgColor={bgColor} />
                  </div>
                )}
                <Button icon={<DownloadOutlined />} onClick={download} style={{ marginTop: 12 }}>
                  下载
                </Button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <Space wrap>
                    <span>前景色</span>
                    <ColorPicker value={fgColor} onChange={(c) => { setPreset('custom'); setFgColor(c.toHexString()) }} />
                    <span>背景色</span>
                    <ColorPicker value={bgColor} onChange={(c) => { setPreset('custom'); setBgColor(c.toHexString()) }} />
                    <span>预设</span>
                    <Select value={preset} onChange={applyPreset} options={[
                      {value:'classic',label:'经典'},
                      {value:'ocean',label:'海洋'},
                      {value:'grape',label:'葡萄'},
                      {value:'contrast',label:'对比'},
                      {value:'inverted',label:'反色'},
                      {value:'custom',label:'自定义'},
                    ]} />
                    <span>格式</span>
                    <Select value={format} onChange={(v) => setFormat(v as any)} options={[{value:'png',label:'PNG'},{value:'jpg',label:'JPG'},{value:'svg',label:'SVG'}]} />
                    <Upload beforeUpload={beforeUploadLogo} showUploadList={false}>
                      <Button icon={<UploadOutlined />}>上传Logo</Button>
                    </Upload>
                    <span>Logo大小</span>
                    <Slider style={{ width: 140 }} min={10} max={40} value={logoScale} onChange={setLogoScale} />
                    <span>圆角</span>
                    <Slider style={{ width: 120 }} min={0} max={50} value={logoRadius} onChange={setLogoRadius} />
                    {format !== 'svg' ? (
                      <Button icon={<DownloadOutlined />} onClick={downloadBatchZip}>批量ZIP下载</Button>
                    ) : (
                      <Typography.Text type="secondary">SVG 暂不支持批量打包</Typography.Text>
                    )}
                  </Space>
                </div>
                <Row gutter={[12, 12]} data-qr-batch>
                  {batchLines.map((line, idx) => (
                    <Col xs={12} md={8} key={`${idx}-${line}`}>
                      <Card size="small" styles={{ body: { textAlign: 'center' } }}>
                        <QRCodeCanvas value={line} size={192} level={level} includeMargin fgColor={fgColor} bgColor={bgColor} />
                        <div>
                          <Button
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={(e) => {
                              const canvas = (e.currentTarget.parentElement?.previousSibling as HTMLElement)?.querySelector('canvas') as HTMLCanvasElement | null
                              if (!canvas) return
                              if (format === 'png') downloadCanvasAsPng(canvas, `qrcode-${idx + 1}.png`)
                              else if (format === 'jpg') {
                                const url = canvas.toDataURL('image/jpeg')
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `qrcode-${idx + 1}.jpg`
                                a.click()
                              } else {
                                message.info('SVG需切换单个预览下载')
                              }
                            }}
                            style={{ marginTop: 8 }}
                          >
                            下载
                          </Button>
                        </div>
                        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 8 }}>{line}</Typography.Paragraph>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
