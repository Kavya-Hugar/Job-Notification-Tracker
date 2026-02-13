import { useMemo, useState } from 'react'
import { jobs } from '../data/jobs'
import { useSavedJobIds } from '../hooks/useSavedJobIds'
import JobCard from '../components/JobCard'
import JobModal from '../components/JobModal'
import Toast from '../components/Toast'
import { loadPreferences } from '../utils/preferences'
import { computeMatchScore } from '../utils/matchScore'
import { DEFAULT_STATUS, getStatusForJob, loadStatusMap, saveStatusMap } from '../utils/status'

const uniqueValues = (items, key) =>
  Array.from(new Set(items.map((item) => item[key]))).filter(Boolean).sort((a, b) => a.localeCompare(b))

const parseSalaryLowerBound = (salaryRange) => {
  if (!salaryRange) return 0
  const match = String(salaryRange).match(/\d+/)
  if (!match) return 0
  return Number(match[0]) || 0
}

export default function Dashboard() {
  const { savedIds, toggleSave, isSaved } = useSavedJobIds()
  const [selectedJob, setSelectedJob] = useState(null)
  const [statusMap, setStatusMap] = useState(() => loadStatusMap())
  const [toastMessage, setToastMessage] = useState('')

  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('all')
  const [mode, setMode] = useState('all')
  const [experience, setExperience] = useState('all')
  const [source, setSource] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState('latest')
  const [showOnlyMatches, setShowOnlyMatches] = useState(false)

  const preferences = useMemo(() => loadPreferences(), [])

  const locations = useMemo(() => uniqueValues(jobs, 'location'), [])
  const modes = useMemo(() => uniqueValues(jobs, 'mode'), [])
  const experiences = useMemo(() => uniqueValues(jobs, 'experience'), [])
  const sources = useMemo(() => uniqueValues(jobs, 'source'), [])

  const scoredJobs = useMemo(
    () =>
      jobs.map((job) => ({
        ...job,
        matchScore: computeMatchScore(job, preferences),
        status: getStatusForJob(statusMap, job.id),
      })),
    [preferences, statusMap],
  )

  const hasActivePreferences =
    Boolean(preferences.roleKeywords && preferences.roleKeywords.trim()) ||
    (Array.isArray(preferences.preferredLocations) && preferences.preferredLocations.length > 0) ||
    (Array.isArray(preferences.preferredMode) && preferences.preferredMode.length > 0) ||
    Boolean(preferences.experienceLevel) ||
    Boolean(preferences.skills && preferences.skills.trim())

  const filteredJobs = useMemo(() => {
    let result = scoredJobs

    if (keyword.trim()) {
      const lower = keyword.toLowerCase()
      result = result.filter(
        (job) => job.title.toLowerCase().includes(lower) || job.company.toLowerCase().includes(lower),
      )
    }

    if (location !== 'all') {
      result = result.filter((job) => job.location === location)
    }

    if (mode !== 'all') {
      result = result.filter((job) => job.mode === mode)
    }

    if (experience !== 'all') {
      result = result.filter((job) => job.experience === experience)
    }

    if (source !== 'all') {
      result = result.filter((job) => job.source === source)
    }

    if (statusFilter !== 'all') {
      result = result.filter((job) => job.status === statusFilter)
    }

    if (showOnlyMatches) {
      const threshold =
        typeof preferences.minMatchScore === 'number' && !Number.isNaN(preferences.minMatchScore)
          ? preferences.minMatchScore
          : 40
      result = result.filter((job) => job.matchScore >= threshold)
    }

    const sorted = [...result]
    if (sort === 'latest') {
      sorted.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo)
    } else if (sort === 'match') {
      sorted.sort((a, b) => b.matchScore - a.matchScore)
    } else if (sort === 'salary') {
      sorted.sort((a, b) => parseSalaryLowerBound(b.salaryRange) - parseSalaryLowerBound(a.salaryRange))
    }

    return sorted
  }, [
    keyword,
    location,
    mode,
    experience,
    source,
    statusFilter,
    sort,
    showOnlyMatches,
    scoredJobs,
    preferences.minMatchScore,
  ])

  const handleApply = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleStatusChange = (job, newStatus) => {
    setStatusMap((current) => {
      const next = {
        ...current,
        [job.id]: { status: newStatus, updatedAt: new Date().toISOString() },
      }
      saveStatusMap(next)
      return next
    })

    if (newStatus !== DEFAULT_STATUS) {
      setToastMessage(`Status updated: ${newStatus}`)
    }
  }

  return (
    <section className="page">
      <header className="page__header">
        <h1 className="kn-heading kn-h1">Dashboard</h1>
        <p className="kn-body-text kn-text-muted page__subtext">
          Explore a realistic dataset of Indian tech roles. Matching and scoring are now driven by your preferences.
        </p>
      </header>

      <div className="page__body page__body--with-filters">
        {!hasActivePreferences && (
          <div className="kn-card dashboard-banner">
            <p className="kn-body-text kn-text-muted">
              Set your preferences in Settings to activate intelligent matching and personalised scores.
            </p>
          </div>
        )}

        <section className="filters-bar kn-card">
          <div className="filters-bar__row">
            <div className="filters-bar__field filters-bar__field--keyword">
              <label htmlFor="keyword" className="filters-bar__label">
                Search
              </label>
              <input
                id="keyword"
                className="kn-input"
                type="text"
                placeholder="Search by title or company"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
            <div className="filters-bar__field">
              <label htmlFor="location" className="filters-bar__label">
                Location
              </label>
              <select
                id="location"
                className="kn-input"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              >
                <option value="all">All</option>
                {locations.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="filters-bar__field">
              <label htmlFor="mode" className="filters-bar__label">
                Mode
              </label>
              <select id="mode" className="kn-input" value={mode} onChange={(event) => setMode(event.target.value)}>
                <option value="all">All</option>
                {modes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filters-bar__row">
            <div className="filters-bar__field">
              <label htmlFor="experience" className="filters-bar__label">
                Experience
              </label>
              <select
                id="experience"
                className="kn-input"
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
              >
                <option value="all">All</option>
                {experiences.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="filters-bar__field">
              <label htmlFor="source" className="filters-bar__label">
                Source
              </label>
              <select
                id="source"
                className="kn-input"
                value={source}
                onChange={(event) => setSource(event.target.value)}
              >
                <option value="all">All</option>
                {sources.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="filters-bar__field">
              <label htmlFor="status" className="filters-bar__label">
                Status
              </label>
              <select
                id="status"
                className="kn-input"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All</option>
                <option value="Not Applied">Not Applied</option>
                <option value="Applied">Applied</option>
                <option value="Rejected">Rejected</option>
                <option value="Selected">Selected</option>
              </select>
            </div>
            <div className="filters-bar__field">
              <label htmlFor="sort" className="filters-bar__label">
                Sort
              </label>
              <select id="sort" className="kn-input" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="latest">Latest</option>
                <option value="match">Match score</option>
                <option value="salary">Salary (approx)</option>
              </select>
            </div>
          </div>

          <div className="filters-bar__footer">
            <label className="filters-bar__toggle">
              <input
                type="checkbox"
                checked={showOnlyMatches}
                onChange={(event) => setShowOnlyMatches(event.target.checked)}
              />
              <span>Show only jobs above my threshold</span>
            </label>
          </div>
        </section>

        <section className="jobs-grid">
          {filteredJobs.length === 0 ? (
            <div className="kn-card empty-panel">
              <h2 className="kn-heading kn-h2">No roles match your criteria.</h2>
              <p className="kn-body-text kn-text-muted empty-panel__text">
                Adjust filters or lower your match threshold to see more opportunities.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={isSaved(job.id)}
                onToggleSave={toggleSave}
                onView={setSelectedJob}
                onApply={handleApply}
                status={job.status}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </section>
      </div>

      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </section>
  )
}

