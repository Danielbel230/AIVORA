import { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import { useFaceApi } from '../hooks/useFaceApi'
import { mapearEmocion } from '../utils/emotionMapper'

const SCAN_DURATION = 5000
const BOX_MIN = 120
const BOX_MAX = 240

const FRASES = [
  'Mapeando geometría facial...',
  'Leyendo microexpresiones...',
  'Calibrando perfil biométrico...',
  'Sincronizando identidad olfativa...',
]

const STATUS_MSG = {
  noFace:   'Acerca tu rostro al centro',
  tooFar:   'Acércate un poco más',
  tooClose: 'Aléjate un poco',
  ready:    null,
}

export default function ScreenFaceScan({ appData, updateData, goTo }) {
  const { videoRef, cargado, cargarModelos, iniciarCamara, detenerCamara, detectar, esperarVideo } = useFaceApi()
  const [estado, setEstado] = useState('cargando')
  const [faceStatus, setFaceStatus] = useState('noFace')
  const [progreso, setProgreso] = useState(0)
  const [fraseIdx, setFraseIdx] = useState(0)
  const [scoreDisplay, setScoreDisplay] = useState('--')

  const frasesRef      = useRef(null)
  const canvasRef      = useRef(null)
  const rafRef         = useRef(null)
  const landmarksRef   = useRef(null)
  const samplesRef     = useRef([])
  const finalizedRef   = useRef(false)
  const faceStatusRef  = useRef('noFace')
  const accMsRef       = useRef(0)
  const lastTickRef    = useRef(null)
  const scanElapsedRef = useRef(0)
  const lastFrameRef   = useRef(null)
  const detectarRef    = useRef(detectar)

  // Keep detectarRef current every render — fixes stale closure
  useEffect(() => { detectarRef.current = detectar })

  // ── Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    console.log('[EFFECT] init() llamado')
    let cancelled = false

    async function init() {
      await cargarModelos()
      if (cancelled) return
      const ok = await iniciarCamara()
      if (!ok || cancelled) { saltar(); return }

      const videoListo = await esperarVideo()
      if (!videoListo || cancelled) { saltar(); return }
      console.log('[INIT] video listo:',
        videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight,
        '| offset:', videoRef.current?.offsetWidth, 'x', videoRef.current?.offsetHeight)

      setEstado('escaneando')
    }

    init()

    return () => {
      console.log('[EFFECT] cleanup ejecutado')
      cancelled = true
      clearInterval(frasesRef.current)
      cancelAnimationFrame(rafRef.current)
      detenerCamara()
    }
  }, [])

  // ── Rotación de frases ────────────────────────────────────────────────────
  useEffect(() => {
    if (estado !== 'escaneando') return
    frasesRef.current = setInterval(() => {
      setFraseIdx(i => (i + 1) % FRASES.length)
    }, 1500)
    return () => clearInterval(frasesRef.current)
  }, [estado])

  // ── Loop principal: detección + canvas (merged async RAF) ─────────────────
  useEffect(() => {
    if (estado !== 'escaneando') return
    console.log('[LOOP] useEffect escaneando — iniciando loop')
    rafRef.current = null

    const loop = async (now) => {
      if (finalizedRef.current) return

      console.log('[RAF] frame corriendo')
      const canvas = canvasRef.current
      const video  = videoRef.current
      if (!canvas || !video) { rafRef.current = requestAnimationFrame(loop); return }

      // Sync canvas to rendered video size
      const W = video.offsetWidth  || 256
      const H = video.offsetHeight || 256
      if (canvas.width  !== W) canvas.width  = W
      if (canvas.height !== H) canvas.height = H

      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, W, H)

      // Detection — always uses the latest detectar via ref
      console.log('[RAF] llamando detectar()')
      const resultado = await detectarRef.current()
      console.log('[RAF] resultado:', resultado)

      if (finalizedRef.current) return

      // Face position classification
      let status = 'noFace'
      if (resultado?.detections?.length > 0) {
        setScoreDisplay(resultado.detections[0].detection.score.toFixed(3))
        const vW = video.videoWidth  || 640
        const dW = video.offsetWidth || 256
        const boxW = resultado.detections[0].detection.box.width * (dW / vW)
        console.log('[LOOP] boxW display:', boxW.toFixed(1))
        if (boxW < BOX_MIN)      status = 'tooFar'
        else if (boxW > BOX_MAX) status = 'tooClose'
        else                     status = 'ready'
      } else {
        setScoreDisplay('--')
      }

      faceStatusRef.current = status
      setFaceStatus(status)

      // Accumulate time only when face is in correct position
      const nowMs = Date.now()
      if (status === 'ready') {
        if (resultado.emocion)     samplesRef.current.push(resultado.emocion)
        if (resultado.detections)  landmarksRef.current = resultado.detections

        const dt = lastTickRef.current !== null ? nowMs - lastTickRef.current : 0
        lastTickRef.current = nowMs
        accMsRef.current += dt

        const prog = Math.min(accMsRef.current / SCAN_DURATION, 1)
        setProgreso(prog)

        if (accMsRef.current >= SCAN_DURATION) {
          finalizarEscaneo()
          return
        }
      } else {
        lastTickRef.current = null
      }

      // Canvas: scan line + landmarks
      const isReady = faceStatusRef.current === 'ready'
      if (isReady) {
        if (lastFrameRef.current !== null) {
          scanElapsedRef.current += now - lastFrameRef.current
        }
        lastFrameRef.current = now

        const scanY = Math.floor((scanElapsedRef.current % 2000) / 2000 * H)
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(201, 168, 76, 0.3)'
        ctx.lineWidth = 2
        ctx.moveTo(0, scanY)
        ctx.lineTo(W, scanY)
        ctx.stroke()

        const dets = landmarksRef.current
        if (dets && dets.length > 0) {
          const resized = faceapi.resizeResults(dets, { width: W, height: H })
          const lm = resized[0]?.landmarks
          if (lm) dibujarLandmarks(ctx, lm, W, H, video)
        }
      } else {
        lastFrameRef.current = null
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [estado])

  // ── Finalizar ─────────────────────────────────────────────────────────────
  function finalizarEscaneo() {
    if (finalizedRef.current) return
    finalizedRef.current = true
    detenerCamara()
    cancelAnimationFrame(rafRef.current)

    const samples = samplesRef.current
    let emocionTecnica = null
    if (samples.length > 0) {
      const conteo = samples.reduce((acc, e) => {
        acc[e] = (acc[e] || 0) + 1
        return acc
      }, {})
      emocionTecnica = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0][0]
    }

    updateData({ emocion: mapearEmocion(emocionTecnica) })
    setEstado('listo')
    setTimeout(() => goTo('test'), 800)
  }

  function saltar() {
    clearInterval(frasesRef.current)
    detenerCamara()
    cancelAnimationFrame(rafRef.current)
    updateData({ emocion: null })
    goTo('test')
  }

  const ringColor = faceStatus === 'ready' ? '#C9A84C' : '#444444'
  const statusMsg = STATUS_MSG[faceStatus]

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="screen-fade min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-6">
      <div className="text-center mb-10">
        <p className="font-sans text-[#C9A84C] tracking-[0.4em] text-xs uppercase mb-3">
          Análisis biométrico
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white">
          Leyendo tu energía
        </h2>
      </div>

      {/* Contenedor video ─────────────────────────────────────────────────── */}
      <div className="relative mb-6">
        <div
          className="scan-circle rounded-full border-2 absolute"
          style={{
            inset: '-16px',
            borderColor: ringColor,
            transition: 'border-color 600ms ease',
          }}
        />
        <div
          className="spin-arc rounded-full border-2 border-transparent absolute"
          style={{
            inset: '-28px',
            borderTopColor: ringColor,
            transition: 'border-top-color 600ms ease',
          }}
        />

        <div className="w-64 h-64 rounded-full overflow-hidden bg-[#111111] relative">

          {/* Silueta guía — z=0 */}
          <svg
            viewBox="0 0 256 256"
            width="256"
            height="256"
            className="absolute inset-0"
            style={{ zIndex: 0, pointerEvents: 'none' }}
          >
            <ellipse cx="128" cy="115" rx="76" ry="94"
              stroke="#222222" strokeWidth="1.5" fill="none" />
            <ellipse cx="101" cy="97" rx="14" ry="9"
              stroke="#222222" strokeWidth="1" fill="none" />
            <ellipse cx="155" cy="97" rx="14" ry="9"
              stroke="#222222" strokeWidth="1" fill="none" />
            <path d="M128 112 L119 138 Q128 144 137 138 Z"
              stroke="#222222" strokeWidth="1" fill="none" />
            <path d="M108 158 Q128 174 148 158"
              stroke="#222222" strokeWidth="1" fill="none" />
          </svg>

          {/* Video — z=1 */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            style={{ zIndex: 1 }}
          />

          {/* Canvas landmarks + scan line — z=2 */}
          <canvas
            ref={canvasRef}
            width={256}
            height={256}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 2, pointerEvents: 'none' }}
          />

          {/* Score diagnóstico — z=3 */}
          {estado === 'escaneando' && (
            <div
              className="absolute bottom-2 left-0 right-0 text-center"
              style={{ zIndex: 3, pointerEvents: 'none' }}
            >
              <span style={{ color: '#555555', fontSize: '10px', fontFamily: 'monospace' }}>
                score: {scoreDisplay}
              </span>
            </div>
          )}

          {/* Overlay de carga — z=4 */}
          {estado === 'cargando' && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 4 }}>
              <span className="font-sans text-[#AAAAAA] text-xs tracking-widest">
                Cargando...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Barra de progreso ────────────────────────────────────────────────── */}
      {estado === 'escaneando' && (
        <div className="w-64 mb-4">
          <div className="h-px bg-[#222222] w-full">
            <div
              className="h-full bg-[#C9A84C]"
              style={{ width: `${progreso * 100}%`, transition: 'width 200ms linear' }}
            />
          </div>
        </div>
      )}

      {/* Mensaje de estado / frase rotante ───────────────────────────────── */}
      {estado === 'escaneando' && (
        <div className="h-6 flex items-center justify-center mb-4">
          {statusMsg ? (
            <p className="font-sans text-sm tracking-wider" style={{ color: '#888888' }}>
              {statusMsg}
            </p>
          ) : (
            <p
              key={fraseIdx}
              className="font-sans text-[#AAAAAA] text-xs tracking-wider screen-fade"
            >
              {FRASES[fraseIdx]}
            </p>
          )}
        </div>
      )}

      {estado === 'listo' && (
        <p className="font-sans text-[#C9A84C] text-sm tracking-widest animate-pulse">
          Energía capturada
        </p>
      )}

      {/* Saltar ───────────────────────────────────────────────────────────── */}
      {(estado === 'escaneando' || estado === 'cargando') && (
        <button
          onClick={saltar}
          className="font-sans text-[#444444] text-xs tracking-widest uppercase mt-4
                     hover:text-[#AAAAAA] transition-colors duration-400"
        >
          Omitir escaneo
        </button>
      )}
    </div>
  )
}

// ── Canvas drawing ────────────────────────────────────────────────────────────
function dibujarLandmarks(ctx, landmarks, W, H, video) {
  const rightEye = landmarks.getRightEye()
  const leftEye  = landmarks.getLeftEye()
  const mouth    = landmarks.getMouth()

  const regiones = [
    landmarks.getJawOutline(),
    landmarks.getRightEyeBrow(),
    landmarks.getLeftEyeBrow(),
    landmarks.getNose(),
    rightEye,
    leftEye,
    mouth,
  ]

  ctx.fillStyle = 'rgba(201, 168, 76, 0.8)'
  for (const p of landmarks.positions) {
    ctx.beginPath()
    ctx.arc(W - p.x, p.y, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.strokeStyle = 'rgba(201, 168, 76, 0.4)'
  ctx.lineWidth = 1

  for (const region of regiones) {
    if (!region || region.length < 2) continue
    ctx.beginPath()
    ctx.moveTo(W - region[0].x, region[0].y)
    for (let i = 1; i < region.length; i++) {
      ctx.lineTo(W - region[i].x, region[i].y)
    }
    if (region === rightEye || region === leftEye || region === mouth) {
      ctx.closePath()
    }
    ctx.stroke()
  }
}
