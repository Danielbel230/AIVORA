import { useState } from 'react'

export default function ScreenEntry({ updateData, goTo, onBack }) {
  const [nombre, setNombre] = useState('')

  function handleContinuar() {
    const n = nombre.trim()
    if (!n) return
    updateData({ nombre: n })
    goTo('facescan')
  }

  return (
    <div className="screen-fade min-h-screen flex flex-col items-center justify-center px-6 bg-[#0A0A0A] relative">
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: '24px', left: '24px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#444', fontSize: '11px', letterSpacing: '0.15em',
            fontFamily: "'Courier Prime', monospace", textTransform: 'uppercase',
            transition: 'color 300ms ease', padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
          onMouseLeave={e => e.currentTarget.style.color = '#444'}
        >
          ← AIVORA
        </button>
      )}
      {/* Logo / marca */}
      <div className="mb-16 text-center">
        <p className="font-sans text-[#C9A84C] tracking-[0.5em] text-xs uppercase mb-3">
          Perfumería de Nicho
        </p>
        <h1 className="font-serif text-6xl md:text-7xl text-white tracking-widest">
          AIVORA
        </h1>
        <div className="w-16 h-px bg-[#C9A84C] mx-auto mt-4" />
      </div>

      {/* Subtítulo */}
      <div className="text-center mb-12 max-w-md">
        <p className="font-sans text-[#AAAAAA] text-sm tracking-widest uppercase mb-3">
          Espejo Olfativo Digital
        </p>
        <p className="font-sans text-[#AAAAAA] text-sm leading-relaxed">
          En tres minutos, la inteligencia artificial creará una fragancia
          construida exclusivamente desde tu esencia.
        </p>
      </div>

      {/* Input nombre */}
      <div className="w-full max-w-sm mb-8">
        <label className="block font-sans text-[#AAAAAA] text-xs tracking-widest uppercase mb-3">
          Tu nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleContinuar()}
          placeholder="Escríbelo aquí"
          className="w-full bg-transparent border-b border-[#C9A84C] text-white font-sans text-lg
                     py-3 px-0 outline-none placeholder-[#444444]
                     transition-all duration-400 focus:border-white"
          autoFocus
        />
      </div>

      {/* Botón */}
      <button
        onClick={handleContinuar}
        disabled={!nombre.trim()}
        className="btn-gold disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Comenzar experiencia
      </button>

      {/* Nota pie */}
      <p className="font-sans text-[#444444] text-xs mt-16 tracking-wider">
        Sin registro · Sin datos almacenados · 3 minutos
      </p>
    </div>
  )
}
