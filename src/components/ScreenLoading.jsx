import { useEffect, useRef, useState } from 'react'
import { useGemini } from '../hooks/useGemini'

const FRASES = [
  'Fusionando tu energía con tu instinto...',
  'Calibrando notas de fondo...',
  'Sincronizando tu firma biométrica...',
  'Tu esencia está tomando forma...',
]

const MIN_DURATION = 10000
const FRASE_INTERVAL = 2500
const NUM_PARTICLES = 24

export default function ScreenLoading({ appData, updateData, goTo }) {
  const { generarPerfume } = useGemini()
  const [fraseIdx, setFraseIdx] = useState(0)
  const startTimeRef = useRef(Date.now())
  const perfumeRef = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFraseIdx(i => (i + 1) % FRASES.length)
    }, FRASE_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const { nombre, emocion, respuestas, perfilOlfativo } = appData

    generarPerfume(nombre, emocion, respuestas, perfilOlfativo).then(resultado => {
      perfumeRef.current = resultado
      checkListo()
    })

    const minTimer = setTimeout(checkListo, MIN_DURATION)
    return () => clearTimeout(minTimer)
  }, [])

  function checkListo() {
    if (doneRef.current) return
    const elapsed = Date.now() - startTimeRef.current
    if (elapsed >= MIN_DURATION && perfumeRef.current !== undefined) {
      doneRef.current = true
      updateData({ perfume: perfumeRef.current })
      goTo('result')
    } else if (elapsed < MIN_DURATION) {
      const restante = MIN_DURATION - elapsed
      setTimeout(checkListo, restante + 100)
    }
  }

  const particles = Array.from({ length: NUM_PARTICLES }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: `${2 + Math.random() * 4}px`,
  }))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] relative overflow-hidden px-6">
      {/* Partículas doradas */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Anillo central */}
      <div className="relative mb-12">
        <div className="w-32 h-32 rounded-full border border-[#C9A84C]/30 absolute -inset-4 scan-circle" />
        <div className="w-24 h-24 rounded-full border border-[#C9A84C]/60 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#C9A84C] spin-arc" />
          <div className="absolute">
            <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
          </div>
        </div>
      </div>

      {/* Marca */}
      <p className="font-serif text-[#C9A84C] text-2xl tracking-widest mb-8">AIVORA</p>

      {/* Frase rotante */}
      <div className="h-8 flex items-center justify-center overflow-hidden">
        <p
          key={fraseIdx}
          className="font-sans text-[#AAAAAA] text-sm tracking-wider text-center screen-fade"
        >
          {FRASES[fraseIdx]}
        </p>
      </div>

      {/* Línea decorativa */}
      <div className="w-16 h-px bg-[#C9A84C]/30 mt-8" />
    </div>
  )
}
