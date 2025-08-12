import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Divider, Flex, Input, Row, Select, Space, Typography, message, Collapse, Tag, Checkbox } from 'antd'
import { CopyOutlined, CompressOutlined, ExpandOutlined } from '@ant-design/icons'
import { safeParseJson } from '../utils/json'

const { TextArea } = Input

type Indent = 2 | 4 | 'tab'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState<Indent>(2)
  const [output, setOutput] = useState('')
  const [schema, setSchema] = useState('')
  const [schemaErrors, setSchemaErrors] = useState<string>('')
  const [autoFixControl, setAutoFixControl] = useState(true)
  const [autoJoinStrNewlines, setAutoJoinStrNewlines] = useState(true)

  const parseResult = useMemo(() => safeParseJson(input), [input])
  const inputElementId = 'json-input-area'

  function gotoLineCol(line?: number, col?: number, text?: string) {
    if (!line || !col) return
    const content = typeof text === 'string' ? text : input
    // compute zero-based index from 1-based line/col
    let idx = 0
    const parts = content.split(/\n/)
    const l = Math.max(1, Math.min(line, parts.length))
    for (let i = 0; i < l - 1; i++) idx += parts[i].length + 1
    idx += Math.max(0, col - 1)
    const el = document.getElementById(inputElementId) as HTMLTextAreaElement | null
    if (el) {
      // focus and select error character
      el.focus()
      const start = Math.max(0, Math.min(idx, content.length))
      const end = Math.min(content.length, start + 1)
      try { el.setSelectionRange(start, end) } catch {}
      // ensure caret is visible
      try { el.scrollTop = el.scrollHeight } catch {}
    }
  }

  function sanitizeJsonText(raw: string, opts: { fixControl: boolean; joinStrNewlines: boolean }) {
    let inStr = false
    let escaped = false
    let joinedWhitespace = false
    let fixed = 0
    let joined = 0
    const mapEsc = (code: number) => {
      switch (code) {
        case 0x08: return '\\b'
        case 0x0c: return '\\f'
        case 0x0a: return '\\n'
        case 0x0d: return '\\r'
        case 0x09: return '\\t'
        default: return `\\u${code.toString(16).padStart(4, '0')}`
      }
    }
    let out = ''
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i]
      if (!inStr) {
        if (ch === '"') { inStr = true; escaped = false; out += ch; continue }
        out += ch
        continue
      }
      if (escaped) { out += ch; escaped = false; continue }
      if (joinedWhitespace) {
        if (ch === ' ' || ch === '\t') { continue }
        joinedWhitespace = false
      }
      if (ch === '\\') { out += ch; escaped = true; continue }
      if (ch === '"') { out += ch; inStr = false; continue }
      const code = ch.charCodeAt(0)
      if (opts.joinStrNewlines && (code === 0x0a || code === 0x0d)) {
        // remove newline in string and subsequent indentation spaces/tabs
        joined++; joinedWhitespace = true; continue
      }
      if (opts.fixControl && code < 0x20) { out += mapEsc(code); fixed++; continue }
      out += ch
    }
    return { text: out, fixed, joined }
  }

  const doFormat = () => {
    if (!input.trim()) return setOutput('')
    const sanitized = sanitizeJsonText(input, { fixControl: autoFixControl, joinStrNewlines: autoJoinStrNewlines })
    if (sanitized.fixed || sanitized.joined) setInput(sanitized.text)
    const parsed = safeParseJson(sanitized.text)
    if (!parsed.ok) {
      message.error(parsed.error)
      // attempt to move caret to error position
      setTimeout(() => gotoLineCol(parsed.line, parsed.col, sanitized.text), 0)
      return
    }
    const space = indent === 'tab' ? '\t' : indent
    setOutput(JSON.stringify(parsed.value, null, space as any))
  }

  const doMinify = () => {
    if (!input.trim()) return setOutput('')
    const sanitized = sanitizeJsonText(input, { fixControl: autoFixControl, joinStrNewlines: autoJoinStrNewlines })
    if (sanitized.fixed || sanitized.joined) setInput(sanitized.text)
    const parsed = safeParseJson(sanitized.text)
    if (!parsed.ok) {
      message.error(parsed.error)
      setTimeout(() => gotoLineCol(parsed.line, parsed.col, sanitized.text), 0)
      return
    }
    setOutput(JSON.stringify(parsed.value))
  }

  const copyOut = async () => {
    try {
      await navigator.clipboard.writeText(output)
      message.success('已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }

  // 自动修复：将字符串中的非法控制字符转义
  const fixControlChars = () => {
    if (!input) return
    const mapEsc = (ch: string) => {
      const code = ch.charCodeAt(0)
      switch (code) {
        case 0x08: return '\\b'
        case 0x0c: return '\\f'
        case 0x0a: return '\\n'
        case 0x0d: return '\\r'
        case 0x09: return '\\t'
        default: return `\\u${code.toString(16).padStart(4, '0')}`
      }
    }
    let inStr = false
    let escaped = false
    let replaced = 0
    let out = ''
    for (let i = 0; i < input.length; i++) {
      const ch = input[i]
      if (!inStr) {
        if (ch === '"') { inStr = true; escaped = false; out += ch; continue }
        out += ch
        continue
      }
      // in string
      if (escaped) {
        out += ch
        escaped = false
        continue
      }
      if (ch === '\\') { out += ch; escaped = true; continue }
      if (ch === '"') { out += ch; inStr = false; continue }
      if (ch < ' ' /* < 0x20 */) {
        out += mapEsc(ch)
        replaced++
        continue
      }
      out += ch
    }
    setInput(out)
    if (replaced) message.success(`已修复 ${replaced} 处控制字符`)
    else message.info('未发现需要修复的控制字符')
  }

  // Keyboard shortcuts: Cmd/Ctrl+Enter -> format, Shift+Enter -> minify
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const cmd = isMac ? e.metaKey : e.ctrlKey
      if (cmd && e.key === 'Enter') {
        e.preventDefault(); doFormat()
      } else if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault(); doMinify()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [input, indent])

  const stats = useMemo(() => {
    const raw = input.length
    const pretty = output ? output.length : 0
    const ratio = raw && pretty ? ((1 - pretty / raw) * 100).toFixed(1) : '0.0'
    return { raw, pretty, ratio }
  }, [input, output])

  const validateSchema = async () => {
    setSchemaErrors('')
    if (!schema.trim()) return message.info('请粘贴JSON Schema再验证')
    const parsedData = safeParseJson(input)
    if (!parsedData.ok) return message.error('数据不是合法JSON，无法验证')
    const parsedSchema = safeParseJson(schema)
    if (!parsedSchema.ok) return message.error('Schema 不是合法JSON')
    try {
      const Ajv = (await import('ajv')).default
      const ajv = new Ajv({ allErrors: true, strict: false })
      const validate = ajv.compile(parsedSchema.value)
      const valid = validate(parsedData.value)
      if (valid) {
        message.success('Schema 验证通过')
      } else {
        const errs = (validate.errors || []).map(e => `${e.instancePath || '/'} ${e.message || ''}`).join('\n')
        setSchemaErrors(errs || '未知错误')
      }
    } catch (e: any) {
      message.error(String(e?.message || e))
    }
  }

  return (
    <div>
      <Typography.Title level={3}>JSON 格式化/校验</Typography.Title>
      <Typography.Paragraph type="secondary">
        支持格式化、压缩、校验并定位错误位置；大文件亦可处理（&gt;1MB）。
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="输入JSON">
            <TextArea
              id={inputElementId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoSize={{ minRows: 16 }}
              placeholder="在此粘贴JSON文本"
              style={{ fontFamily: ' ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
            />
            <Divider />
            <Flex gap={8} wrap>
              <Space>
                <span>缩进:</span>
                <Select
                  value={indent}
                  onChange={(v) => setIndent(v)}
                  options={[
                    { value: 2 as Indent, label: '2 空格' },
                    { value: 4 as Indent, label: '4 空格' },
                    { value: 'tab' as Indent, label: 'Tab' },
                  ]}
                  style={{ minWidth: 120 }}
                />
              </Space>
              <Button type="primary" icon={<ExpandOutlined />} onClick={doFormat}>
                格式化
              </Button>
              <Button icon={<CompressOutlined />} onClick={doMinify}>
                压缩
              </Button>
              <Button onClick={fixControlChars}>修复控制字符</Button>
              <Space>
                <Checkbox checked={autoFixControl} onChange={(e) => setAutoFixControl(e.target.checked)}>自动修复控制字符</Checkbox>
                <Checkbox checked={autoJoinStrNewlines} onChange={(e) => setAutoJoinStrNewlines(e.target.checked)}>合并字符串内换行</Checkbox>
              </Space>
            </Flex>
            <Divider />
            <Space wrap>
              <Tag>原始长度: {stats.raw}</Tag>
              <Tag>当前输出长度: {stats.pretty}</Tag>
              <Tag color="blue">压缩节省: {stats.ratio}%</Tag>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                输出结果
                <Button size="small" icon={<CopyOutlined />} onClick={copyOut}>
                  复制
                </Button>
              </Space>
            }
          >
            {(() => {
              if (!input.trim()) return <Typography.Text type="secondary">无输出</Typography.Text>
              if (!parseResult.ok) {
                return (
                  <Typography.Text type="danger">
                    语法错误：{parseResult.error}
                    {parseResult.line && parseResult.col ? ` (行 ${parseResult.line}, 列 ${parseResult.col})` : ''}
                  </Typography.Text>
                )
              }
              return (
                <TextArea
                  value={output}
                  readOnly
                  autoSize={{ minRows: 16 }}
                  style={{ fontFamily: ' ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                />
              )
            })()}
          </Card>
          <Collapse style={{ marginTop: 16 }} items={[{
            key: 'schema',
            label: 'JSON Schema 验证（基础）',
            children: (
              <div>
                <Typography.Paragraph type="secondary">在此粘贴 Schema，点击验证。</Typography.Paragraph>
                <TextArea
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                  autoSize={{ minRows: 8 }}
                  placeholder="JSON Schema"
                  style={{ fontFamily: ' ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                />
                <Space style={{ marginTop: 8 }}>
                  <Button onClick={validateSchema}>验证 Schema</Button>
                </Space>
                {schemaErrors && (
                  <Typography.Paragraph type="danger" style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{schemaErrors}</Typography.Paragraph>
                )}
              </div>
            )
          }]} />
        </Col>
      </Row>
    </div>
  )
}
