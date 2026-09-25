import { useEffect, useRef, useState } from 'react'
import { facts } from '../data/facts.js'

const W = 1000
const H = 460
const SCALE = 4
const OW = Math.round(W / SCALE)
const OH = Math.round(H / SCALE)
const pitch = { left: 40, top: 30, right: W - 40, bottom: H - 30 }
const goalHalf = 60
const KICK_RANGE = 26
const TACKLE_RANGE = 44
const TACKLE_FRAMES = 14
const TACKLE_COOLDOWN = 45

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const rand = seededRandom(123456)
const grassPixels = Array.from({ length: 220 }, () => ({
  x: rand() * W,
  y: rand() * H,
  size: rand() > 0.85 ? 10 : 5,
}))
const tuftSpots = Array.from({ length: 18 }, () => ({
  x: 60 + rand() * (W - 120),
  y: 45 + rand() * (H - 90),
}))

function pickFact(prev) {
  if (facts.length <= 1) return facts[0]
  let f
  do { f = facts[Math.floor(Math.random() * facts.length)] } while (f === prev)
  return f
}

function freshPositions() {
  return {
    player: { x: W / 2 - 40, y: H / 2 },
    opponent: { x: W / 2 + 150, y: H / 2 },
    ball: { x: W / 2, y: H / 2, vx: 0, vy: 0, r: 11 },
  }
}

