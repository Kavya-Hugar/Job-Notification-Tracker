import { memo } from 'react'
import { getMatchBand } from '../utils/matchScore'

function formatPostedDaysAgo(days) {
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

function normaliseStatus(status) {
  switch (status) {
    case 'Applied':
      return 'applied'
    case 'Rejected':
      return 'rejected'
    case 'Selected':
      return 'selected'
    case 'Not Applied':
    default:
      return 'not-applied'
  }
}

function JobCard({ job, onView, onApply, onToggleSave, isSaved, status, onStatusChange }) {
  const score = typeof job.matchScore === 'number' ? job.matchScore : 0
  const band = getMatchBand(score)
  const statusKey = normaliseStatus(status)

  return (
    <article className="kn-card job-card">
      <header className="job-card__header">
        <div>
          <h2 className="kn-heading kn-h3 job-card__title">{job.title}</h2>
          <p className="kn-text-muted job-card__company">
            {job.company} · {job.location} · {job.mode}
          </p>
        </div>
        <div className="job-card__right">
          <span className={`match-badge match-badge--${band}`}>{score}% match</span>
          <span className={`job-card__source-badge job-card__source-badge--${job.source.toLowerCase()}`}>
            {job.source}
          </span>
        </div>
      </header>

      <div className="job-card__meta">
        <div className="job-card__chip">{job.experience} yrs</div>
        <div className="job-card__chip">{job.salaryRange}</div>
        <div className="job-card__posted">{formatPostedDaysAgo(job.postedDaysAgo)}</div>
      </div>

      <div className="job-card__status-row">
        <span className={`status-badge status-badge--${statusKey}`}>{status}</span>
        <div className="status-group">
          {['Not Applied', 'Applied', 'Rejected', 'Selected'].map((value) => (
            <button
              key={value}
              type="button"
              className={`status-group__button ${status === value ? 'status-group__button--active' : ''}`}
              onClick={() => onStatusChange(job, value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <footer className="job-card__footer">
        <button type="button" className="kn-btn kn-btn--ghost" onClick={() => onView(job)}>
          View
        </button>
        <button type="button" className="kn-btn kn-btn--secondary" onClick={() => onToggleSave(job.id)}>
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button type="button" className="kn-btn kn-btn--primary" onClick={() => onApply(job.applyUrl)}>
          Apply
        </button>
      </footer>
    </article>
  )
}

export default memo(JobCard)

