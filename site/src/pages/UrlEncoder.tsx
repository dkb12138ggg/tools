import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Divider, Input, Row, Space, Switch, Typography, message, Table } from 'antd'
import { CopyOutlined, SwapOutlined } from '@ant-design/icons'

const { TextArea } = Input

export default function UrlEncoder() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [batch, setBatch] = useState(true)

  const lines = useMemo(() => input.split(/\r?\n/), [input])
  const tableData = useMemo(() => {
    if (!batch) return [] as { key: number; input: string; output: string }[]
    const arr = input.split(/\r?\n/)
    const outArr = result.split(/\r?\n/)
    const len = Math.max(arr.length, outArr.length)
    const rows = [] as { key: number; input: string; output: string }[]
    for (let i = 0; i < len; i++) rows.push({ key: i, input: arr[i] || '', output: outArr[i] || '' })
    return rows
  }, [batch, input, result])

  const apply = (fn: (s: string) => string) => {
    try {
      const out = batch ? lines.map((l) => (l ? fn(l) : '')).join('\n') : fn(input)
      setResult(out)
    } catch (e: any) {
      message.error(String(e?.message || e))
    }
  }

  const encode = () => apply(encodeURIComponent)
  const decode = () => apply(decodeURIComponent)

  const copyOut = async () => {
    try {
      await navigator.clipboard.writeText(result)
      message.success('已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }

  const swap = () => {
    setInput(result)
    setResult(input)
  }

  const exportCSV = () => {
    const rows = tableData
    if (!rows.length) return message.info('无批量结果可导出')
    const header = 'input,output\n'
    const esc = (s: string) => '"' + s.replace(/"/g, '""') + '"'
    const body = rows.map(r => `${esc(r.input)},${esc(r.output)}`).join('\n')
    const csv = header + body
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'url_batch.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Keyboard shortcuts: Cmd/Ctrl+Shift+E (encode), Cmd/Ctrl+Shift+D (decode)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const cmd = isMac ? e.metaKey : e.ctrlKey
      if (cmd && e.shiftKey && (e.key.toLowerCase() === 'e')) { e.preventDefault(); encode() }
      if (cmd && e.shiftKey && (e.key.toLowerCase() === 'd')) { e.preventDefault(); decode() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [input, batch])

  // Basic history using localStorage
  const [history, setHistory] = useState<{ input: string; output: string; t: number }[]>(() => {
    try { return JSON.parse(localStorage.getItem('url_history') || '[]') } catch { return [] }
  })

  useEffect(() => {
    if (!result) return
    const item = { input, output: result, t: Date.now() }
    const next = [item, ...history].slice(0, 10)
    setHistory(next)
    try { localStorage.setItem('url_history', JSON.stringify(next)) } catch {}
    // only update when result changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  return (
    <div>
      <Typography.Title level={3}>URL 编码 / 解码</Typography.Title>
      <Typography.Paragraph type="secondary">
        支持中文与特殊字符，实时转换。可按行批量处理。
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="输入文本">
            <TextArea value={input} onChange={(e) => setInput(e.target.value)} autoSize={{ minRows: 12 }} />
            <Divider />
            <Space wrap>
              <span>按行批量:</span>
              <Switch checked={batch} onChange={setBatch} />
              <Button type="primary" onClick={encode}>编码</Button>
              <Button onClick={decode}>解码</Button>
              <Button icon={<SwapOutlined />} onClick={swap}>互换</Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={
            <Space>
              输出结果
              <Button size="small" icon={<CopyOutlined />} onClick={copyOut}>复制</Button>
              {batch ? <Button size="small" onClick={exportCSV}>导出CSV</Button> : null}
            </Space>
          }>
            <TextArea value={result} readOnly autoSize={{ minRows: 12 }} />
            {batch ? (
              <>
                <Divider />
                <Table size="small" dataSource={tableData} pagination={false} columns={[
                  { title: '输入', dataIndex: 'input', key: 'input' },
                  { title: '输出', dataIndex: 'output', key: 'output' },
                ]} />
              </>
            ) : null}
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="历史记录（最近10条）" style={{ marginTop: 16 }}>
            {history.length ? (
              <Table
                size="small"
                pagination={false}
                dataSource={history.map((h, i) => ({ key: i, ...h }))}
                columns={[
                  { title: '时间', dataIndex: 't', key: 't', render: (t: number) => new Date(t).toLocaleString() },
                  { title: '输入', dataIndex: 'input', key: 'input' },
                  { title: '输出', dataIndex: 'output', key: 'output' },
                ]}
              />
            ) : (
              <Typography.Text type="secondary">暂无历史</Typography.Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
