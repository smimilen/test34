import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import Car3D from './Car3D.jsx'


export default function Hero() {
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const statsRef = useRef(null)
  const ctaRef = useRef(null)
  const labelRef = useRef(null)
  const carWrapRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered text reveal on load
      const tl = gsap.timeline({ delay: 0.3 })

      tl.from(labelRef.current, {
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
      })
      .from(titleRef.current.children, {
        opacity: 0, y: 60, stagger: 0.12, duration: 0.9, ease: 'power4.out',
      }, '-=0.3')
      .from(subRef.current, {
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
      }, '-=0.4')
      .from(ctaRef.current.children, {
        opacity: 0, y: 20, stagger: 0.12, duration: 0.6, ease: 'power3.out',
      }, '-=0.3')
      .from(statsRef.current.children, {
        opacity: 0, y: 20, stagger: 0.08, duration: 0.6, ease: 'power3.out',
      }, '-=0.3')

      // Parallax the car on scroll
      gsap.to(carWrapRef.current, {
        y: 120,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Fade hero text on scroll
      gsap.to([titleRef.current, subRef.current, ctaRef.current, statsRef.current], {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          start: 'top top',
          end: '30% top',
          scrub: 1,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: `
        radial-gradient(ellipse 110% 80% at 50% 60%, #0f080e 0%, #080808 50%, #000000 100%)
      `,
    }}>
      {/* Noise texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.45,
      }} />

      {/* Fine grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.014) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* 3D Car — centered, fills the back */}
      <div ref={carWrapRef} style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
      }}>
        <Car3D style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Gradient overlay — keeps car cinematic, text readable */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: `
          linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%),
          linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 50%)
        `,
      }} />

      {/* Text content */}
      <div style={{
        position: 'relative', zIndex: 4,
        padding: '0 6vw',
        paddingTop: 80,
        maxWidth: 1440,
        width: '100%',
      }}>
        {/* Label */}
        <div ref={labelRef} className="section-label" style={{ marginBottom: 24 }}>
          <div className="divider" />
          <span style={{ fontFamily: 'var(--font-mono)' }}>Премиум детейлинг студия</span>
        </div>

        {/* Main title */}
        <h1 ref={titleRef} className="f-display" style={{
          fontSize: 'clamp(52px, 8.5vw, 118px)',
          lineHeight: 0.88,
          maxWidth: 640,
          marginBottom: 28,
        }}>
          <span style={{ display: 'block' }}>ДЕТЕЙЛИНГ</span>
          <span style={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>БЕЗ</span>
          <span style={{ display: 'block' }}>КОМПРОМИССОВ</span>
        </h1>

        <p ref={subRef} style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.85,
          maxWidth: 380,
          marginBottom: 44,
          letterSpacing: '0.03em',
          fontFamily: 'var(--font-body)',
        }}>
          Защита. Точность.<br />
          Абсолютный контроль над каждой<br />
          поверхностью вашего автомобиля.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 56 }}>
          <a href="#contact" className="btn-primary">
            Записаться
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#services" className="btn-ghost">
            Наши услуги
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div ref={statsRef} style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          {[['500+', 'автомобилей'], ['10 лет', 'гарантия'], ['99%', 'клиентов вернулись']].map(([n, l]) => (
            <div key={l} style={{
              borderLeft: '2px solid rgba(162,5,15,0.5)',
              paddingLeft: 16,
            }}>
              <div className="f-display" style={{ fontSize: 26, letterSpacing: '0.04em' }}>{n}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        animation: 'scrollBounce 2s ease-in-out infinite',
      }}>
        <style>{`
          @keyframes scrollBounce {
            0%, 100% { opacity: 0.4; transform: translateX(-50%) translateY(0); }
            50% { opacity: 0.8; transform: translateX(-50%) translateY(6px); }
          }
        `}</style>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(0deg, rgba(255,255,255,0.5), transparent)',
        }} />
        <span style={{ fontSize: 9, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
          SCROLL
        </span>
      </div>
    </section>
  )
}
