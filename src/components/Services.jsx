import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const SERVICES = [
  { num: '01', title: 'Защитная плёнка', eng: 'Paint Protection Film', desc: 'Полиуретановая плёнка защищает ЛКП от сколов, царапин и агрессивной среды. Самовосстанавливающийся слой.', tags: ['Самовосстановление','UV-защита','До 10 лет','Глянец или матт'] },
  { num: '02', title: 'Керамическое покрытие', eng: 'Ceramic Coating', desc: 'Нанокерамика 9H образует прочный защитный слой. Усиливает глубину цвета и делает поверхность гидрофобной.', tags: ['Твёрдость 9H','Гидрофобность','До 5 лет','Антистатика'] },
  { num: '03', title: 'Полировка', eng: 'Paint Correction', desc: 'Многоступенчатая полировка убирает голограммы, риски и мелкие царапины. Восстанавливает глубину лака.', tags: ['DA-полировка','Роторная машина','Коррекция лака','Глубинный блеск'] },
  { num: '04', title: 'Шумоизоляция', eng: 'Sound Insulation', desc: 'Профессиональная укладка вибродемпфирующих материалов. Устраняет дорожный шум и вибрацию.', tags: ['Вибродемпфер','Звукопоглощение','Тепловой барьер','Все зоны'] },
]

export default function Services() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      const getAmt = () => track.scrollWidth - window.innerWidth
      ScrollTrigger.create({
        trigger: section, pin: true, start: 'top top',
        end: () => `+=${getAmt()}`, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`
          if (track) gsap.set(track, { x: -getAmt() * self.progress })
        },
      })
      gsap.utils.toArray('.svc-card').forEach((card, i) => {
        gsap.from(card, { opacity: 0, y: 30, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' } })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="services" style={{ height: '100vh', overflow: 'hidden', background: 'var(--bg-0)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '80px 6vw 0', zIndex: 10, background: 'linear-gradient(180deg,rgba(0,0,0,0.92) 0%,transparent 100%)', pointerEvents: 'none' }}>
        <div className="section-label"><div className="divider" /><span>Направления работы</span></div>
        <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,56px)', marginBottom: 6 }}>НАШИ УСЛУГИ</h2>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>прокрутите →</p>
      </div>
      <div ref={trackRef} style={{ display: 'flex', height: '100%', width: `${SERVICES.length * 100}vw`, willChange: 'transform' }}>
        {SERVICES.map((s, i) => (
          <div key={i} className="svc-card" style={{ width: '100vw', height: '100%', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '120px 6vw 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8vw', alignItems: 'center', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20 }}>
                  <span className="f-display" style={{ fontSize: 52, color: 'rgba(255,255,255,0.07)', lineHeight: 1 }}>{s.num}</span>
                  <div>
                    <h3 className="f-display" style={{ fontSize: 'clamp(26px,3.5vw,46px)', lineHeight: 0.95 }}>{s.title}</h3>
                    <div style={{ fontSize: 10, color: 'rgba(162,5,15,0.8)', letterSpacing: '0.22em', marginTop: 6, fontFamily: 'var(--font-mono)' }}>{s.eng}</div>
                  </div>
                </div>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.85, marginBottom: 28, maxWidth: 460, fontFamily: 'var(--font-body)' }}>{s.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                  {s.tags.map(t => <span key={t} style={{ padding: '6px 14px', border: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{t}</span>)}
                </div>
                <a href="#contact" className="btn-ghost" style={{ fontSize: 11 }}>Узнать стоимость →</a>
              </div>
              <div style={{ height: 300, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {[{top:0,left:0,borderTop:'1px solid rgba(162,5,15,0.4)',borderLeft:'1px solid rgba(162,5,15,0.4)'},{top:0,right:0,borderTop:'1px solid rgba(162,5,15,0.4)',borderRight:'1px solid rgba(162,5,15,0.4)'},{bottom:0,left:0,borderBottom:'1px solid rgba(162,5,15,0.4)',borderLeft:'1px solid rgba(162,5,15,0.4)'},{bottom:0,right:0,borderBottom:'1px solid rgba(162,5,15,0.4)',borderRight:'1px solid rgba(162,5,15,0.4)'}].map((st,ci) => <div key={ci} style={{ position:'absolute', width:20, height:20, ...st }} />)}
                <div className="f-display" style={{ fontSize: 120, color: 'rgba(255,255,255,0.04)', userSelect: 'none' }}>{s.num}</div>
                <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, fontSize: 11, color: 'rgba(162,5,15,0.6)', letterSpacing: '0.14em', fontFamily: 'var(--font-mono)' }}>{s.tags.join(' · ')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.05)', zIndex: 20 }}>
        <div ref={progressRef} style={{ height: '100%', background: 'var(--accent)', transformOrigin: 'left', transform: 'scaleX(0)' }} />
      </div>
      <style>{`@media(max-width:768px){.svc-card>div{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}
