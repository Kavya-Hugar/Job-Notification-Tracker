const DIGEST_PREFIX = 'jobTrackerDigest_'

function getTodayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayDigestKey() {
  return `${DIGEST_PREFIX}${getTodayKey()}`
}

export function getTodayLabel() {
  const now = new Date()
  return now.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function loadDigest(key) {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveDigest(key, digestJobs) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(digestJobs))
  } catch {
    // Ignore storage errors; digest will still be visible for current session.
  }
}

