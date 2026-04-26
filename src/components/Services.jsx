import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'


const SERVICES = [
  {
    num: '01',
    title: 'Защитная плёнка',
    eng: 'Paint Protection Film',
    description: 'Полиуретановая плёнка защищает ЛКП от сколов, царапин и агрессивной среды. Самовосстанавливающийся слой возвращает форму при нагреве.',
    features: ['Самовосстановление', 'UV-блокировка', 'До 10 лет', 'Глянец или матт'],
    visual: 'ppf',
  },
  {
    num: '02',
    title: 'Керамическое покрытие',
    eng: 'Ceramic Coating',
    description: 'Нанокерамика 9H образует прочный защитный слой. Усиливает глубину цвета, делает поверхность гидрофобной и устойчивой к химии.',
    features: ['Твёрдость 9H', 'Гидрофобность', 'До 5 лет', 'Антистатика'],
    visual: 'ceramic',
  },
  {
    num: '03',
    title: 'Полировка',
    eng: 'Paint Correction',
    description: 'Многоступенчатая машинная полировка убирает голограммы, риски и мелкие царапины. Восстанавливает изначальную глубину и прозрачность лака.',
    features: ['DA-полировка', 'Роторная машина', 'Коррекция лака', 'Глубинный блеск'],
    visual: 'polish',
  },
  {
    num: '04',
    title: 'Шумоизоляция',
    eng: 'Sound Insulation',
    description: 'Профессиональная укладка вибродемпфирующих и шумопоглощающих материалов. Устраняет дорожный шум и вибрацию для тишины в салоне.',
    features: ['Вибродемпфер', 'Звукопоглощение', 'Тепловой барьер', 'Все зоны'],
    visual: 'nvh',
  },
]

