import { useState, useEffect, useRef } from 'react'
import FrascoSVG from './FrascoSVG'
import logo from '../assets/images/logo.jpeg'

const GOLD = '#C9A84C'
const IVORY = '#F5F0E8'
const BG = '#0A0A0A'

function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

function reveal(visible, delay = 0) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  }
}

const PILLARS = [
  { title: 'INTELIGENCIA ARTIFICIAL', text: 'IA que genera tu perfume único basada en tu personalidad y energía biométrica.', delay: 0 },
  { title: 'ATENCIÓN HUMANA',         text: 'Un asesor real te acompaña en el showroom para materializar tu fragancia.',       delay: 100 },
  { title: 'ESENCIA ÚNICA',           text: '64 perfiles posibles. Ningún perfume se repite. El tuyo es irrepetible.',          delay: 200 },
]

const STEPS = [
  { num: '01', title: 'Tu nombre',    desc: 'El punto de partida. Todo lo que sigue lleva tu firma.' },
  { num: '02', title: 'Tu energía',   desc: 'La cámara lee tus microexpresiones. Tu estado emocional define las notas base.' },
  { num: '03', title: 'Tu instinto',  desc: '6 decisiones visuales. Sin pensar. Tu inconsciente elige mejor que tu razón.' },
  { num: '04', title: 'Tu fragancia', desc: 'La IA crea algo que no existía. Solo tuyo. Solo ahora.' },
]

function StepIcon({ num }) {
  const p = { fill: 'none', stroke: GOLD, strokeWidth: '1', strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (num === '01') return (
    <svg width="32" height="32" viewBox="0 0 32 32" {...p}>
      <path d="M7 25L21 11M19 9l4 4M7 25l-2 2 2 2 2-2Z" />
      <line x1="5" y1="28" x2="27" y2="28" />
    </svg>
  )
  if (num === '02') return (
    <svg width="32" height="32" viewBox="0 0 32 32" {...p}>
      <path d="M4 16c4-8 20-8 24 0c-4 8-20 8-24 0z" />
      <circle cx="16" cy="16" r="4" />
      <circle cx="16" cy="16" r="1.5" fill={GOLD} stroke="none" />
    </svg>
  )
  if (num === '03') return (
    <svg width="32" height="32" viewBox="0 0 32 32" {...p}>
      <rect x="2" y="7" width="12" height="18" rx="1" />
      <rect x="18" y="7" width="12" height="18" rx="1" />
      <line x1="14" y1="16" x2="18" y2="16" />
    </svg>
  )
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" {...p}>
      <rect x="11" y="2" width="10" height="5" rx="1" />
      <path d="M11 7v4L5 15v13a2 2 0 002 2h18a2 2 0 002-2V15l-6-4V7" />
    </svg>
  )
}

