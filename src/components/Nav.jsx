import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/saved', label: 'Saved' },
  { to: '/digest', label: 'Digest' },
  { to: '/settings', label: 'Settings' },
  { to: '/proof', label: 'Proof' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="app-nav" role="navigation">
      <NavLink to="/" className="app-nav__brand" end>
        Job Notification Tracker
      </NavLink>

      <div className={`app-nav__links ${menuOpen ? 'open' : ''}`}>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `app-nav__link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>

      <button
        type="button"
        className="app-nav__toggle"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="app-nav__toggle-icon">
          <span />
          <span />
          <span />
        </span>
      </button>
    </nav>
  )
}