// Abstract 3D-ish illustrations using CSS + SVG
function ServiceVisual({ type }) {
  const shapes = {
    ppf: (
      <svg viewBox="0 0 200 160" fill="none" style={{ width: '100%', height: '100%', opacity: 0.7 }}>
        <defs>
          <linearGradient id="ppfG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(180,200,255,0.6)"/>
            <stop offset="100%" stopColor="rgba(100,140,255,0.15)"/>
          </linearGradient>
          <linearGradient id="ppfG2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.04)"/>
          </linearGradient>
        </defs>
        {/* Car side profile abstract */}
        <path d="M20 110 Q25 85 45 75 L80 55 Q105 45 120 44 L155 44 Q175 44 185 55 L195 68 L195 110Z"
          fill="url(#ppfG2)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
        {/* Film layer */}
        <path d="M20 110 Q25 85 45 75 L80 55 Q105 45 120 44 L155 44 Q175 44 185 55 L195 68 L195 110Z"
          fill="url(#ppfG)" stroke="rgba(180,210,255,0.5)" strokeWidth="1.2"
          strokeDasharray="3 3" style={{ animation: 'filmAnim 3s ease-in-out infinite' }}/>
        {/* Peeling corner */}
        <path d="M80 55 L75 40 L68 30 Q70 25 80 28 L88 48Z"
          fill="rgba(180,210,255,0.5)" stroke="rgba(200,220,255,0.6)" strokeWidth="0.8"/>
        {/* Light reflection on film */}
        <path d="M40 80 Q80 68 140 64" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" fill="none"/>
        {/* Wheels */}
        <circle cx="68" cy="110" r="20" fill="rgba(20,20,30,0.8)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
        <circle cx="68" cy="110" r="12" fill="rgba(40,40,60,0.6)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
        <circle cx="155" cy="110" r="21" fill="rgba(20,20,30,0.8)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
        <circle cx="155" cy="110" r="13" fill="rgba(40,40,60,0.6)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
        <style>{`@keyframes filmAnim { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
      </svg>
    ),
    ceramic: (
      <svg viewBox="0 0 200 160" fill="none" style={{ width: '100%', height: '100%', opacity: 0.75 }}>
        <defs>
          <radialGradient id="cerG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)"/>
          </radialGradient>
        </defs>
        {/* Hexagonal nano-ceramic pattern */}
        {[0,1,2,3,4,5,6,7,8].map(i => {
          const col = i % 3, row = Math.floor(i / 3)
          const x = 25 + col * 58 + (row % 2) * 29
          const y = 30 + row * 50
          return (
            <polygon key={i}
              points={[0,1,2,3,4,5].map(k => {
                const a = (k * 60 - 30) * Math.PI / 180
                return `${x + 24 * Math.cos(a)},${y + 24 * Math.sin(a)}`
              }).join(' ')}
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.7"
              style={{ animation: `hexPulse ${1.5 + i * 0.2}s ease-in-out infinite alternate` }}
            />
          )
        })}
        {/* Water droplet */}
        <path d="M145 75 Q155 55 165 75 Q165 90 145 90 Q130 90 130 75 Q130 60 145 75Z"
          fill="rgba(150,200,255,0.5)" stroke="rgba(200,230,255,0.8)" strokeWidth="0.8"/>
        <path d="M137 72 Q143 65 150 70" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none"/>
        <style>{`@keyframes hexPulse { from { opacity:0.4 } to { opacity:1 } }`}</style>
      </svg>
    ),
    polish: (
      <svg viewBox="0 0 200 160" fill="none" style={{ width: '100%', height: '100%', opacity: 0.75 }}>
        <defs>
          <radialGradient id="polG" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)"/>
            <stop offset="40%" stopColor="rgba(255,255,255,0.2)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)"/>
          </radialGradient>
        </defs>
        {/* Paint surface */}
        <rect x="10" y="80" width="180" height="60" rx="4" fill="rgba(20,20,30,0.8)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
        {/* Concentric swirl marks (before) */}
        {[0,1,2,3].map(i => (
          <ellipse key={i} cx="60" cy="108" rx={8+i*8} ry={4+i*4}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" transform={`rotate(${i*15}, 60, 108)`}/>
        ))}
        {/* Light reflection (after polish) */}
        <ellipse cx="130" cy="100" rx="30" ry="12" fill="url(#polG)"
          style={{ animation: 'polGlow 2s ease-in-out infinite alternate' }}/>
        {/* Polishing machine abstract */}
        <circle cx="130" cy="65" r="22" fill="rgba(40,40,50,0.8)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <circle cx="130" cy="65" r="16" fill="rgba(60,60,80,0.6)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        <circle cx="130" cy="65" r="4" fill="rgba(255,255,255,0.2)"/>
        {/* Handle */}
        <rect x="127" y="42" width="6" height="22" rx="3" fill="rgba(80,80,100,0.7)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
        <style>{`@keyframes polGlow { from { opacity:0.5 rx:25px } to { opacity:0.9 rx:35px } }`}</style>
      </svg>
    ),
    nvh: (
      <svg viewBox="0 0 200 160" fill="none" style={{ width: '100%', height: '100%', opacity: 0.75 }}>
        {/* Sound waves */}
        {[0,1,2,3,4].map(i => (
          <path key={i}
            d={`M${20 + i * 10},40 Q${30 + i*10},${80 + Math.sin(i) * 20} ${20 + i*10},120`}
            stroke={`rgba(255,255,255,${0.04 + i * 0.04})`} strokeWidth="1" fill="none"
            style={{ animation: `wave ${1 + i * 0.3}s ease-in-out infinite alternate` }}/>
        ))}
        {/* Barrier */}
        <rect x="80" y="30" width="8" height="100" rx="2" fill="rgba(60,60,80,0.9)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
        {/* Absorbed waves (right side, attenuated) */}
        {[0,1,2].map(i => (
          <path key={i}
            d={`M${100 + i * 8},55 Q${108 + i*8},${90 + Math.sin(i) * 10} ${100 + i*8},115`}
            stroke={`rgba(255,255,255,${0.02 + i * 0.02})`} strokeWidth="0.6" fill="none"
            style={{ animation: `wave ${0.8 + i * 0.3}s ease-in-out infinite alternate` }}/>
        ))}
        {/* dB labels */}
        <text x="35" y="90" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Courier New">72 дБ</text>
        <text x="110" y="90" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="Courier New">38 дБ</text>
        <style>{`@keyframes wave { from { transform:scaleY(0.8) } to { transform:scaleY(1.2) } }`}</style>
      </svg>
    ),
  }
  return shapes[type] || null
}

export default function Services() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current
      if (!track) return

      // Calculate how far to scroll
      const getScrollAmt = () => track.scrollWidth - window.innerWidth

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: () => `+=${getScrollAmt()}`,
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }
          },
        },
      })

      tl.to(track, {
        x: () => -getScrollAmt(),
        ease: 'none',
      })

      // Cards animate in as they enter viewport (horizontal)
      gsap.utils.toArray('.svc-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: tl.scrollTrigger,
            start: 'left 85%',
            toggleActions: 'play none none none',
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="services" style={{
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-0)',
      position: 'relative',
    }}>
      {/* Section header — fixed inside pinned section */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '80px 6vw 0',
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}>
        <div className="section-label">
          <div className="divider" />
          <span>Направления работы</span>
        </div>
        <h2 className="f-display" style={{
          fontSize: 'clamp(28px, 4vw, 56px)',
          marginBottom: 8,
        }}>
          НАШИ УСЛУГИ
        </h2>
        <p style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.12em',
        }}>
          прокрутите горизонтально →
        </p>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} style={{
        display: 'flex',
        height: '100%',
        width: `${SERVICES.length * 100}vw`,
        willChange: 'transform',
      }}>
        {SERVICES.map((svc, i) => (
          <div
            key={i}
            className="svc-card"
            style={{
              width: '100vw',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0 6vw',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {/* Service content */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8vw',
              alignItems: 'center',
              maxWidth: 1200,
              margin: '0 auto',
              width: '100%',
              paddingTop: 120,
            }}>
              {/* Text */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
                  <span className="f-display" style={{ fontSize: 56, color: 'rgba(255,255,255,0.08)', lineHeight: 1 }}>
                    {svc.num}
                  </span>
                  <div>
                    <h3 className="f-display" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', lineHeight: 0.95 }}>
                      {svc.title}
                    </h3>
                    <div style={{ fontSize: 10, color: 'rgba(162,5,15,0.8)', letterSpacing: '0.24em', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                      {svc.eng}
                    </div>
                  </div>
                </div>

                <p style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.85,
                  marginBottom: 32,
                  maxWidth: 460,
                  fontFamily: 'var(--font-body)',
                }}>
                  {svc.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
                  {svc.features.map(f => (
                    <span key={f} style={{
                      padding: '6px 14px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.45)',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.08em',
                    }}>
                      {f}
                    </span>
                  ))}
                </div>

                <a href="#contact" className="btn-ghost" style={{ fontSize: 11 }}>
                  Узнать стоимость →
                </a>
              </div>

              {/* Visual illustration */}
              <div style={{
                height: 320,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Corner accents */}
                {[
                  { top: 0, left: 0, borderTop: '1px solid rgba(162,5,15,0.4)', borderLeft: '1px solid rgba(162,5,15,0.4)', width: 24, height: 24 },
                  { top: 0, right: 0, borderTop: '1px solid rgba(162,5,15,0.4)', borderRight: '1px solid rgba(162,5,15,0.4)', width: 24, height: 24 },
                  { bottom: 0, left: 0, borderBottom: '1px solid rgba(162,5,15,0.4)', borderLeft: '1px solid rgba(162,5,15,0.4)', width: 24, height: 24 },
                  { bottom: 0, right: 0, borderBottom: '1px solid rgba(162,5,15,0.4)', borderRight: '1px solid rgba(162,5,15,0.4)', width: 24, height: 24 },
                ].map((s, ci) => (
                  <div key={ci} style={{ position: 'absolute', ...s }} />
                ))}

                <ServiceVisual type={svc.visual} />

                {/* Service number watermark */}
                <div className="f-display" style={{
                  position: 'absolute', bottom: 16, right: 20,
                  fontSize: 72,
                  color: 'rgba(255,255,255,0.04)',
                  lineHeight: 1,
                  userSelect: 'none',
                }}>
                  {svc.num}
                </div>
              </div>
            </div>

            {/* Section divider line */}
            {i < SERVICES.length - 1 && (
              <div style={{
                position: 'absolute',
                right: 0, top: '20%', bottom: '20%',
                width: 1,
                background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.07), transparent)',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2,
        background: 'rgba(255,255,255,0.05)',
        zIndex: 20,
      }}>
        <div ref={progressRef} style={{
          height: '100%',
          background: 'var(--accent)',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          transition: 'none',
        }} />
      </div>
    </section>
  )
}
