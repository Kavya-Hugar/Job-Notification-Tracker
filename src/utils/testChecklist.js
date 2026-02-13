const STORAGE_KEY = 'jobTrackerTestChecklist'

export const TEST_ITEMS = [
  {
    id: 'prefs-persist',
    label: 'Preferences persist after refresh',
    howTo: 'Change settings, refresh, and confirm your choices remain.',
  },
  {
    id: 'score-correct',
    label: 'Match score calculates correctly',
    howTo: 'Set clear preferences and verify a known job gets expected boosts.',
  },
  {
    id: 'toggle-matches',
    label: '"Show only matches" toggle works',
    howTo: 'Enable the toggle and confirm low-scoring roles disappear.',
  },
  {
    id: 'save-persist',
    label: 'Save job persists after refresh',
    howTo: 'Save a role, refresh, and confirm it still appears under Saved.',
  },
  {
    id: 'apply-new-tab',
    label: 'Apply opens in new tab',
    howTo: 'Click Apply and confirm a new tab opens without navigating away.',
  },
  {
    id: 'status-persist',
    label: 'Status update persists after refresh',
    howTo: 'Change a job status, refresh, and confirm the status remains.',
  },
  {
    id: 'status-filter',
    label: 'Status filter works correctly',
    howTo: 'Filter by Applied/Rejected/Selected and confirm only matching roles show.',
  },
  {
    id: 'digest-top10',
    label: 'Digest generates top 10 by score',
    howTo: 'Generate a digest and confirm it lists 10 highest-scoring roles.',
  },
  {
    id: 'digest-persist',
    label: 'Digest persists for the day',
    howTo: 'Generate a digest, refresh, and confirm the same list reappears.',
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on main pages',
    howTo: 'Open DevTools on key routes and confirm there are no errors.',
  },
]

export function loadTestChecklist() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveTestChecklist(map) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Ignore storage errors; checklist will still work for this session.
  }
}

