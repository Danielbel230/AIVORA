import { forwardRef } from 'react'

const CG   = "'Cormorant Garamond', Georgia, serif"
const CP   = "'Courier Prime', 'Courier New', monospace"
const GOLD = '#C9A84C'
const IVORY = '#F5F0E8'

const TarjetaExport = forwardRef(function TarjetaExport({ perfume, nombre, fecha }, ref) {
  if (!perfume) return null

  const intensidadPct = Math.min(Math.max((Number(perfume.intensidad) || 5) / 10, 0), 1) * 100

  const notas = [
    { label: 'APERTURA', sub: 'Primeros 30 min', note: perfume.nota_salida,  desc: perfume.apertura,  w: '62%', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.4)'  },
    { label: 'CORAZÓN',  sub: '30 min — 2 h',   note: perfume.nota_corazon, desc: perfume.corazon,   w: '80%', bg: 'rgba(201,168,76,0.05)', border: 'rgba(201,168,76,0.28)' },
    { label: 'HUELLA',   sub: '2 — 8 horas',    note: perfume.nota_fondo,   desc: perfume.huella,    w: '100%',bg: 'rgba(201,168,76,0.03)', border: 'rgba(201,168,76,0.18)' },
  ]

  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1920px',
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        fontFamily: CG,
        position: 'fixed',
        left: '-9999px',
        top: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Top border */}
      <div style={{ height: '1px', background: GOLD, flexShrink: 0 }} />

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${GOLD}`,
        padding: '18px 0',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: CP, fontSize: '16px', letterSpacing: '8px', color: GOLD }}>
          AIVORA&nbsp;&nbsp;✦&nbsp;&nbsp;MAISON DE PARFUM
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '56px 80px 40px',
        boxSizing: 'border-box',
      }}>

        {/* Certificado */}
        <p style={{ fontFamily: CP, fontSize: '14px', letterSpacing: '4px', color: '#555555', marginBottom: '24px' }}>
          CERTIFICAT DE PARFUM N°&nbsp;{perfume.codigo}
        </p>

        {/* Nombre */}
        <p style={{
          fontFamily: CG, fontSize: '70px', fontWeight: 300,
          color: IVORY, letterSpacing: '4px', textAlign: 'center',
          lineHeight: 1.15, marginBottom: '22px',
        }}>
          {perfume.nombre_perfume}
        </p>

        {/* Firma biométrica */}
        <p style={{ fontFamily: CP, fontSize: '14px', color: GOLD, letterSpacing: '6px', marginBottom: '32px' }}>
          — {(perfume.firma_biometrica || '').toUpperCase()} —
        </p>

        {/* Ornament */}
        <p style={{ color: GOLD, fontSize: '18px', letterSpacing: '4px', marginBottom: '36px', fontFamily: 'Georgia, serif' }}>
          {'◆'}&nbsp;{'─'.repeat(12)}&nbsp;{'◆'}&nbsp;{'─'.repeat(12)}&nbsp;{'◆'}
        </p>

        {/* Personalidad */}
        <p style={{
          fontFamily: CG, fontSize: '25px', fontStyle: 'italic',
          color: IVORY, lineHeight: 1.7, textAlign: 'center',
          marginBottom: '14px', maxWidth: '880px',
        }}>
          {perfume.personalidad}
        </p>
        <p style={{
          fontFamily: CP, fontSize: '15px', color: GOLD,
          letterSpacing: '1px', textAlign: 'center',
          marginBottom: '44px', maxWidth: '880px',
        }}>
          {perfume.por_que_este_perfume}
        </p>

        {/* Ficha técnica */}
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr 1px 1.6fr',
          border: '1px solid rgba(201,168,76,0.28)',
          marginBottom: '40px',
        }}>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontFamily: CP, fontSize: '12px', letterSpacing: '4px', color: '#555555', marginBottom: '10px' }}>FAMILLE</p>
            <p style={{ fontFamily: CG, fontSize: '24px', color: GOLD }}>{perfume.familia_olfativa}</p>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.2)' }} />
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontFamily: CP, fontSize: '12px', letterSpacing: '4px', color: '#555555', marginBottom: '10px' }}>DURÉE</p>
            <p style={{ fontFamily: CG, fontSize: '24px', color: GOLD }}>{perfume.duracion}</p>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.2)' }} />
          <div style={{ padding: '24px' }}>
            <p style={{ fontFamily: CP, fontSize: '12px', letterSpacing: '4px', color: '#555555', marginBottom: '10px' }}>PROJECTION</p>
            <div style={{ height: '2px', background: '#1A1A1A', marginBottom: '8px' }}>
              <div style={{ height: '100%', background: GOLD, width: `${intensidadPct}%` }} />
            </div>
          </div>
        </div>

        {/* Pirámide olfativa — stepped rectangles */}
        <p style={{ fontFamily: CP, fontSize: '13px', color: GOLD, letterSpacing: '6px', marginBottom: '22px' }}>
          ✦&nbsp;&nbsp;COMPOSITION OLFACTIVE&nbsp;&nbsp;✦
        </p>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
          {notas.map((n, i) => (
            <div key={i} style={{ width: n.w, marginTop: i > 0 ? '-1px' : 0, position: 'relative', zIndex: notas.length - i }}>
              <div style={{
                border: `1px solid ${n.border}`,
                background: n.bg,
                padding: '20px 26px',
                display: 'grid',
                gridTemplateColumns: '35% 65%',
                gap: '16px',
                alignItems: 'start',
              }}>
                <div>
                  <p style={{ fontFamily: CP, fontSize: '12px', color: '#666666', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '6px' }}>{n.label}</p>
                  <p style={{ fontFamily: CP, fontSize: '11px', color: '#333333' }}>{n.sub}</p>
                </div>
                <div>
                  <p style={{ fontFamily: CG, fontSize: '24px', color: GOLD, marginBottom: '8px' }}>{n.note}</p>
                  <p style={{ fontFamily: CG, fontSize: '18px', fontStyle: 'italic', color: IVORY, lineHeight: 1.5 }}>{n.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Frase de identidad */}
        <div style={{ textAlign: 'center', maxWidth: '860px', marginBottom: '44px' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '80px', color: GOLD, lineHeight: 0.7, marginBottom: '10px' }}>&ldquo;</div>
          <p style={{ fontFamily: CG, fontSize: '38px', fontWeight: 300, color: IVORY, lineHeight: 1.4 }}>
            {perfume.frase_identidad}
          </p>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '80px', color: GOLD, lineHeight: 0.7, marginTop: '10px' }}>&rdquo;</div>
        </div>

        {/* Dedicatoria */}
        <div style={{ width: '100%', textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ height: '1px', background: 'rgba(201,168,76,0.3)', marginBottom: '30px' }} />
          <p style={{ fontFamily: CG, fontSize: '22px', fontStyle: 'italic', color: '#888888', marginBottom: '14px' }}>
            Esta fragancia fue creada exclusivamente para
          </p>
          {nombre && (
            <p style={{ fontFamily: CG, fontSize: '42px', fontWeight: 300, color: IVORY, letterSpacing: '4px', marginBottom: '12px' }}>
              {nombre}
            </p>
          )}
          <p style={{ fontFamily: CP, fontSize: '14px', color: '#444444', letterSpacing: '4px' }}>
            {fecha}
          </p>
          <div style={{ height: '1px', background: 'rgba(201,168,76,0.3)', marginTop: '30px' }} />
        </div>

        {/* Código al pie */}
        <p style={{ fontFamily: CP, fontSize: '14px', color: '#333333', letterSpacing: '6px', marginTop: 'auto' }}>
          {perfume.codigo}&nbsp;&nbsp;·&nbsp;&nbsp;aivora.co
        </p>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${GOLD}`,
        padding: '16px 0',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: CP, fontSize: '13px', letterSpacing: '5px', color: '#333333' }}>
          AIVORA&nbsp;&nbsp;✦&nbsp;&nbsp;MAISON DE PARFUM
        </span>
      </div>

      {/* Bottom border */}
      <div style={{ height: '1px', background: GOLD, flexShrink: 0 }} />
    </div>
  )
})

export default TarjetaExport