export default function PixelFootballGame() {
  const canvasRef = useRef(null)
  const focusedRef = useRef(false)
  const keysRef = useRef({})
  const tackleQueuedRef = useRef(false)
  // 'running' | 'paused' | 'stopped'
  const phaseRef = useRef('running')
  const stateRef = useRef({
    player: {
      x: W / 2 - 40, y: H / 2, walkPhase: 0, isMoving: false,
      facingX: 1, facingY: 0,
      tackling: false, tackleFrames: 0, tackleCooldown: 0, dashX: 0, dashY: 0,
    },
    opponent: { x: W / 2 + 150, y: H / 2, walkPhase: 0, isMoving: false },
    ball: { x: W / 2, y: H / 2, vx: 0, vy: 0, r: 11 },
  })

  const [playerScore, setPlayerScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [banner, setBanner] = useState(null)
  const [focused, setFocused] = useState(false)
  const [tackleFlash, setTackleFlash] = useState(false)
  const [phase, setPhase] = useState('running')
  const lastFactRef = useRef('')

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const off = document.createElement('canvas')
    off.width = OW
    off.height = OH
    const offCtx = off.getContext('2d')

    let raf

    const onKeyDown = (e) => {
      if (!focusedRef.current) return
      const k = e.key.toLowerCase()
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'c'].includes(k)) e.preventDefault()
      keysRef.current[k] = true
      if (k === 'c' && !e.repeat) tackleQueuedRef.current = true
    }
    const onKeyUp = (e) => { keysRef.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    function px(x, y, w, h, color) {
      offCtx.fillStyle = color
      offCtx.fillRect(
        Math.round(x / SCALE),
        Math.round(y / SCALE),
        Math.max(1, Math.round(w / SCALE)),
        Math.max(1, Math.round(h / SCALE))
      )
    }
    function dot(x, y, color) {
      px(x - SCALE / 2, y - SCALE / 2, SCALE, SCALE, color)
    }
    function circleBlocks(cx, cy, r, color, a0 = 0, a1 = Math.PI * 2) {
      const steps = Math.max(14, Math.round((r / SCALE) * 6))
      for (let i = 0; i <= steps; i++) {
        const a = a0 + (a1 - a0) * (i / steps)
        dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, color)
      }
    }
    function cornerArc(cx, cy, r, color, a0, a1) {
      const steps = Math.max(14, Math.round((r / SCALE) * 6))
      for (let i = 0; i <= steps; i++) {
        const a = a0 + (a1 - a0) * (i / steps)
        let x = cx + Math.cos(a) * r
        let y = cy + Math.sin(a) * r
        x = Math.max(pitch.left, Math.min(pitch.right, x))
        y = Math.max(pitch.top, Math.min(pitch.bottom, y))
        dot(x, y, color)
      }
    }
    function boxOutline(x, y, w, h, color, t = 8) {
      px(x, y, w, t, color)
      px(x, y + h - t, w, t, color)
      px(x, y, t, h, color)
      px(x + w - t, y, t, h, color)
    }
    function tuft(wx, wy) {
      const lx = Math.round(wx / SCALE), ly = Math.round(wy / SCALE)
      const heights = [2, 4, 2, 4, 2]
      const dark = '#1b6b25', light = '#3fa347'
      heights.forEach((h, i) => {
        offCtx.fillStyle = i % 2 === 0 ? dark : light
        offCtx.fillRect(lx + i, ly - h, 1, h)
      })
    }

    function drawField() {
      px(0, 0, W, H, '#287f28')
      const stripe = 62
      for (let x = 0; x < W; x += stripe) {
        px(x, 0, stripe, H, Math.floor(x / stripe) % 2 === 0 ? '#2f912c' : '#247a26')
      }
      grassPixels.forEach((g) => px(g.x, g.y, g.size, g.size, 'rgba(20,70,25,0.4)'))
      tuftSpots.forEach((t) => tuft(t.x, t.y))

      const white = '#f5f1d7'
      const cx = W / 2, cy = H / 2

      boxOutline(pitch.left, pitch.top, pitch.right - pitch.left, pitch.bottom - pitch.top, white, 8)
      px(cx - 4, pitch.top, 8, pitch.bottom - pitch.top, white)
      circleBlocks(cx, cy, 62, white)
      px(cx - 4, cy - 4, 8, 8, white)

      const bigW = 120, bigH = 190
      const smallW = 50, smallH = 100
      boxOutline(pitch.left, cy - bigH / 2, bigW, bigH, white, 6)
      boxOutline(pitch.right - bigW, cy - bigH / 2, bigW, bigH, white, 6)
      boxOutline(pitch.left, cy - smallH / 2, smallW, smallH, white, 6)
      boxOutline(pitch.right - smallW, cy - smallH / 2, smallW, smallH, white, 6)

      const cr = 18
      cornerArc(pitch.left, pitch.top, cr, white, 0, Math.PI / 2)
      cornerArc(pitch.right, pitch.top, cr, white, Math.PI / 2, Math.PI)
      cornerArc(pitch.left, pitch.bottom, cr, white, -Math.PI / 2, 0)
      cornerArc(pitch.right, pitch.bottom, cr, white, Math.PI, Math.PI * 1.5)
    }

    function drawGoals() {
      const cy = H / 2
      const depth = 22
      ;[pitch.left, pitch.right].forEach((x, i) => {
        const gx = i === 0 ? x - depth : x
        px(gx, cy - goalHalf, depth, 6, '#d8d8d3')
        px(gx, cy + goalHalf - 6, depth, 6, '#d8d8d3')
        px(i === 0 ? gx : gx + depth - 4, cy - goalHalf, 4, goalHalf * 2, '#d8d8d3')
        for (let y = cy - goalHalf + 8; y < cy + goalHalf; y += 16) {
          for (let dx = 0; dx <= depth; dx += 8) dot(gx + dx, y, 'rgba(200,200,196,0.6)')
        }
      })
    }

    function drawBall() {
      const { x, y, r } = stateRef.current.ball
      const d = r * 2, cut = Math.round(r * 0.35)
      px(x - r, y - r + cut, d, d - cut * 2, '#111')
      px(x - r + cut, y - r, d - cut * 2, d, '#111')
      const ir = r - 2, id = ir * 2, icut = Math.round(ir * 0.35)
      px(x - ir, y - ir + icut, id, id - icut * 2, '#f2f2e8')
      px(x - ir + icut, y - ir, id - icut * 2, id, '#f2f2e8')
      px(x - 1, y - r - 2, 2, 3, '#111')
      px(x - 3, y - r + 3, 6, 5, '#171717')
      px(x - r + 4, y - 1, 6, 6, '#171717')
      px(x + r - 10, y - 1, 6, 6, '#171717')
      px(x - 3, y + r - 8, 6, 5, '#171717')
    }

    function drawDust(x, y, fx, fy) {
      for (let i = 1; i <= 3; i++) {
        const ox = x - fx * i * 9
        const oy = y - fy * i * 9 + 22
        px(ox - 3, oy - 3, 6, 6, `rgba(210,205,180,${0.3 / i})`)
      }
    }

    function drawCharacter(entity, jersey, jerseyDark) {
      const { x, y, isMoving, walkPhase } = entity
      const swing = isMoving ? Math.sin(walkPhase) * 4 : 0

      px(x - 16, y + 30, 34, 6, '#14551c')

      px(x - 10, y + 14 + swing, 9, 17, '#eee9d7')
      px(x + 5, y + 14 - swing, 9, 17, '#eee9d7')
      px(x - 13, y + 29 + swing, 13, 6, '#151515')
      px(x + 6, y + 29 - swing, 13, 6, '#151515')
      px(x - 15, y + 30 + swing, 4, 3, '#151515')
      px(x + 17, y + 30 - swing, 4, 3, '#151515')

      px(x - 12, y + 7, 28, 13, '#f3f1e8')
      px(x + 6, y + 9, 10, 11, '#d8d5c8')
      px(x - 15, y - 5, 32, 18, jersey)
      px(x + 5, y - 3, 12, 16, jerseyDark)
      px(x - 20, y - 1, 8, 14, jersey)
      px(x + 15, y - 1, 8, 13, jersey)

      px(x - 5, y - 10, 11, 7, '#efaa7d')

      px(x - 6, y - 24, 15, 4, '#241714')
      px(x - 9, y - 20, 21, 8, '#241714')
      px(x - 8, y - 12, 19, 6, '#efaa7d')
      px(x - 5, y - 6, 13, 3, '#efaa7d')
      px(x + 10, y - 17, 6, 9, '#241714')

      px(x + 6, y - 15, 3, 3, '#111')
      px(x + 9, y - 13, 2, 2, '#d99a6c')
      px(x + 6, y - 9, 6, 2, '#7a3b2e')
    }

    function endRound() {
      const p = stateRef.current.player
      p.x = W / 2 - 40; p.y = H / 2
      p.tackling = false; p.tackleFrames = 0; p.dashX = 0; p.dashY = 0
      stateRef.current.opponent.x = W / 2 + 150
      stateRef.current.opponent.y = H / 2
      stateRef.current.ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, r: 11 }
    }

    function triggerPlayerGoal() {
      setPlayerScore((s) => s + 1)
      const next = pickFact(lastFactRef.current)
      lastFactRef.current = next
      setBanner({ kind: 'player', text: next })
      setTimeout(() => setBanner(null), 4000)
      endRound()
    }
    function triggerOpponentGoal() {
      setOpponentScore((s) => s + 1)
      setBanner({ kind: 'opponent', text: 'They got one past you. Win the ball back!' })
      setTimeout(() => setBanner(null), 3000)
      endRound()
    }

    function stepBall() {
      const b = stateRef.current.ball
      b.x += b.vx; b.y += b.vy
      b.vx *= 0.965; b.vy *= 0.965
      if (Math.hypot(b.vx, b.vy) < 0.05) { b.vx = 0; b.vy = 0 }
      const cy = H / 2
      const inGoalMouth = b.y > cy - goalHalf && b.y < cy + goalHalf
      if (b.y - b.r < pitch.top) { b.y = pitch.top + b.r; b.vy *= -0.72 }
      if (b.y + b.r > pitch.bottom) { b.y = pitch.bottom - b.r; b.vy *= -0.72 }
      if (b.x - b.r < pitch.left) {
        if (inGoalMouth) { triggerOpponentGoal(); return }
        b.x = pitch.left + b.r; b.vx *= -0.72
      }
      if (b.x + b.r > pitch.right) {
        if (inGoalMouth) { triggerPlayerGoal(); return }
        b.x = pitch.right - b.r; b.vx *= -0.72
      }
    }

    function resolveContact(dx, dy, len) {
      const s = stateRef.current
      const b = s.ball
      const p = s.player
      const pCx = p.x + 6, pCy = p.y + 14
      const oCx = s.opponent.x, oCy = s.opponent.y
      const distP = Math.hypot(b.x - pCx, b.y - pCy)
      const distO = Math.hypot(b.x - oCx, b.y - oCy)

      const tackleHit = p.tackling && distP < TACKLE_RANGE

      if (tackleHit || (distP < KICK_RANGE && distP <= distO)) {
        const nx = (b.x - pCx) / (distP || 1), ny = (b.y - pCy) / (distP || 1)
        if (tackleHit) {
          const power = 5.5
          b.vx = nx * power + p.facingX * 2.6
          b.vy = ny * power + p.facingY * 2.6
        } else {
          const moving = len > 0
          const power = moving ? 4 : 1.4
          b.vx = nx * power + (moving ? (dx / len) * 2.2 : 0)
          b.vy = ny * power + (moving ? (dy / len) * 2.2 : 0)
        }
      } else if (distO < KICK_RANGE) {
        const targetX = pitch.left + 10
        const targetY = H / 2 + (rand() - 0.5) * 80
        const tdx = targetX - b.x, tdy = targetY - b.y
        const tlen = Math.hypot(tdx, tdy) || 1
        const power = 3.6
        b.vx = (tdx / tlen) * power
        b.vy = (tdy / tlen) * power
      }
    }

    function updatePlayer() {
      const s = stateRef.current
      const p = s.player
      const k = keysRef.current
      let dx = 0, dy = 0
      if (k['arrowup'] || k['w']) dy--
      if (k['arrowdown'] || k['s']) dy++
      if (k['arrowleft'] || k['a']) dx--
      if (k['arrowright'] || k['d']) dx++
      const len = Math.hypot(dx, dy)
      p.isMoving = len > 0
      if (len) {
        p.facingX = dx / len
        p.facingY = dy / len
        if (!p.tackling) {
          p.x += (dx / len) * 3.2
          p.y += (dy / len) * 3.2
          p.walkPhase += 0.35
        }
      }

      if (p.tackleCooldown > 0) p.tackleCooldown--

      if (tackleQueuedRef.current) {
        tackleQueuedRef.current = false
        if (p.tackleCooldown <= 0 && !p.tackling) {
          p.tackling = true
          p.tackleFrames = TACKLE_FRAMES
          p.tackleCooldown = TACKLE_COOLDOWN
          const fx = p.facingX || 1, fy = p.facingY || 0
          p.dashX = fx * 9
          p.dashY = fy * 9
          setTackleFlash(true)
          setTimeout(() => setTackleFlash(false), 250)
        }
      }

      if (p.tackling) {
        p.x += p.dashX
        p.y += p.dashY
        p.dashX *= 0.85
        p.dashY *= 0.85
        p.tackleFrames--
        if (p.tackleFrames <= 0) p.tackling = false
      }

      p.x = Math.max(60, Math.min(W - 60, p.x))
      p.y = Math.max(55, Math.min(H - 45, p.y))

      return { dx, dy, len }
    }

    function updateOpponent() {
      const s = stateRef.current
      const o = s.opponent
      const b = s.ball
      const dx = b.x - o.x, dy = b.y - o.y
      const dist = Math.hypot(dx, dy) || 1
      const speed = 1.5
      o.x += (dx / dist) * speed
      o.y += (dy / dist) * speed
      o.x = Math.max(60, Math.min(W - 60, o.x))
      o.y = Math.max(55, Math.min(H - 45, o.y))
      o.isMoving = dist > 4
      if (o.isMoving) o.walkPhase += 0.28
    }

    function loop() {
      if (phaseRef.current === 'running') {
        const { dx, dy, len } = updatePlayer()
        updateOpponent()
        resolveContact(dx, dy, len)
        stepBall()
      }

      drawField()
      drawGoals()
      drawBall()
      drawCharacter(stateRef.current.opponent, '#2b6fe0', '#1e4fb0')
      if (stateRef.current.player.tackling) {
        drawDust(stateRef.current.player.x, stateRef.current.player.y, stateRef.current.player.facingX, stateRef.current.player.facingY)
      }
      drawCharacter(stateRef.current.player, '#e7352d', '#c81f18')

      ctx.clearRect(0, 0, W, H)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(off, 0, 0, OW, OH, 0, 0, W, H)

      if (phaseRef.current !== 'running') {
        offCtx.fillStyle = 'rgba(0,0,0,0.35)'
        offCtx.fillRect(0, 0, OW, OH)
        ctx.drawImage(off, 0, 0, OW, OH, 0, 0, W, H)
      }

      raf = requestAnimationFrame(loop)
    }
    loop()

    // exposed so the buttons (outside this effect) can reach game internals
    canvas.__resetPositions = () => {
      const fresh = freshPositions()
      stateRef.current.player = { ...stateRef.current.player, x: fresh.player.x, y: fresh.player.y, tackling: false, tackleFrames: 0, dashX: 0, dashY: 0 }
      stateRef.current.opponent.x = fresh.opponent.x
      stateRef.current.opponent.y = fresh.opponent.y
      stateRef.current.ball = fresh.ball
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  function togglePause() {
    if (phaseRef.current === 'stopped') return
    phaseRef.current = phaseRef.current === 'running' ? 'paused' : 'running'
    setPhase(phaseRef.current)
  }

  function handleStop() {
    phaseRef.current = 'stopped'
    setPhase('stopped')
    canvasRef.current?.__resetPositions?.()
  }

  function handleRestart() {
    setPlayerScore(0)
    setOpponentScore(0)
    setBanner(null)
    canvasRef.current?.__resetPositions?.()
    phaseRef.current = 'running'
    setPhase('running')
  }

  return (
    <div className="rounded-lg border border-line bg-panel overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line text-xs flex-wrap gap-2">
        <span className="font-semibold">
          <span className="text-accent">YOU {playerScore}</span>
          <span className="text-gray-500"> — </span>
          <span className="text-blue-400">{opponentScore} RIVAL</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 mr-1">
            {focused ? 'ARROWS/WASD MOVE · C TACKLE' : 'CLICK TO PLAY'}
          </span>
          <button
            onClick={togglePause}
            disabled={phase === 'stopped'}
            className="px-3 py-1 rounded border border-line text-gray-300 hover:border-accent/60 hover:text-accent transition-colors disabled:opacity-30 disabled:hover:border-line disabled:hover:text-gray-300"
          >
            {phase === 'paused' ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            onClick={handleStop}
            disabled={phase === 'stopped'}
            className="px-3 py-1 rounded border border-line text-gray-300 hover:border-red-400/60 hover:text-red-400 transition-colors disabled:opacity-30 disabled:hover:border-line disabled:hover:text-gray-300"
          >
            ■ Stop
          </button>
          <button
            onClick={handleRestart}
            className="px-3 py-1 rounded border border-line text-gray-300 hover:border-accent/60 hover:text-accent transition-colors"
          >
            ⟲ Restart
          </button>
        </div>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          tabIndex={0}
          onFocus={() => { focusedRef.current = true; setFocused(true) }}
          onBlur={() => { focusedRef.current = false; setFocused(false) }}
          className="w-full h-auto block outline-none cursor-pointer"
          style={{ imageRendering: 'pixelated' }}
        />
        {!focused && phase === 'running' && (
          <div onClick={() => canvasRef.current?.focus()} className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm cursor-pointer">
            Click to play
          </div>
        )}
        {phase === 'paused' && (
          <div
            onClick={togglePause}
            className="absolute inset-0 flex items-center justify-center text-lg font-bold cursor-pointer"
          >
            ⏸ PAUSED — click to resume
          </div>
        )}
        {phase === 'stopped' && (
          <div
            onClick={handleRestart}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-lg font-bold cursor-pointer"
          >
            <span>■ STOPPED</span>
            <span className="text-xs font-normal text-gray-300">click to restart</span>
          </div>
        )}
        {tackleFlash && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-yellow-300 font-bold text-sm bg-bg/80 px-3 py-1 rounded">
            TACKLE!
          </div>
        )}
        {banner && (
          <div
            className={`absolute bottom-3 left-3 right-3 rounded-md px-4 py-3 text-sm border ${
              banner.kind === 'player' ? 'bg-bg/95 border-accent/50' : 'bg-bg/95 border-blue-400/50'
            }`}
          >
            <span className={banner.kind === 'player' ? 'text-accent font-semibold' : 'text-blue-400 font-semibold'}>
              {banner.kind === 'player' ? 'GOAL! ' : 'CONCEDED. '}
            </span>
            {banner.text}
          </div>
        )}
      </div>
    </div>
  )
}