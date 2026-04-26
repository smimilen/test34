import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', service: '', msg: '' })
  const [sent, setSent] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-left, .contact-right', {
        opacity: 0, y: 50, duration: 0.9, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    })
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', phone: '', service: '', msg: '' })
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <section ref={sectionRef} id="contact" style={{
      padding: '120px 6vw',
      background: 'var(--bg-0)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8vw',
        alignItems: 'start',
      }}>
        {/* Left column */}
        <div className="contact-left">
          <div className="section-label">
            <div className="divider" />
            <span>Связаться с нами</span>
          </div>
          <h2 className="f-display" style={{
            fontSize: 'clamp(28px, 4vw, 52px)',
            marginBottom: 24,
            lineHeight: 0.95,
          }}>
            ЗАПИСАТЬСЯ НА<br />КОНСУЛЬТАЦИЮ
          </h2>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.85,
            marginBottom: 52,
            maxWidth: 360,
            fontFamily: 'var(--font-body)',
          }}>
            Расскажите нам о вашем автомобиле. Наши специалисты ответят в течение 24 часов и предложат индивидуальное решение.
          </p>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 3a1 1 0 011-1h2.5l1 3-1.5 1.5a11 11 0 005.5 5.5L12 10.5l3 1V14a1 1 0 01-1 1 13 13 0 01-13-13" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
                label: 'Телефон',
                value: '+31 321 000 000',
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="white" strokeWidth="1.2"/>
                    <path d="M1.5 5l6.5 4 6.5-4" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
                label: 'Email',
                value: 'studio@wstyling.nl',
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1a5 5 0 010 10c-2 0-5-4.5-5-5A5 5 0 018 1z" stroke="white" strokeWidth="1.2"/>
                    <circle cx="8" cy="6" r="1.5" stroke="white" strokeWidth="1.2"/>
                    <path d="M4 13.5c0-1.1 1.8-2 4-2s4 .9 4 2" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
                label: 'Адрес',
                value: 'Дронтен, Флеволанд, NL',
              },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 36, height: 36,
                  border: '1px solid rgba(162,5,15,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>
                    {label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="contact-right">
          {sent ? (
            <div style={{
              padding: '60px 40px',
              border: '1px solid rgba(255,255,255,0.07)',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease',
            }}>
              <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }`}</style>
              <div style={{
                width: 48, height: 48,
                border: '1px solid rgba(162,5,15,0.4)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4 4 8-8" stroke="#A2050F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="f-display" style={{ fontSize: 24, marginBottom: 12 }}>ЗАЯВКА ОТПРАВЛЕНА</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}>
                Мы свяжемся с вами в течение 24 часов
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="input-label">Имя</label>
                  <input className="input-field" type="text" placeholder="Ваше имя" required
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Телефон</label>
                  <input className="input-field" type="tel" placeholder="+7 900 000 00 00" required
                    value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="input-label">Услуга</label>
                <select className="input-field" required
                  value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}>
                  <option value="">Выберите услугу</option>
                  <option value="ppf">Защитная плёнка (PPF)</option>
                  <option value="ceramic">Керамическое покрытие</option>
                  <option value="polish">Полировка</option>
                  <option value="nvh">Шумоизоляция</option>
                  <option value="full">Полный пакет</option>
                </select>
              </div>

              <div>
                <label className="input-label">Сообщение</label>
                <textarea className="input-field" rows={5}
                  placeholder="Марка, модель, пожелания..."
                  value={form.msg} onChange={e => setForm(p => ({ ...p, msg: e.target.value }))} />
              </div>

              <button type="submit" className="btn-primary" style={{
                justifyContent: 'center',
                marginTop: 6,
                fontSize: 12,
              }}>
                ОТПРАВИТЬ ЗАЯВКУ
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-mono)', textAlign: 'center', letterSpacing: '0.08em' }}>
                Ответим в течение 24 часов
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Contact responsive fix */}
      <style>{`
        @media (max-width: 768px) {
          #contact > div { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}
