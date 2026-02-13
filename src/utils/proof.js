const STORAGE_KEY = 'jobTrackerProofArtifacts'

export function loadProofArtifacts() {
  if (typeof window === 'undefined') {
    return {
      lovableProjectLink: '',
      githubRepoLink: '',
      deployedUrl: '',
    }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        lovableProjectLink: '',
        githubRepoLink: '',
        deployedUrl: '',
      }
    }
    const parsed = JSON.parse(raw)
    return {
      lovableProjectLink: parsed.lovableProjectLink || '',
      githubRepoLink: parsed.githubRepoLink || '',
      deployedUrl: parsed.deployedUrl || '',
    }
  } catch {
    return {
      lovableProjectLink: '',
      githubRepoLink: '',
      deployedUrl: '',
    }
  }
}

export function saveProofArtifacts(artifacts) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(artifacts))
  } catch {
    // Ignore storage issues; current session still works.
  }
}

export function isValidUrl(value) {
  if (!value) return false
  try {
    // eslint-disable-next-line no-new
    new URL(value)
    return true
  } catch {
    return false
  }
}

