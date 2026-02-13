import { useEffect, useMemo, useState } from 'react'
import { jobs } from '../data/jobs'
import { getDefaultPreferences, loadPreferences, savePreferences } from '../utils/preferences'

const uniqueValues = (items, key) =>
  Array.from(new Set(items.map((item) => item[key]))).filter(Boolean).sort((a, b) => a.localeCompare(b))

export default function Settings() {
  const [preferences, setPreferences] = useState(getDefaultPreferences)

  useEffect(() => {
    setPreferences(loadPreferences())
  }, [])

  const locations = useMemo(() => uniqueValues(jobs, 'location'), [])

  const handleUpdate = (partial) => {
    setPreferences((current) => {
      const next = { ...current, ...partial }
      savePreferences(next)
      return next
    })
  }

  const handleRoleKeywordsChange = (event) => {
    handleUpdate({ roleKeywords: event.target.value })
  }

  const handleLocationsChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions).map((option) => option.value)
    handleUpdate({ preferredLocations: selectedValues })
  }

  const handleModeToggle = (mode) => {
    handleUpdate((current) => {
      const list = Array.isArray(current.preferredMode) ? current.preferredMode : []
      return list.includes(mode)
        ? { preferredMode: list.filter((value) => value !== mode) }
        : { preferredMode: [...list, mode] }
    })
  }

  const handleExperienceChange = (event) => {
    handleUpdate({ experienceLevel: event.target.value })
  }

  const handleSkillsChange = (event) => {
    handleUpdate({ skills: event.target.value })
  }

  const handleMinMatchScoreChange = (event) => {
    handleUpdate({ minMatchScore: Number(event.target.value) })
  }

  const preferredMode = Array.isArray(preferences.preferredMode) ? preferences.preferredMode : []

  return (
    <section className="page">
      <header className="page__header">
        <h1 className="kn-heading kn-h1">Settings</h1>
        <p className="kn-body-text kn-text-muted page__subtext">
          Define your preferences to activate intelligent, deterministic matching across the dashboard.
        </p>
      </header>

      <div className="page__body">
        <form className="settings-form" onSubmit={(event) => event.preventDefault()}>
          <div className="settings-form__field">
            <label className="settings-form__label" htmlFor="role-keywords">
              Role keywords
            </label>
            <input
              id="role-keywords"
              className="kn-input"
              type="text"
              placeholder="e.g. SDE Intern, React Developer"
              value={preferences.roleKeywords}
              onChange={handleRoleKeywordsChange}
            />
          </div>

          <div className="settings-form__field">
            <label className="settings-form__label" htmlFor="preferred-locations">
              Preferred locations
            </label>
            <select
              id="preferred-locations"
              className="kn-input settings-form__multiselect"
              multiple
              value={preferences.preferredLocations}
              onChange={handleLocationsChange}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <p className="kn-text-muted settings-form__help">
              Hold Ctrl (Windows) or Command (Mac) to select multiple locations.
            </p>
          </div>

          <div className="settings-form__field">
            <span className="settings-form__label">Preferred mode</span>
            <div className="settings-form__mode-options">
              {['Remote', 'Hybrid', 'Onsite'].map((mode) => (
                <label key={mode} className="settings-form__checkbox">
                  <input
                    type="checkbox"
                    checked={preferredMode.includes(mode)}
                    onChange={() => handleModeToggle(mode)}
                  />
                  <span>{mode}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="settings-form__field">
            <label className="settings-form__label" htmlFor="experience">
              Experience level
            </label>
            <select
              id="experience"
              className="kn-input"
              value={preferences.experienceLevel}
              onChange={handleExperienceChange}
            >
              <option value="">All</option>
              <option value="Fresher">Fresher</option>
              <option value="0-1">0-1</option>
              <option value="1-3">1-3</option>
              <option value="3-5">3-5</option>
            </select>
          </div>

          <div className="settings-form__field">
            <label className="settings-form__label" htmlFor="skills">
              Skills
            </label>
            <input
              id="skills"
              className="kn-input"
              type="text"
              placeholder="e.g. Java, React, SQL"
              value={preferences.skills}
              onChange={handleSkillsChange}
            />
          </div>

          <div className="settings-form__field">
            <label className="settings-form__label" htmlFor="min-match-score">
              Minimum match score
            </label>
            <input
              id="min-match-score"
              type="range"
              min="0"
              max="100"
              step="5"
              value={preferences.minMatchScore}
              onChange={handleMinMatchScoreChange}
            />
            <p className="kn-text-muted settings-form__help">
              Current threshold: <strong>{preferences.minMatchScore}</strong>
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
