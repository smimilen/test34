import { useState, useEffect } from 'react'

const LINKS = [
  ['Услуги', '#services'],
  ['О нас', '#about'],
  ['Процесс', '#process'],
  ['Контакт', '#contact'],
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 900, height: 64,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        transition: 'all 0.5s ease',
        background: scrolled ? 'rgba(4,4,6,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 6, height: 6,
            background: 'var(--accent)',
            transform: 'rotate(45deg)',
          }} />
          <span className="f-display" style={{ fontSize: 20, letterSpacing: '0.1em', color: '#fff' }}>
            W<span style={{ color: 'var(--accent)' }}>S</span>TYLING
          </span>
        </a>

        {/* Desktop nav */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {LINKS.map(([label, href]) => (
            <a key={label} href={href} style={{
              color: 'rgba(255,255,255,0.52)',
              textDecoration: 'none',
              fontSize: 12,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              transition: 'color 0.25s',
              fontFamily: 'var(--font-body)',
            }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.52)'}
            >{label}</a>
          ))}
          <a href="#contact" className="btn-primary" style={{ padding: '10px 24px', fontSize: 11 }}>
            Записаться
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-only"
          onClick={() => setMobile(!mobile)}
          style={{
            background: 'none', border: 'none', color: '#fff',
            cursor: 'pointer', padding: 4, display: 'flex',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {mobile
              ? <>
                  <line x1="3" y1="3" x2="19" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="19" y1="3" x2="3" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </>
              : <>
                  <line x1="3" y1="7" x2="19" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="11" x2="19" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="15" x2="19" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </>
            }
          </svg>
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 800,
          background: 'rgba(4,4,6,0.97)',
          backdropFilter: 'blur(24px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 36,
          animation: 'fadeIn 0.2s ease',
        }}>
          <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
          {LINKS.map(([label, href]) => (
            <a key={label} href={href}
              onClick={() => setMobile(false)}
              className="f-display"
              style={{ fontSize: 36, color: '#fff', textDecoration: 'none', letterSpacing: '0.08em' }}
            >{label}</a>
          ))}
          <a href="#contact" onClick={() => setMobile(false)} className="btn-primary" style={{ marginTop: 12 }}>
            Записаться
          </a>
        </div>
      )}
    </>
  )
}
