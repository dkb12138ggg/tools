export function positionToLineCol(text: string, pos: number) {
  const lines = text.slice(0, pos).split(/\n/)
  const line = lines.length
  const col = lines[lines.length - 1].length + 1
  return { line, col }
}

export function safeParseJson(input: string): { ok: true; value: any } | { ok: false; error: string; line?: number; col?: number; pos?: number } {
  try {
    const value = JSON.parse(input)
    return { ok: true, value }
  } catch (e: any) {
    const msg = String(e?.message || e)
    const match = msg.match(/position (\d+)/)
    if (match) {
      const pos = Number(match[1])
      const { line, col } = positionToLineCol(input, pos)
      return { ok: false, error: msg, line, col, pos }
    }
    return { ok: false, error: msg }
  }
}
