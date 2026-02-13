import { useEffect, useState } from 'react'

const STORAGE_KEY = 'job-notification-tracker:saved-jobs'

export function useSavedJobIds() {
  const [savedIds, setSavedIds] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds))
    } catch {
      // Ignore storage errors; UI will still function for current session.
    }
  }, [savedIds])

  const toggleSave = (id) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
    )
  }

  const isSaved = (id) => savedIds.includes(id)

  return { savedIds, toggleSave, isSaved }
}

