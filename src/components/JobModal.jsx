export default function JobModal({ job, onClose }) {
  if (!job) return null

  return (
    <div className="job-modal__backdrop" role="dialog" aria-modal="true" aria-labelledby="job-modal-title">
      <div className="kn-card job-modal">
        <header className="job-modal__header">
          <div>
            <h2 id="job-modal-title" className="kn-heading kn-h2">
              {job.title}
            </h2>
            <p className="kn-text-muted job-modal__company">
              {job.company} · {job.location} · {job.mode}
            </p>
          </div>
          <button type="button" className="kn-btn kn-btn--ghost job-modal__close" onClick={onClose}>
            Close
          </button>
        </header>

        <section className="job-modal__body">
          <p className="kn-body-text job-modal__description">
            {job.description.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>

          <div className="job-modal__meta">
            <div>
              <div className="job-modal__label">Experience</div>
              <div>{job.experience} years</div>
            </div>
            <div>
              <div className="job-modal__label">Salary</div>
              <div>{job.salaryRange}</div>
            </div>
          </div>

          <div className="job-modal__skills">
            <div className="job-modal__label">Skills</div>
            <div className="job-modal__skills-list">
              {job.skills.map((skill) => (
                <span key={skill} className="job-skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

