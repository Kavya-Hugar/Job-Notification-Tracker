const STORAGE_KEY = 'jobTrackerStatus'

export const DEFAULT_STATUS = 'Not Applied'
export const STATUS_VALUES = ['Not Applied', 'Applied', 'Rejected', 'Selected']

export function loadStatusMap() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return parsed
    }
    return {}
  } catch {
    return {}
  }
}

export function saveStatusMap(map) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Ignore storage errors; UI will continue for current session.
  }
}

export function getStatusForJob(statusMap, jobId) {
  const entry = statusMap[jobId]
  if (!entry) return DEFAULT_STATUS
  if (typeof entry === 'string') return entry
  return entry.status || DEFAULT_STATUS
}

