import { useState } from 'react'
import { questions } from '../data/questions'
import { calcularPerfil } from '../utils/olfactoryProfile'

export default function ScreenTest({ appData, updateData, goTo }) {
  const [indice, setIndice] = useState(0)
  const [respuestas, setRespuestas] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)
  const [transicionando, setTransicionando] = useState(false)

  const pregunta = questions[indice]
  const total = questions.length

  function elegir(opcion) {
    if (transicionando) return
    setSeleccionada(opcion.id)
    setTransicionando(true)

    setTimeout(() => {
      const nuevasRespuestas = [...respuestas, opcion]

      if (indice < total - 1) {
        setRespuestas(nuevasRespuestas)
        setIndice(indice + 1)
        setSeleccionada(null)
        setTransicionando(false)
      } else {
        const perfil = calcularPerfil(nuevasRespuestas, appData.emocion)
        const codsRespuestas = nuevasRespuestas.map((r, i) => `P${i + 1}:${r.id}`)
        updateData({
          respuestas: codsRespuestas,
          perfilOlfativo: perfil,
        })
        goTo('loading')
      }
    }, 400)
  }

  return (
    <div className="screen-fade min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* Header con progreso */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <div className="font-sans text-[#C9A84C] text-xs tracking-widest uppercase">
          AIVORA
        </div>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className="h-0.5 w-6 transition-all duration-400"
              style={{ backgroundColor: i < indice ? '#C9A84C' : i === indice ? '#C9A84C' : '#333333', opacity: i <= indice ? 1 : 0.4 }}
            />
          ))}
        </div>
        <div className="font-sans text-[#AAAAAA] text-xs tracking-widest">
          {indice + 1} / {total}
        </div>
      </div>

      {/* Tema */}
      <div className="text-center px-6 py-6">
        <p className="font-sans text-[#AAAAAA] text-xs tracking-[0.4em] uppercase mb-2">
          {pregunta.tema}
        </p>
        <p className="font-serif text-white text-xl">
          ¿Con cuál te identificas?
        </p>
      </div>

      {/* Opciones */}
      <div className="flex flex-1 gap-0">
        {pregunta.opciones.map(opcion => (
          <button
            key={opcion.id}
            onClick={() => elegir(opcion)}
            className="relative flex-1 overflow-hidden group"
            style={{ minHeight: '60vh' }}
          >
            {/* Imagen */}
            <img
              src={opcion.imagen}
              alt={`Opción ${opcion.id}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700
                         group-hover:scale-105"
            />

            {/* Overlay oscuro base */}
            <div className="absolute inset-0 bg-black/50 transition-opacity duration-400
                            group-hover:bg-black/30" />

            {/* Overlay seleccionado */}
            {seleccionada === opcion.id && (
              <div className="absolute inset-0 bg-[#C9A84C]/20 border-2 border-[#C9A84C]" />
            )}

            {/* Letra opción */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div
                className="w-10 h-10 rounded-full border border-[#C9A84C] flex items-center justify-center
                           font-sans text-[#C9A84C] text-sm tracking-wider
                           group-hover:bg-[#C9A84C] group-hover:text-[#0A0A0A]
                           transition-all duration-400"
              >
                {opcion.id}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Divisor central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                      w-px h-16 bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent
                      pointer-events-none" />
    </div>
  )
}
