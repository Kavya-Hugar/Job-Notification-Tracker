import { useMemo, useState } from 'react'
import { loadTestChecklist, TEST_ITEMS } from '../utils/testChecklist'
import { loadProofArtifacts, saveProofArtifacts, isValidUrl } from '../utils/proof'

function getShipStatus(allTestsPassed, allLinksValid, anyProgress) {
  if (allTestsPassed && allLinksValid) return 'Shipped'
  if (!anyProgress) return 'Not Started'
  return 'In Progress'
}

function getStatusClass(status) {
  if (status === 'Shipped') return 'kn-badge--shipped'
  if (status === 'In Progress') return 'kn-badge--in-progress'
  return 'kn-badge--not-started'
}

export default function JtProof() {
  const checklist = loadTestChecklist()
  const checklistPassed = TEST_ITEMS.filter((item) => Boolean(checklist[item.id])).length === TEST_ITEMS.length

  const [artifacts, setArtifacts] = useState(() => loadProofArtifacts())
  const [touched, setTouched] = useState({})

  const lovableValid = isValidUrl(artifacts.lovableProjectLink)
  const githubValid = isValidUrl(artifacts.githubRepoLink)
  const deployedValid = isValidUrl(artifacts.deployedUrl)
  const allLinksValid = lovableValid && githubValid && deployedValid
  const anyProgress =
    Boolean(artifacts.lovableProjectLink || artifacts.githubRepoLink || artifacts.deployedUrl) || checklistPassed

  const shipStatus = useMemo(
    () => getShipStatus(checklistPassed, allLinksValid, anyProgress),
    [checklistPassed, allLinksValid, anyProgress],
  )

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setArtifacts((current) => {
      const next = { ...current, [field]: value }
      saveProofArtifacts(next)
      return next
    })
  }

  const handleBlur = (field) => () => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleCopySubmission = async () => {
    const lines = []
    lines.push('------------------------------------------')
    lines.push('Job Notification Tracker — Final Submission')
    lines.push('')
    lines.push('Lovable Project:')
    lines.push(artifacts.lovableProjectLink || '<not provided>')
    lines.push('')
    lines.push('GitHub Repository:')
    lines.push(artifacts.githubRepoLink || '<not provided>')
    lines.push('')
    lines.push('Live Deployment:')
    lines.push(artifacts.deployedUrl || '<not provided>')
    lines.push('')
    lines.push('Core Features:')
    lines.push('- Intelligent match scoring')
    lines.push('- Daily digest simulation')
    lines.push('- Status tracking')
    lines.push('- Test checklist enforced')
    lines.push('------------------------------------------')

    const text = lines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Silent failure; user can still copy manually.
    }
  }

  return (
    <section className="page">
      <header className="page__header">
        <div className="proof-header">
          <div>
            <h1 className="kn-heading kn-h1">Project 1 — Job Notification Tracker</h1>
            <p className="kn-body-text kn-text-muted page__subtext">
              Final proof and submission details for your Job Notification Tracker build.
            </p>
          </div>
          <span className={`kn-badge ${getStatusClass(shipStatus)}`}>{shipStatus}</span>
        </div>
      </header>

      <div className="page__body">
        <section className="kn-card proof-summary">
          <h2 className="kn-heading kn-h3">Step Completion Summary</h2>
          <ul className="proof-summary__list">
            <li className="proof-summary__item">
              <span>Step 1 — Design System & Layout</span>
              <span className="proof-summary__status">Completed</span>
            </li>
            <li className="proof-summary__item">
              <span>Step 2 — Routing Shell</span>
              <span className="proof-summary__status">Completed</span>
            </li>
            <li className="proof-summary__item">
              <span>Step 3 — Dataset & Dashboard</span>
              <span className="proof-summary__status">Completed</span>
            </li>
            <li className="proof-summary__item">
              <span>Step 4 — Preferences & Scoring</span>
              <span className="proof-summary__status">Completed</span>
            </li>
            <li className="proof-summary__item">
              <span>Step 5 — Status Tracking</span>
              <span className="proof-summary__status">Completed</span>
            </li>
            <li className="proof-summary__item">
              <span>Step 6 — Daily Digest Engine</span>
              <span className="proof-summary__status">Completed</span>
            </li>
            <li className="proof-summary__item">
              <span>Step 7 — Built-In Test Checklist</span>
              <span className="proof-summary__status">{checklistPassed ? 'Completed' : 'Pending'}</span>
            </li>
            <li className="proof-summary__item">
              <span>Step 8 — Final Proof & Submission</span>
              <span className="proof-summary__status">{allLinksValid ? 'Completed' : 'Pending'}</span>
            </li>
          </ul>
          {shipStatus === 'Shipped' && (
            <p className="kn-text-muted proof-summary__shipped">Project 1 Shipped Successfully.</p>
          )}
        </section>

        <section className="kn-card proof-artifacts">
          <header className="proof-artifacts__header">
            <h2 className="kn-heading kn-h3">Artifact Collection</h2>
            <p className="kn-text-muted">
              Provide final links for your Lovable project, source code, and live deployment.
            </p>
          </header>

          <div className="proof-artifacts__field">
            <label className="settings-form__label" htmlFor="lovable-link">
              Lovable Project Link
            </label>
            <input
              id="lovable-link"
              className="kn-input"
              type="url"
              placeholder="https://lovable.dev/..."
              value={artifacts.lovableProjectLink}
              onChange={handleChange('lovableProjectLink')}
              onBlur={handleBlur('lovableProjectLink')}
            />
            {touched.lovableProjectLink && !lovableValid && (
              <p className="kn-text-muted proof-artifacts__error">Enter a valid URL.</p>
            )}
          </div>

          <div className="proof-artifacts__field">
            <label className="settings-form__label" htmlFor="github-link">
              GitHub Repository Link
            </label>
            <input
              id="github-link"
              className="kn-input"
              type="url"
              placeholder="https://github.com/..."
              value={artifacts.githubRepoLink}
              onChange={handleChange('githubRepoLink')}
              onBlur={handleBlur('githubRepoLink')}
            />
            {touched.githubRepoLink && !githubValid && (
              <p className="kn-text-muted proof-artifacts__error">Enter a valid URL.</p>
            )}
          </div>

          <div className="proof-artifacts__field">
            <label className="settings-form__label" htmlFor="deploy-link">
              Deployed URL (Vercel or equivalent)
            </label>
            <input
              id="deploy-link"
              className="kn-input"
              type="url"
              placeholder="https://your-app.vercel.app/..."
              value={artifacts.deployedUrl}
              onChange={handleChange('deployedUrl')}
              onBlur={handleBlur('deployedUrl')}
            />
            {touched.deployedUrl && !deployedValid && (
              <p className="kn-text-muted proof-artifacts__error">Enter a valid URL.</p>
            )}
          </div>

          <div className="proof-artifacts__actions">
            <button
              type="button"
              className="kn-btn kn-btn--primary"
              onClick={handleCopySubmission}
              disabled={!allLinksValid}
            >
              Copy Final Submission
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}