export default function LandingPage({ onStart }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const [heroRef,    heroV]    = useReveal(0.01)
  const [visionRef,  visionV]  = useReveal()
  const [pillarsRef, pillarsV] = useReveal()
  const [frascoRef,  frascoV]  = useReveal()
  const [expRef,     expV]     = useReveal()
  const [stepsRef,   stepsV]   = useReveal()
  const [ctaRef,     ctaV]     = useReveal()

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <style>{`
        .lp-nav-link {
          background: none; border: none; color: #666;
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          cursor: pointer; font-family: 'Courier Prime', monospace;
          transition: color 300ms ease; padding: 0;
        }
        .lp-nav-link:hover { color: ${GOLD}; }
        .lp-nav-cta {
          border: 1px solid ${GOLD}; color: ${GOLD}; background: transparent;
          padding: 8px 20px; font-size: 11px; letter-spacing: 0.15em;
          text-transform: uppercase; cursor: pointer;
          font-family: 'Courier Prime', monospace;
          transition: background 300ms ease, color 300ms ease; border-radius: 0;
        }
        .lp-nav-cta:hover { background: ${GOLD}; color: ${BG}; }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
        .lp-scroll-arrow { animation: bounceDown 1.5s ease-in-out infinite; display: inline-block; }
        @media (max-width: 768px) {
          .lp-nav-inner   { justify-content: flex-end !important; }
          .lp-logo-img    { position: absolute; left: 50%; transform: translateX(-50%); }
          .lp-nav-desktop { display: none !important; }
          .lp-hamburger   { display: flex !important; }
          .lp-hero-layout { flex-direction: column !important; align-items: stretch !important; padding-top: 100px !important; padding-bottom: 60px !important; }
          .lp-hero-left   { width: 100% !important; padding: 0 24px !important; order: 2; }
          .lp-hero-right  { width: 100% !important; order: 1; display: flex; justify-content: center; align-items: center; padding: 24px 0 !important; }
          .lp-hero-visual { width: 260px !important; max-width: 260px !important; }
          .lp-hero-title  { font-size: 44px !important; }
          .lp-hero-para   { font-size: 17px !important; }
          .lp-float-block  { display: none !important; }
          .lp-cardinal-label { display: none !important; }
          .lp-hero-cta-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .lp-metric-num  { font-size: 32px !important; }
          .lp-metric      { padding: 0 10px !important; }
          .lp-pillars-grid { grid-template-columns: 1fr !important; }
          .lp-pillar-sep   { border-right: none !important; border-bottom: 1px solid #1A1A1A !important; }
          .lp-footer-grid  { grid-template-columns: 1fr !important; gap: 16px !important; }
          .lp-footer-right { text-align: center !important; }
          .lp-vision-title { font-size: 40px !important; }
          .lp-exp-title    { font-size: 40px !important; }
          .lp-cta-title    { font-size: 56px !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="lp-nav-inner" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: BG, borderBottom: '1px solid #1A1A1A',
        padding: '20px 40px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <img
          src={logo}
          alt="Aivora"
          className="lp-logo-img"
          style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
        />

        <div className="lp-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <button className="lp-nav-link" onClick={() => scrollTo('vision')}>Nuestra Visión</button>
          <button className="lp-nav-link" onClick={() => scrollTo('experiencia')}>La Experiencia</button>
          <button className="lp-nav-cta" onClick={onStart}>Encuentra tu Identidad</button>
        </div>

        <button
          className="lp-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menú"
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: '5px', padding: '4px' }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: '22px', height: '1px', background: GOLD, transition: '300ms',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(4px, 4px)'
                : i === 1 ? 'scaleX(0)'
                : 'rotate(-45deg) translate(4px, -4px)'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '81px', left: 0, right: 0, zIndex: 99,
          background: BG, borderBottom: '1px solid #1A1A1A',
          padding: '20px 40px', display: 'flex', flexDirection: 'column',
        }}>
          <button className="lp-nav-link" onClick={() => scrollTo('vision')} style={{ padding: '16px 0', borderBottom: '1px solid #111', textAlign: 'left' }}>
            Nuestra Visión
          </button>
          <button className="lp-nav-link" onClick={() => scrollTo('experiencia')} style={{ padding: '16px 0', borderBottom: '1px solid #111', textAlign: 'left' }}>
            La Experiencia
          </button>
          <button className="btn-document" onClick={() => { setMenuOpen(false); onStart() }} style={{ marginTop: '16px', width: '100%' }}>
            Encuentra tu Identidad
          </button>
        </div>
      )}

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {/* Radial gradient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)',
        }} />

        {/* SVG diagonal lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <pattern id="hero-diag" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <line x1="0" y1="80" x2="80" y2="0" stroke="rgba(201,168,76,0.08)" strokeWidth="0.5" />
              <line x1="-80" y1="80" x2="0" y2="0" stroke="rgba(201,168,76,0.08)" strokeWidth="0.5" />
              <line x1="80" y1="80" x2="160" y2="0" stroke="rgba(201,168,76,0.08)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-diag)" />
        </svg>

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '600px', height: '600px', marginLeft: '-300px', marginTop: '-300px', border: '1px solid rgba(201,168,76,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '360px', height: '360px', marginLeft: '-180px', marginTop: '-180px', border: '1px solid rgba(201,168,76,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
        {[
          { top: 'calc(50% - 182px)', left: 'calc(50% - 2px)' },
          { top: 'calc(50% + 178px)', left: 'calc(50% - 2px)' },
          { top: 'calc(50% - 2px)',   left: 'calc(50% + 178px)' },
          { top: 'calc(50% - 2px)',   left: 'calc(50% - 182px)' },
        ].map((pos, i) => (
          <div key={i} style={{ position: 'absolute', ...pos, width: '4px', height: '4px', background: 'rgba(201,168,76,0.3)', borderRadius: '50%', pointerEvents: 'none' }} />
        ))}

        {/* Content */}
        <div className="lp-hero-layout" style={{
          position: 'relative', zIndex: 1, width: '100%',
          display: 'flex', alignItems: 'center',
          paddingTop: '80px',
        }}>
          {/* Left column */}
          <div className="lp-hero-left" style={{ width: '55%', paddingLeft: '8vw', paddingRight: '4vw' }}>
            <div style={reveal(heroV, 0)}>
              <img src={logo} alt="Aivora" style={{ height: '40px', width: 'auto', objectFit: 'contain', marginBottom: '40px', display: 'block' }} />
            </div>

            <p className="font-courier" style={{ ...reveal(heroV, 50), color: GOLD, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '24px' }}>
              ✦&nbsp;&nbsp;MAISON DE PARFUM INTELLIGENT&nbsp;&nbsp;✦
            </p>

            <h1 className="font-cormorant lp-hero-title" style={{
              ...reveal(heroV, 150),
              color: IVORY, fontWeight: 300, lineHeight: 1.05,
              fontSize: 'clamp(44px, 8.5vw, 120px)',
              marginBottom: '32px',
            }}>
              La fragancia<br />que eres tú.
            </h1>

            <p className="font-cormorant lp-hero-para" style={{
              ...reveal(heroV, 250),
              fontStyle: 'italic', color: '#777', lineHeight: 1.8,
              maxWidth: '420px', marginBottom: '48px',
              fontSize: 'clamp(17px, 1.5vw, 22px)',
            }}>
              No vendemos perfumes. Creamos tu firma olfativa única usando inteligencia artificial y biometría real. Tu aroma aún no existe.
            </p>

            <div className="lp-hero-cta-row" style={{ ...reveal(heroV, 350), display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '64px' }}>
              <button className="btn-document" onClick={onStart} style={{ padding: '16px 40px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                Descubrir mi esencia
              </button>
              <span className="font-courier" style={{ color: '#444', fontSize: '10px', letterSpacing: '0.05em' }}>
                3 min &nbsp;·&nbsp; Gratuito &nbsp;·&nbsp; Irrepetible
              </span>
            </div>

            {/* Metrics */}
            <div style={{ ...reveal(heroV, 450), display: 'flex', alignItems: 'stretch', borderTop: '1px solid #1A1A1A', paddingTop: '32px' }}>
              <div className="lp-metric" style={{ flex: 1, textAlign: 'center', padding: '0 20px' }}>
                <p className="font-cormorant lp-metric-num" style={{ color: IVORY, fontWeight: 300, lineHeight: 1, fontSize: '48px' }}>64</p>
                <p className="font-courier" style={{ color: '#444', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '8px' }}>PERFILES{'\n'}ÚNICOS</p>
              </div>
              <div style={{ width: '1px', background: GOLD, opacity: 0.2 }} />
              <div className="lp-metric" style={{ flex: 1, textAlign: 'center', padding: '0 20px' }}>
                <p className="font-cormorant lp-metric-num" style={{ color: IVORY, fontWeight: 300, lineHeight: 1, fontSize: '48px' }}>∞</p>
                <p className="font-courier" style={{ color: '#444', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '8px' }}>COMBINACIONES{'\n'}POSIBLES</p>
              </div>
              <div style={{ width: '1px', background: GOLD, opacity: 0.2 }} />
              <div className="lp-metric" style={{ flex: 1, textAlign: 'center', padding: '0 20px' }}>
                <p className="font-cormorant lp-metric-num" style={{ color: IVORY, fontWeight: 300, lineHeight: 1, fontSize: '48px' }}>3 min</p>
                <p className="font-courier" style={{ color: '#444', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '8px' }}>EXPERIENCIA</p>
              </div>
            </div>
          </div>

          {/* Right column — visual */}
          <div className="lp-hero-right" style={{ width: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: '4vw' }}>
            <div className="lp-hero-visual" style={{ ...reveal(heroV, 200), position: 'relative', width: '100%', maxWidth: '400px', aspectRatio: '1 / 1' }}>
              {/* Spinning circles */}
              <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(201,168,76,0.2)', borderRadius: '50%', animation: 'spin 20s linear infinite' }} />
              <div style={{ position: 'absolute', inset: '15%', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '50%', animation: 'spin 15s linear infinite reverse' }} />

              {/* Centered frasco */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 0 40px rgba(201,168,76,0.3))' }}>
                <FrascoSVG colorHex="#C9A84C" />
              </div>

              {/* Cardinal labels */}
              <span className="font-courier lp-cardinal-label" style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', color: GOLD, fontSize: '9px', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>BERGAMOTA</span>
              <span className="font-courier lp-cardinal-label" style={{ position: 'absolute', right: '-36px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: GOLD, fontSize: '9px', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>SÁNDALO</span>
              <span className="font-courier lp-cardinal-label" style={{ position: 'absolute', bottom: '-16px', left: '50%', transform: 'translateX(-50%)', color: GOLD, fontSize: '9px', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>ÁMBAR</span>
              <span className="font-courier lp-cardinal-label" style={{ position: 'absolute', left: '-36px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', color: GOLD, fontSize: '9px', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>MUSGO</span>

              {/* Floating data blocks */}
              {[
                { top: '10%',  right: '-5%',  label: 'APERTURA', note: 'Bergamota',  delay: '0s' },
                { top: '45%',  right: '-10%', label: 'CORAZÓN',  note: 'Sándalo',    delay: '1.5s' },
                { top: '75%',  right: '-5%',  label: 'HUELLA',   note: 'Ámbar Gris', delay: '3s' },
              ].map(b => (
                <div key={b.label} className="lp-float-block" style={{
                  position: 'absolute', top: b.top, right: b.right,
                  background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
                  padding: '8px 12px', animation: `float 4s ease-in-out ${b.delay} infinite`,
                }}>
                  <p className="font-courier" style={{ color: '#555', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>{b.label}</p>
                  <p className="font-cormorant" style={{ color: GOLD, fontSize: '14px' }}>{b.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
          <span className="font-courier" style={{ color: '#333', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Descubre más</span>
          <span className="lp-scroll-arrow" style={{ color: '#444', fontSize: '18px' }}>↓</span>
        </div>
      </section>

      {/* ── NUESTRA VISIÓN ── */}
      <section id="vision" style={{ padding: '120px 40px', background: BG }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div ref={visionRef} style={{ textAlign: 'center' }}>
            <p style={{ ...reveal(visionV, 0), color: GOLD, letterSpacing: '0.1em', fontSize: '14px' }}>◆ ────── ◆ ────── ◆</p>
            <p className="font-courier" style={{ ...reveal(visionV, 100), color: GOLD, fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '24px' }}>
              NUESTRA VISIÓN
            </p>
            <h2 className="font-cormorant lp-vision-title" style={{
              ...reveal(visionV, 200),
              color: IVORY, fontWeight: 300,
              fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1.3, marginTop: '24px',
            }}>
              "Es casi imposible copiar una experiencia."
            </h2>
            <p className="font-cormorant" style={{
              ...reveal(visionV, 300),
              fontStyle: 'italic', fontSize: '22px', color: '#888',
              lineHeight: 2, marginTop: '24px',
            }}>
              Cualquiera puede copiar un perfume. Nadie puede copiar el momento en que la inteligencia artificial leyó tu energía, analizó tu instinto y creó algo que no existía antes de que tú llegaras.
            </p>
          </div>

          {/* Three frascos */}
          <div ref={frascoRef} style={{
            ...reveal(frascoV, 0),
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
            gap: '48px', margin: '72px 0 48px', height: '240px', overflow: 'visible',
          }}>
            {[
              { color: '#4A7C59', scale: 0.78, delay: '0s' },
              { color: '#C9A84C', scale: 1.10, delay: '0.8s' },
              { color: '#2C5F6E', scale: 0.88, delay: '1.6s' },
            ].map((f, i) => (
              <div key={i} style={{
                transform: `scale(${f.scale})`, transformOrigin: 'bottom center',
                filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.2))',
                animation: `float 5s ease-in-out ${f.delay} infinite`,
                flexShrink: 0,
              }}>
                <FrascoSVG colorHex={f.color} />
              </div>
            ))}
          </div>

          {/* Pillars */}
          <div ref={pillarsRef} className="lp-pillars-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid #1A1A1A', borderBottom: '1px solid #1A1A1A',
          }}>
            {PILLARS.map((p, i) => (
              <div key={p.title} className={i < 2 ? 'lp-pillar-sep' : ''} style={{
                ...reveal(pillarsV, p.delay),
                padding: '48px 32px', textAlign: 'center',
                borderRight: i < 2 ? '1px solid #1A1A1A' : 'none',
              }}>
                <p style={{ color: GOLD, fontSize: '18px', marginBottom: '16px' }}>✦</p>
                <p className="font-courier" style={{ color: GOLD, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  {p.title}
                </p>
                <p className="font-cormorant" style={{ fontStyle: 'italic', fontSize: '18px', color: '#666', lineHeight: 1.8 }}>
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA EXPERIENCIA ── */}
      <section id="experiencia" style={{ padding: '120px 40px', background: '#0D0D0D' }}>
        <div ref={expRef} style={{ textAlign: 'center', marginBottom: '80px' }}>
          <p className="font-courier" style={{ ...reveal(expV, 0), color: GOLD, fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            LA EXPERIENCIA
          </p>
          <h2 className="font-cormorant lp-exp-title" style={{
            ...reveal(expV, 100),
            color: IVORY, fontWeight: 300,
            fontSize: 'clamp(40px, 5vw, 64px)', marginTop: '24px',
          }}>
            "3 minutos que te definen."
          </h2>
        </div>

        <div ref={stepsRef} style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              ...reveal(stepsV, i * 150),
              borderLeft: `2px solid ${GOLD}`,
              paddingLeft: '32px',
              paddingTop: i === 0 ? '0' : '52px',
            }}>
              <div style={{ marginBottom: '10px' }}>
                <StepIcon num={step.num} />
              </div>
              <p className="font-courier" style={{ color: GOLD, fontSize: '13px', letterSpacing: '0.2em' }}>{step.num}</p>
              <p className="font-cormorant" style={{ color: IVORY, fontSize: '28px', marginTop: '4px' }}>{step.title}</p>
              <p className="font-cormorant" style={{ fontStyle: 'italic', fontSize: '18px', color: '#666', lineHeight: 1.8, marginTop: '8px' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '120px 40px', textAlign: 'center', background: BG, position: 'relative', overflow: 'hidden' }}>
        {/* Background frasco watermark */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ transform: 'scale(2)', transformOrigin: 'center' }}>
            <FrascoSVG colorHex="#C9A84C" />
          </div>
        </div>

        <div ref={ctaRef} style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ ...reveal(ctaV, 0), color: GOLD, letterSpacing: '0.1em', fontSize: '14px' }}>◆ ────── ◆ ────── ◆</p>
          <h2 className="font-cormorant lp-cta-title" style={{
            ...reveal(ctaV, 100),
            color: IVORY, fontWeight: 300,
            fontSize: 'clamp(56px, 8vw, 100px)', lineHeight: 1.1, marginTop: '48px',
          }}>
            Tu aroma<br />aún no existe.
          </h2>
          <p className="font-courier" style={{ ...reveal(ctaV, 200), color: '#555', fontSize: '14px', letterSpacing: '0.15em', marginTop: '32px' }}>
            Disponible en Bogotá, Medellín, Cali y Cartagena.
          </p>
          <div style={{ ...reveal(ctaV, 300), marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <button className="btn-document" onClick={onStart} style={{ padding: '20px 56px', fontSize: '15px' }}>
              Encuentra tu identidad
            </button>
            <span className="font-courier" style={{ color: '#444', fontSize: '11px' }}>
              3 minutos · Gratuito · Irrepetible
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${GOLD}`, padding: '32px 40px', background: BG }}>
        <div className="lp-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center', gap: '24px' }}>
          <div>
            <p className="font-courier" style={{ color: GOLD, fontSize: '14px', letterSpacing: '0.15em' }}>AIVORA</p>
            <p className="font-courier" style={{ color: '#333', fontSize: '12px', marginTop: '6px', lineHeight: 1.6 }}>
              Inteligencia Artificial · Atención Humana · Esencia Única
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p className="font-courier" style={{ color: '#444', fontSize: '12px' }}>WhatsApp: 300 828 00 11</p>
          </div>
          <div className="lp-footer-right" style={{ textAlign: 'right' }}>
            <p className="font-courier" style={{ color: '#444', fontSize: '12px' }}>Bogotá · Medellín · Cali · Cartagena</p>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${GOLD}`, marginTop: '32px' }} />
      </footer>
    </div>
  )
}
