import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Car3D from './Car3D.jsx'

export default function Hero() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const statsRef = useRef(null)
  const carWrapRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 })
      if (labelRef.current) tl.from(labelRef.current, { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' })
      if (titleRef.current) tl.from(titleRef.current, { opacity: 0, y: 56, duration: 0.9, ease: 'power4.out' }, '-=0.3')
      if (subRef.current) tl.from(subRef.current, { opacity: 0, y: 28, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      if (ctaRef.current) tl.from(ctaRef.current, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      if (statsRef.current) tl.from(statsRef.current, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      if (carWrapRef.current) {
        gsap.to(carWrapRef.current, { y: 100, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1 } })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'radial-gradient(ellipse 110% 80% at 50% 60%, #0f080e 0%, #080808 50%, #000 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.013) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.013) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
      <div ref={carWrapRef} style={{ position: 'absolute', inset: 0, zIndex: 2 }}><Car3D /></div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 60%,rgba(0,0,0,0.05) 100%), linear-gradient(0deg,rgba(0,0,0,0.7) 0%,transparent 50%)' }} />
      <div style={{ position: 'relative', zIndex: 4, padding: '0 6vw', paddingTop: 80, maxWidth: 1440, width: '100%' }}>
        <div ref={labelRef} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div className="divider" />
          <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>Премиум детейлинг студия</span>
        </div>
        <h1 ref={titleRef} className="f-display" style={{ fontSize: 'clamp(52px,8.5vw,116px)', lineHeight: 0.88, maxWidth: 640, marginBottom: 28 }}>
         ДЕТЕЙЛИНГ<br />БЕЗ КОМПРОМИССОВ
        </h1>
        <p ref={subRef} style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.85, maxWidth: 380, marginBottom: 44, fontFamily: 'var(--font-body)' }}>
          Защита. Точность.<br />Абсолютный контроль над каждой<br />поверхностью вашего автомобиля.
        </p>
        <div ref={ctaRef} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 56 }}>
          <a href="#contact" className="btn-primary">Записаться →</a>
          <a href="#services" className="btn-ghost">Наши услуги →</a>
        </div>
        <div ref={statsRef} style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          {[['500+','автомобилей'],['10 лет','гарантия'],['99%','клиентов вернулись']].map(([n,l]) => (
            <div key={l} style={{ borderLeft: '2px solid rgba(162,5,15,0.5)', paddingLeft: 16 }}>
              <div className="f-display" style={{ fontSize: 26 }}>{n}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'bounce 2s ease-in-out infinite', pointerEvents: 'none' }}>
        <style>{`@keyframes bounce{0%,100%{opacity:.4;transform:translateX(-50%) translateY(0)}50%{opacity:.8;transform:translateX(-50%) translateY(6px)}}`}</style>
        <div style={{ width: 1, height: 36, background: 'linear-gradient(0deg,rgba(255,255,255,0.5),transparent)' }} />
        <span style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>SCROLL</span>
      </div>
    </section>
  )
}
