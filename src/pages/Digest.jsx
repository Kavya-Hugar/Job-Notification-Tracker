import { useEffect, useMemo, useState } from 'react'
import { jobs } from '../data/jobs'
import { loadPreferences } from '../utils/preferences'
import { computeMatchScore } from '../utils/matchScore'
import { getTodayDigestKey, getTodayLabel, loadDigest, saveDigest } from '../utils/digest'
import { DEFAULT_STATUS, loadStatusMap } from '../utils/status'

const formatDigestText = (dateLabel, digestJobs) => {
  const lines = []
  lines.push('Top 10 Jobs For You — 9AM Digest')
  lines.push(dateLabel)
  lines.push('')

  digestJobs.forEach((job, index) => {
    lines.push(`${index + 1}. ${job.title} — ${job.company}`)
    lines.push(`   Location: ${job.location} · Experience: ${job.experience}`)
    lines.push(`   Match Score: ${job.matchScore}%`)
    lines.push(`   Apply: ${job.applyUrl}`)
    lines.push('')
  })

  lines.push('This digest was generated based on your preferences.')
  lines.push('Demo Mode: Daily 9AM trigger simulated manually.')

  return lines.join('\n')
}

export default function Digest() {
  const [digestJobs, setDigestJobs] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [preferences, setPreferences] = useState(() => loadPreferences())
  const [statusMap, setStatusMap] = useState(() => loadStatusMap())

  useEffect(() => {
    setPreferences(loadPreferences())
    setStatusMap(loadStatusMap())
    const key = getTodayDigestKey()
    const existing = loadDigest(key)
    if (existing && Array.isArray(existing) && existing.length > 0) {
      setDigestJobs(existing)
    }
  }, [])

  const hasActivePreferences =
    Boolean(preferences.roleKeywords && preferences.roleKeywords.trim()) ||
    (Array.isArray(preferences.preferredLocations) && preferences.preferredLocations.length > 0) ||
    (Array.isArray(preferences.preferredMode) && preferences.preferredMode.length > 0) ||
    Boolean(preferences.experienceLevel) ||
    Boolean(preferences.skills && preferences.skills.trim())

  const todayLabel = useMemo(() => getTodayLabel(), [])

  const recentStatusUpdates = useMemo(() => {
    const entries = Object.entries(statusMap || {})
      .map(([jobId, value]) => {
        const entry = typeof value === 'string' ? { status: value } : value || {}
        const status = entry.status || DEFAULT_STATUS
        const updatedAt = entry.updatedAt
        if (!updatedAt || status === DEFAULT_STATUS) return null

        const job = jobs.find((item) => item.id === jobId)
        if (!job) return null

        return {
          jobId,
          title: job.title,
          company: job.company,
          status,
          updatedAt: new Date(updatedAt),
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5)

    return entries
  }, [statusMap])

  const handleGenerate = () => {
    if (!hasActivePreferences || isGenerating) return

    setIsGenerating(true)
    const key = getTodayDigestKey()

    const existing = loadDigest(key)
    if (existing && Array.isArray(existing) && existing.length > 0) {
      setDigestJobs(existing)
      setIsGenerating(false)
      return
    }

    const scored = jobs.map((job) => ({
      ...job,
      matchScore: computeMatchScore(job, preferences),
    }))

    const withMatches = scored.filter((job) => job.matchScore > 0)

    if (withMatches.length === 0) {
      setDigestJobs([])
      setIsGenerating(false)
      return
    }

    withMatches.sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
      return a.postedDaysAgo - b.postedDaysAgo
    })

    const topTen = withMatches.slice(0, 10)
    saveDigest(key, topTen)
    setDigestJobs(topTen)
    setIsGenerating(false)
  }

  const digestText = useMemo(() => {
    if (!digestJobs || digestJobs.length === 0) return ''
    return formatDigestText(todayLabel, digestJobs)
  }, [digestJobs, todayLabel])

  const handleCopy = async () => {
    if (!digestText) return
    try {
      await navigator.clipboard.writeText(digestText)
    } catch {
      // Silent failure; user can still use the email draft.
    }
  }

  const handleEmailDraft = () => {
    if (!digestText) return
    const subject = 'My 9AM Job Digest'
    const body = encodeURIComponent(digestText)
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`
  }

  return (
    <section className="page">
      <header className="page__header">
        <h1 className="kn-heading kn-h1">Digest</h1>
        <p className="kn-body-text kn-text-muted page__subtext">
          Generate a simulated 9AM digest of your highest scoring roles, ready to share or email.
        </p>
      </header>

      <div className="page__body">
        {!hasActivePreferences && (
          <div className="kn-card empty-panel">
            <h2 className="kn-heading kn-h2">Preferences required.</h2>
            <p className="kn-body-text kn-text-muted empty-panel__text">
              Set preferences to generate a personalized digest.
            </p>
          </div>
        )}

        <div className="digest-actions">
          <button
            type="button"
            className="kn-btn kn-btn--primary"
            onClick={handleGenerate}
            disabled={!hasActivePreferences || isGenerating}
          >
            Generate Today&apos;s 9AM Digest (Simulated)
          </button>

          <button type="button" className="kn-btn kn-btn--secondary" onClick={handleCopy} disabled={!digestText}>
            Copy Digest to Clipboard
          </button>

          <button type="button" className="kn-btn kn-btn--ghost" onClick={handleEmailDraft} disabled={!digestText}>
            Create Email Draft
          </button>
        </div>

        <p className="kn-text-muted digest-note">Demo Mode: Daily 9AM trigger simulated manually.</p>

        {hasActivePreferences && (!digestJobs || digestJobs.length === 0) && (
          <div className="kn-card empty-panel">
            <h2 className="kn-heading kn-h2">No matching roles today.</h2>
            <p className="kn-body-text kn-text-muted empty-panel__text">
              No matching roles today. Check again tomorrow.
            </p>
          </div>
        )}

        {digestJobs && digestJobs.length > 0 && (
          <div className="kn-card digest-card">
            <header className="digest-card__header">
              <h2 className="kn-heading kn-h2">Top 10 Jobs For You — 9AM Digest</h2>
              <p className="kn-text-muted digest-card__date">{todayLabel}</p>
            </header>

            <ul className="digest-list">
              {digestJobs.map((job, index) => (
                <li key={job.id} className="digest-item">
                  <div className="digest-item__main">
                    <div>
                      <div className="digest-item__title">
                        <span className="digest-item__index">{index + 1}.</span>
                        <span>{job.title}</span>
                      </div>
                      <p className="kn-text-muted digest-item__meta">
                        {job.company} · {job.location} · {job.experience} · {job.matchScore}% match
                      </p>
                    </div>
                    <button
                      type="button"
                      className="kn-btn kn-btn--secondary digest-item__apply"
                      onClick={() => window.open(job.applyUrl, '_blank', 'noopener,noreferrer')}
                    >
                      Apply
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="digest-card__footer">
              <p className="kn-text-muted">
                This digest was generated based on your preferences. Demo Mode: Daily 9AM trigger simulated manually.
              </p>
            </footer>
          </div>
        )}

        {recentStatusUpdates.length > 0 && (
          <div className="kn-card digest-status">
            <h2 className="kn-heading kn-h3">Recent Status Updates</h2>
            <ul className="digest-status__list">
              {recentStatusUpdates.map((item) => (
                <li key={item.jobId} className="digest-status__item">
                  <div className="digest-status__title">
                    {item.title} <span className="kn-text-muted">· {item.company}</span>
                  </div>
                  <div className="digest-status__meta">
                    <span className="digest-status__status">{item.status}</span>
                    <span className="digest-status__date">{item.updatedAt.toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
