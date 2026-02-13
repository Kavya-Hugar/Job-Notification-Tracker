const STORAGE_KEY = 'jobTrackerPreferences'

const createDefaultPreferences = () => ({
  roleKeywords: '',
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: '',
  skills: '',
  minMatchScore: 40,
})

export function loadPreferences() {
  if (typeof window === 'undefined') {
    return createDefaultPreferences()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultPreferences()

    const parsed = JSON.parse(raw)
    const base = createDefaultPreferences()

    return {
      ...base,
      ...parsed,
      preferredLocations: Array.isArray(parsed.preferredLocations) ? parsed.preferredLocations : [],
      preferredMode: Array.isArray(parsed.preferredMode) ? parsed.preferredMode : [],
      minMatchScore:
        typeof parsed.minMatchScore === 'number' && !Number.isNaN(parsed.minMatchScore)
          ? parsed.minMatchScore
          : base.minMatchScore,
    }
  } catch {
    return createDefaultPreferences()
  }
}

export function savePreferences(preferences) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // Ignore storage errors; UI will continue to function for current session.
  }
}

export function getDefaultPreferences() {
  return createDefaultPreferences()
}

