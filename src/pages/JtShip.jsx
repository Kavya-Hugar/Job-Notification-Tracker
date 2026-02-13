import { loadTestChecklist, TEST_ITEMS } from '../utils/testChecklist'
import { loadProofArtifacts, isValidUrl } from '../utils/proof'

export default function JtShip() {
  const checklist = loadTestChecklist()
  const total = TEST_ITEMS.length
  const passedCount = TEST_ITEMS.filter((item) => Boolean(checklist[item.id])).length
  const testsPassed = passedCount === total

  const artifacts = loadProofArtifacts()
  const lovableValid = isValidUrl(artifacts.lovableProjectLink)
  const githubValid = isValidUrl(artifacts.githubRepoLink)
  const deployedValid = isValidUrl(artifacts.deployedUrl)
  const allLinksValid = lovableValid && githubValid && deployedValid

  const allReady = testsPassed && allLinksValid

  return (
    <section className="page">
      <header className="page__header">
        <h1 className="kn-heading kn-h1">Ship</h1>
        <p className="kn-body-text kn-text-muted page__subtext">
          Final verification step before releasing Job Notification Tracker.
        </p>
      </header>

      <div className="page__body">
        {!allReady ? (
          <div className="kn-card empty-panel">
            <h2 className="kn-heading kn-h2">Ship is locked.</h2>
            <p className="kn-body-text kn-text-muted empty-panel__text">
              Tests Passed: {passedCount} / {total}. Ensure all 10 checklist items pass and all proof links are valid
              before shipping.
            </p>
          </div>
        ) : (
          <div className="kn-card empty-panel">
            <h2 className="kn-heading kn-h2">Ready to ship.</h2>
            <p className="kn-body-text kn-text-muted empty-panel__text">
              All checklist items are complete and proof artifacts are in place. Project 1 Shipped Successfully.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

