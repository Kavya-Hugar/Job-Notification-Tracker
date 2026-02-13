import { useMemo, useState } from 'react'
import { loadTestChecklist, saveTestChecklist, TEST_ITEMS } from '../utils/testChecklist'

export default function JtTest() {
  const [checkedMap, setCheckedMap] = useState(() => loadTestChecklist())

  const total = TEST_ITEMS.length
  const passedCount = useMemo(
    () => TEST_ITEMS.filter((item) => Boolean(checkedMap[item.id])).length,
    [checkedMap],
  )

  const allPassed = passedCount === total

  const handleToggle = (id) => {
    setCheckedMap((current) => {
      const next = { ...current, [id]: !current[id] }
      saveTestChecklist(next)
      return next
    })
  }

  const handleReset = () => {
    setCheckedMap({})
    saveTestChecklist({})
  }

  return (
    <section className="page">
      <header className="page__header">
        <h1 className="kn-heading kn-h1">Built-In Test Checklist</h1>
        <p className="kn-body-text kn-text-muted page__subtext">
          Use this checklist to validate the Job Notification Tracker before you ship.
        </p>
      </header>

      <div className="page__body">
        <div className="kn-card test-summary">
          <div className="test-summary__main">
            <div className="test-summary__count">Tests Passed: {passedCount} / {total}</div>
            {!allPassed && (
              <p className="kn-text-muted test-summary__warning">
                Resolve all issues before shipping.
              </p>
            )}
          </div>
          <button type="button" className="kn-btn kn-btn--ghost test-summary__reset" onClick={handleReset}>
            Reset Test Status
          </button>
        </div>

        <div className="kn-card test-checklist">
          <ul className="test-checklist__list">
            {TEST_ITEMS.map((item) => (
              <li key={item.id} className="test-checklist__item">
                <label className="test-checklist__label">
                  <input
                    type="checkbox"
                    checked={Boolean(checkedMap[item.id])}
                    onChange={() => handleToggle(item.id)}
                  />
                  <span>{item.label}</span>
                </label>
                {item.howTo && (
                  <span className="test-checklist__hint" title={item.howTo}>
                    How to test
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

