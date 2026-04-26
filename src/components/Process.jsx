import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'


const STEPS = [
  {
    num: '01',
    title: 'Приёмка и диагностика',
    desc: 'Подробный осмотр ЛКП под различным освещением. Фиксируем дефекты, согласовываем объём и сроки.',
    duration: '30 мин',
  },
  {
    num: '02',
    title: 'Деконтаминация поверхности',
    desc: 'Полная химическая и механическая очистка. Удаляем смолу, железо, гудрон и прочие загрязнения.',
    duration: '1–2 часа',
  },
  {
    num: '03',
    title: 'Коррекция лакокрасочного покрытия',
    desc: 'Машинная полировка под нужный финиш — глосс или матт. Устраняем голограммы и риски.',
    duration: '4–8 часов',
  },
  {
    num: '04',
    title: 'Нанесение защиты',
    desc: 'Точная установка PPF или нанесение керамики с соблюдением температурного режима и чистоты.',
    duration: '4–16 часов',
  },
  {
    num: '05',
    title: 'Финальный контроль и выдача',
    desc: 'Детальная проверка под студийным светом. Инструктаж по уходу. Вручаем гарантийный документ.',
    duration: '30 мин',
  },
]

export default function Process() {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated line drawing
      gsap.fromTo(lineRef.current,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      )

      // Step reveals
      gsap.utils.toArray('.process-step').forEach((step, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: 'top 75%',
            end: 'top 35%',
            toggleActions: 'play none none reverse',
          },
        })
        tl.from(step.querySelector('.step-num'), {
          opacity: 0, x: -30, duration: 0.5, ease: 'power3.out',
        })
        .from(step.querySelector('.step-content'), {
          opacity: 0, x: 30, duration: 0.6, ease: 'power3.out',
        }, '-=0.3')
        .from(step.querySelector('.step-dot'), {
          scale: 0, duration: 0.4, ease: 'back.out(2)',
        }, '-=0.5')
      })

      // Title reveal
      gsap.from('.process-title', {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="process" style={{
      padding: '120px 6vw',
      background: 'var(--bg-1)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div className="process-title" style={{ marginBottom: 80 }}>
          <div className="section-label">
            <div className="divider" />
            <span>Как мы работаем</span>
          </div>
          <h2 className="f-display" style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}>
            ПРОЦЕСС
          </h2>
        </div>

        {/* Steps + vertical line */}
        <div style={{ display: 'flex', gap: '8vw', alignItems: 'flex-start' }}>
          {/* Left: animated line */}
          <div style={{
            position: 'relative',
            width: 2,
            flexShrink: 0,
            background: 'rgba(255,255,255,0.06)',
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div ref={lineRef} style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(180deg, var(--accent) 0%, rgba(162,5,15,0.3) 100%)',
            }} />
          </div>

          {/* Steps */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="process-step"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: '32px',
                  alignItems: 'start',
                  padding: '40px 0',
                  borderBottom: i < STEPS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  position: 'relative',
                }}
              >
                {/* Dot on timeline */}
                <div
                  className="step-dot"
                  style={{
                    position: 'absolute',
                    left: -41, // aligns with the line
                    top: 46,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
                    border: `2px solid ${i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
                    transform: 'translateX(3px)',
                  }}
                />

                {/* Number */}
                <div className="step-num" style={{ paddingTop: 4 }}>
                  <div className="f-display" style={{
                    fontSize: 36,
                    color: 'rgba(255,255,255,0.1)',
                    lineHeight: 1,
                  }}>
                    {step.num}
                  </div>
                  <div style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.25)',
                    letterSpacing: '0.14em',
                    fontFamily: 'var(--font-mono)',
                    marginTop: 6,
                  }}>
                    {step.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="step-content">
                  <h3 style={{
                    fontSize: 18,
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    marginBottom: 12,
                    letterSpacing: '-0.01em',
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.42)',
                    lineHeight: 1.8,
                    fontFamily: 'var(--font-body)',
                    maxWidth: 520,
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24,
          marginTop: 72,
          paddingTop: 48,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div>
            <p className="f-display" style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', marginBottom: 8 }}>
              ГОТОВЫ К ПЕРВОМУ ШАГУ?
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-body)' }}>
              Запишитесь на бесплатную диагностику
            </p>
          </div>
          <a href="#contact" className="btn-primary">
            Записаться →
          </a>
        </div>
      </div>
    </section>
  )
}
