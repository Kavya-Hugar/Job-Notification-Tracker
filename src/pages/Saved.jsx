import { useMemo, useState } from 'react'
import { jobs } from '../data/jobs'
import { useSavedJobIds } from '../hooks/useSavedJobIds'
import JobCard from '../components/JobCard'
import JobModal from '../components/JobModal'
import Toast from '../components/Toast'
import { loadPreferences } from '../utils/preferences'
import { computeMatchScore } from '../utils/matchScore'
import { DEFAULT_STATUS, getStatusForJob, loadStatusMap, saveStatusMap } from '../utils/status'

export default function Saved() {
  const { savedIds, toggleSave, isSaved } = useSavedJobIds()
  const [selectedJob, setSelectedJob] = useState(null)
  const [statusMap, setStatusMap] = useState(() => loadStatusMap())
  const [toastMessage, setToastMessage] = useState('')

  const preferences = useMemo(() => loadPreferences(), [])

  const savedJobs = useMemo(() => {
    const subset = jobs.filter((job) => savedIds.includes(job.id))
    return subset.map((job) => ({
      ...job,
      matchScore: computeMatchScore(job, preferences),
      status: getStatusForJob(statusMap, job.id),
    }))
  }, [savedIds, preferences, statusMap])

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
        <h1 className="kn-heading kn-h1">Saved</h1>
        <p className="kn-body-text kn-text-muted page__subtext">
          Keep a short, focused list of roles worth a second look. Scores stay in sync with your preferences.
        </p>
      </header>

      <div className="page__body">
        {savedJobs.length === 0 ? (
          <div className="kn-card empty-panel">
            <h2 className="kn-heading kn-h2">Nothing saved yet.</h2>
            <p className="kn-body-text kn-text-muted empty-panel__text">
              When you mark roles as Saved from the dashboard, they will appear here for quick follow-up.
            </p>
          </div>
        ) : (
          <section className="jobs-grid">
            {savedJobs.map((job) => (
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
            ))}
          </section>
        )}
      </div>

      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </section>
  )
}

