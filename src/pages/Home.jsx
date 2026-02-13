import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="landing">
      <div className="landing__content">
        <h1 className="kn-heading kn-h1">Stop Missing The Right Jobs.</h1>
        <p className="kn-body-text kn-text-muted landing__subtext">
          Precision-matched job discovery delivered daily at 9AM.
        </p>
        <Link to="/settings" className="kn-btn kn-btn--primary landing__cta">
          Start Tracking
        </Link>
      </div>
    </section>
  )
}
