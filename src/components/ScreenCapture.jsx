import { useState } from 'react'
import { submitLead } from '../utils/sheetsSubmit'

export default function ScreenCapture({ appData }) {
  const [whatsapp, setWhatsapp] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const { perfume, perfilOlfativo } = appData

  const notaDominante = perfume
    ? Object.entries(perfilOlfativo).sort((a, b) => b[1] - a[1])[0]?.[0]
    : ''

  async function handleEnviar() {
    const num = whatsapp.trim()
    if (!num || enviando) return
    setEnviando(true)

    await submitLead({
      nombre: appData.nombre,
      whatsapp: num,
      emocion: appData.emocion,
      perfilOlfativo: appData.perfilOlfativo,
      notaDominante,
      perfume: appData.perfume,
    })

    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="screen-fade min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-6 text-center">
        <div className="w-16 h-16 rounded-full border border-[#C9A84C] flex items-center justify-center mb-8">
          <span className="text-[#C9A84C] text-2xl">✦</span>
        </div>
        <h2 className="font-serif text-3xl text-white mb-4">
          Tu fragancia está en camino
        </h2>
        <p className="font-sans text-[#AAAAAA] text-sm leading-relaxed max-w-xs mb-2">
          En breve recibirás los detalles de{' '}
          <span className="text-[#C9A84C]">{perfume?.nombre_perfume}</span>{' '}
          por WhatsApp.
        </p>
        <div className="w-16 h-px bg-[#C9A84C]/40 my-8" />
        <p className="font-serif text-[#AAAAAA] text-sm italic">
          &ldquo;{perfume?.frase_identidad}&rdquo;
        </p>
        <p className="font-sans text-[#333333] text-xs tracking-widest mt-12">
          AIVORA · Perfumería de Nicho
        </p>
      </div>
    )
  }

  return (
    <div className="screen-fade min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-6">
      <div className="text-center mb-12">
        <p className="font-sans text-[#C9A84C] tracking-[0.4em] text-xs uppercase mb-3">
          Último paso
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
          Recibe tu fragancia
        </h2>
        <p className="font-sans text-[#AAAAAA] text-sm leading-relaxed max-w-xs mx-auto">
          Déjanos tu WhatsApp y te enviamos la ficha completa de{' '}
          <span className="text-[#C9A84C] italic">{perfume?.nombre_perfume}</span>.
        </p>
      </div>

      {/* Input WhatsApp */}
      <div className="w-full max-w-sm mb-8">
        <label className="block font-sans text-[#AAAAAA] text-xs tracking-widest uppercase mb-3">
          WhatsApp (con código de país)
        </label>
        <input
          type="tel"
          value={whatsapp}
          onChange={e => setWhatsapp(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleEnviar()}
          placeholder="+52 55 1234 5678"
          className="w-full bg-transparent border-b border-[#C9A84C] text-white font-sans text-lg
                     py-3 px-0 outline-none placeholder-[#444444]
                     transition-all duration-400 focus:border-white"
          autoFocus
        />
      </div>

      <button
        onClick={handleEnviar}
        disabled={!whatsapp.trim() || enviando}
        className="btn-gold disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {enviando ? 'Enviando...' : 'Enviar'}
      </button>

      <p className="font-sans text-[#333333] text-xs tracking-wider mt-8 text-center max-w-xs">
        Solo para enviarte tu fragancia. Sin spam. Sin listas.
      </p>
    </div>
  )
}
