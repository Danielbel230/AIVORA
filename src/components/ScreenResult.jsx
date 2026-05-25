import { useEffect, useRef, useState } from 'react'
import FrascoSVG from './FrascoSVG'
import TarjetaExport from './TarjetaExport'
import { descargarTarjeta } from '../utils/generarTarjeta'

const TIEMPOS = [0, 600, 1400, 2200, 3200, 4400, 5400, 6600]

// Shared font / color tokens
const CG   = "'Cormorant Garamond', Georgia, serif"
const CP   = "'Courier Prime', 'Courier New', monospace"
const GOLD = '#C9A84C'
const IVORY = '#F5F0E8'

function getProyeccion(v) {
  if (!v || v <= 3) return 'Íntima — solo quienes se acercan la perciben'
  if (v <= 6)       return 'Moderada — presente sin dominar'
  if (v <= 9)       return 'Intensa — deja rastro en cada habitación'
  return 'Máxima — firma olfativa dominante'
}

export default function ScreenResult({ appData, goTo }) {
  const { perfume } = appData
  const nombre = appData.nombre || ''
  const [paso, setPaso] = useState(0)
  const [descargando, setDescargando] = useState(false)
  const tarjetaRef = useRef(null)

  const fecha = new Date().toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  useEffect(() => {
    if (!perfume) return
    TIEMPOS.forEach((ms, index) => {
      setTimeout(() => setPaso(index), ms)
    })
  }, [perfume])

  async function handleDescargar() {
    setDescargando(true)
    await descargarTarjeta(tarjetaRef, perfume.codigo)
    setDescargando(false)
  }

  if (!perfume) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
        <p style={{ fontFamily: CP, fontSize: '11px', color: '#AAAAAA', letterSpacing: '0.3em' }}>
          GENERANDO TU FRAGANCIA...
        </p>
      </div>
    )
  }

  const intensidadPct = Math.min(Math.max((Number(perfume.intensidad) || 5) / 10, 0), 1) * 100

  const capas = [
    {
      label: 'APERTURA', sub: 'Primeros 30 min',
      note: perfume.nota_salida,   desc: perfume.apertura,
      w: '62%', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.4)',
    },
    {
      label: 'CORAZÓN',  sub: '30 min — 2 horas',
      note: perfume.nota_corazon,  desc: perfume.corazon,
      w: '80%', bg: 'rgba(201,168,76,0.05)', border: 'rgba(201,168,76,0.28)',
    },
    {
      label: 'HUELLA',   sub: '2 — 8 horas',
      note: perfume.nota_fondo,    desc: perfume.huella,
      w: '100%', bg: 'rgba(201,168,76,0.03)', border: 'rgba(201,168,76,0.18)',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'stretch', background: '#0A0A0A' }}>

      {/* ── CABECERA DEL DOCUMENTO ───────────────────────────────────── */}
      <div style={{
        width: '100%',
        borderTop: `1px solid ${GOLD}`,
        borderBottom: `1px solid ${GOLD}`,
        padding: '12px 0',
        textAlign: 'center',
        flexShrink: 0,
        marginBottom: '52px',
      }}>
        <span style={{ fontFamily: CP, fontSize: '10px', letterSpacing: '0.35em', color: GOLD }}>
          AIVORA&nbsp;&nbsp;✦&nbsp;&nbsp;MAISON DE PARFUM
        </span>
      </div>

      {/* ── CONTENIDO ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px 60px' }}>

        {/* BLOQUE 1 — CERTIFICADO DE IDENTIDAD */}
        <Reveal visible={paso >= 1}>
          <div style={{ textAlign: 'center', marginBottom: '52px', width: '100%', maxWidth: '600px' }}>
            <p style={{ fontFamily: CP, fontSize: '13px', color: '#555555', letterSpacing: '0.25em', marginBottom: '28px' }}>
              CERTIFICAT DE PARFUM N°&nbsp;{perfume.codigo}
            </p>
            <h1 style={{
              fontFamily: CG,
              fontSize: 'clamp(44px, 7vw, 72px)',
              fontWeight: 300,
              color: IVORY,
              letterSpacing: '4px',
              lineHeight: 1.15,
              margin: '0 0 24px',
            }}>
              <TypewriterText text={perfume.nombre_perfume} active={paso >= 1} />
            </h1>
            <p style={{ fontFamily: CP, fontSize: '14px', color: GOLD, letterSpacing: '0.25em', marginBottom: '28px' }}>
              — ENERGÍA DETECTADA:&nbsp;{(perfume.firma_biometrica || '').toUpperCase()}&nbsp;—
            </p>
            <Ornament />
          </div>
        </Reveal>

        {/* BLOQUE 2 — PERFIL DE IDENTIDAD */}
        <Reveal visible={paso >= 2}>
          <div style={{ textAlign: 'center', maxWidth: '480px', marginBottom: '52px' }}>
            <p style={{
              fontFamily: CG,
              fontSize: 'clamp(17px, 3vw, 20px)',
              fontStyle: 'italic',
              color: IVORY,
              lineHeight: 1.9,
              marginBottom: '16px',
            }}>
              {perfume.personalidad}
            </p>
            <p style={{ fontFamily: CP, fontSize: '14px', color: GOLD, letterSpacing: '0.15em' }}>
              {perfume.por_que_este_perfume}
            </p>
          </div>
        </Reveal>

        {/* BLOQUE 3 — FICHA TÉCNICA */}
        <Reveal visible={paso >= 3}>
          <div style={{
            width: '100%',
            maxWidth: '560px',
            marginBottom: '52px',
            border: '1px solid rgba(201,168,76,0.22)',
            boxShadow: '0 0 40px rgba(201,168,76,0.05)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1.7fr' }}>
              {/* FAMILLE */}
              <div style={{ padding: '22px 16px', textAlign: 'center' }}>
                <p style={{ fontFamily: CP, fontSize: '12px', color: '#555555', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Famille
                </p>
                <p style={{ fontFamily: CG, fontSize: '22px', color: GOLD }}>
                  {perfume.familia_olfativa}
                </p>
              </div>
              <div style={{ background: 'rgba(201,168,76,0.2)' }} />
              {/* DURÉE */}
              <div style={{ padding: '22px 16px', textAlign: 'center' }}>
                <p style={{ fontFamily: CP, fontSize: '12px', color: '#555555', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Durée
                </p>
                <p style={{ fontFamily: CG, fontSize: '22px', color: GOLD }}>
                  {perfume.duracion}
                </p>
              </div>
              <div style={{ background: 'rgba(201,168,76,0.2)' }} />
              {/* PROJECTION */}
              <div style={{ padding: '22px 16px' }}>
                <p style={{ fontFamily: CP, fontSize: '12px', color: '#555555', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Projection
                </p>
                <div style={{ height: '2px', background: '#1A1A1A', marginBottom: '8px' }}>
                  <div style={{
                    height: '100%',
                    background: GOLD,
                    width: paso >= 3 ? `${intensidadPct}%` : '0%',
                    transition: 'width 1.5s ease',
                  }} />
                </div>
                <p style={{ fontFamily: CP, fontSize: '11px', color: '#666666', letterSpacing: '0.03em', lineHeight: 1.4 }}>
                  {getProyeccion(perfume.intensidad)}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* BLOQUE 4 — PIRÁMIDE OLFATIVA */}
        <Reveal visible={paso >= 4}>
          <div style={{ width: '100%', maxWidth: '600px', marginBottom: '52px' }}>
            <p style={{ fontFamily: CP, fontSize: '10px', color: GOLD, letterSpacing: '0.28em', textAlign: 'center', marginBottom: '20px' }}>
              ✦&nbsp;&nbsp;COMPOSITION OLFACTIVE&nbsp;&nbsp;✦
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {capas.map((capa, i) => (
                <div key={i} style={{
                  width: capa.w,
                  marginTop: i > 0 ? '-1px' : 0,
                  position: 'relative',
                  zIndex: capas.length - i,
                }}>
                  <div style={{
                    border: `1px solid ${capa.border}`,
                    background: capa.bg,
                    padding: '18px 22px',
                    display: 'grid',
                    gridTemplateColumns: '38% 62%',
                    gap: '12px',
                    alignItems: 'start',
                  }}>
                    <div style={{ paddingTop: '2px' }}>
                      <p style={{ fontFamily: CP, fontSize: '12px', color: '#666666', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {capa.label}
                      </p>
                      <p style={{ fontFamily: CP, fontSize: '11px', color: '#333333' }}>
                        {capa.sub}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontFamily: CG, fontSize: '18px', color: GOLD, marginBottom: '6px' }}>
                        {capa.note}
                      </p>
                      <p style={{ fontFamily: CG, fontSize: '14px', fontStyle: 'italic', color: IVORY, lineHeight: 1.7 }}>
                        {capa.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* BLOQUE 5 — SELLO DE IDENTIDAD */}
        <Reveal visible={paso >= 5}>
          <div style={{ textAlign: 'center', maxWidth: '440px', marginBottom: '52px' }}>
            <div style={{ marginBottom: '24px' }}><Ornament /></div>
            <p style={{ fontFamily: CP, fontSize: '10px', color: '#555555', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '24px' }}>
              Votre Empreinte
            </p>
            <div style={{ fontFamily: CG, fontSize: '96px', color: GOLD, lineHeight: 0.6, marginBottom: '8px', userSelect: 'none' }}>
              &ldquo;
            </div>
            <p style={{
              fontFamily: CG,
              fontSize: 'clamp(24px, 4.5vw, 32px)',
              fontWeight: 300,
              color: IVORY,
              lineHeight: 1.5,
            }}>
              {perfume.frase_identidad}
            </p>
            <div style={{ fontFamily: CG, fontSize: '96px', color: GOLD, lineHeight: 0.6, marginTop: '8px', userSelect: 'none' }}>
              &rdquo;
            </div>
          </div>
        </Reveal>

        {/* BLOQUE 6 — DEDICATORIA PERSONAL */}
        <Reveal visible={paso >= 6}>
          <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ height: '1px', background: 'rgba(201,168,76,0.3)', marginBottom: '36px' }} />
            <p style={{
              fontFamily: CG,
              fontSize: '17px',
              fontStyle: 'italic',
              color: '#888888',
              lineHeight: 1.8,
              marginBottom: nombre ? '16px' : '0',
            }}>
              Esta fragancia fue creada exclusivamente para
            </p>
            {nombre && (
              <p style={{
                fontFamily: CG,
                fontSize: 'clamp(28px, 5vw, 40px)',
                fontWeight: 300,
                color: IVORY,
                letterSpacing: '4px',
                marginBottom: '12px',
              }}>
                {nombre}
              </p>
            )}
            <p style={{ fontFamily: CP, fontSize: '13px', color: '#444444', letterSpacing: '0.15em' }}>
              {fecha}
            </p>
            <div style={{ height: '1px', background: 'rgba(201,168,76,0.3)', marginTop: '36px' }} />
          </div>
        </Reveal>

        {/* BLOQUE 7 — FRASCO + BOTONES */}
        <Reveal visible={paso >= 7}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}>
            <FrascoSVG colorHex={perfume.color_hex} codigo={perfume.codigo} />
            <p style={{ fontFamily: CP, fontSize: '10px', color: '#333333', letterSpacing: '0.3em', marginTop: '12px' }}>
              {perfume.codigo}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={handleDescargar}
                disabled={descargando}
                className="btn-document"
              >
                {descargando ? 'Generando...' : 'Descargar mi fragancia'}
              </button>
              <button onClick={() => goTo('capture')} className="btn-document-secondary">
                Asegurar mi lugar VIP
              </button>
            </div>
          </div>
        </Reveal>

      </div>

      {/* ── PIE DEL DOCUMENTO ────────────────────────────────────────── */}
      <div style={{
        width: '100%',
        borderTop: `1px solid rgba(201,168,76,0.4)`,
        borderBottom: `1px solid rgba(201,168,76,0.4)`,
        padding: '12px 0',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <p style={{ fontFamily: CP, fontSize: '13px', color: '#333333', letterSpacing: '0.2em' }}>
          AIVORA&nbsp;&nbsp;✦&nbsp;&nbsp;INTELIGENCIA ARTIFICIAL&nbsp;·&nbsp;ATENCIÓN HUMANA&nbsp;·&nbsp;ESENCIA ÚNICA
        </p>
      </div>

      <TarjetaExport ref={tarjetaRef} perfume={perfume} nombre={nombre} fecha={fecha} />
    </div>
  )
}

// ── Helper components ─────────────────────────────────────────────────────────

function TypewriterText({ text, active }) {
  return (
    <>
      {(text || '').split('').map((char, i) => (
        <span
          key={i}
          style={{
            opacity: active ? 1 : 0,
            transition: 'opacity 80ms linear',
            transitionDelay: active ? `${i * 60}ms` : '0ms',
          }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </>
  )
}

function Ornament() {
  return (
    <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.08em', textAlign: 'center', margin: 0, fontFamily: 'Georgia, serif' }}>
      {'◆'}&nbsp;{'─'.repeat(10)}&nbsp;{'◆'}&nbsp;{'─'.repeat(10)}&nbsp;{'◆'}
    </p>
  )
}

function Reveal({ visible, children }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {children}
    </div>
  )
}
