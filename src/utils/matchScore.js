function normaliseCommaSeparated(text) {
  return text
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

function hasAnyMatch(haystack, needles) {
  if (!needles.length) return false
  const lowerHaystack = haystack.toLowerCase()
  return needles.some((needle) => lowerHaystack.includes(needle))
}

export function computeMatchScore(job, preferences) {
  if (!preferences) return 0

  let score = 0

  const roleKeywords = normaliseCommaSeparated(preferences.roleKeywords || '')
  const skillKeywords = normaliseCommaSeparated(preferences.skills || '')

  // +25 if any roleKeyword appears in job.title (case-insensitive)
  if (hasAnyMatch(job.title, roleKeywords)) {
    score += 25
  }

  // +15 if any roleKeyword appears in job.description
  if (hasAnyMatch(job.description, roleKeywords)) {
    score += 15
  }

  // +15 if job.location matches preferredLocations
  if (Array.isArray(preferences.preferredLocations) && preferences.preferredLocations.length > 0) {
    if (preferences.preferredLocations.includes(job.location)) {
      score += 15
    }
  }

  // +10 if job.mode matches preferredMode (any selected)
  if (Array.isArray(preferences.preferredMode) && preferences.preferredMode.length > 0) {
    if (preferences.preferredMode.includes(job.mode)) {
      score += 10
    }
  }

  // +10 if job.experience matches experienceLevel
  if (preferences.experienceLevel && job.experience === preferences.experienceLevel) {
    score += 10
  }

  // +15 if overlap between job.skills and user.skills (any match)
  if (skillKeywords.length && Array.isArray(job.skills) && job.skills.length > 0) {
    const jobSkillsLower = job.skills.map((skill) => skill.toLowerCase())
    const hasOverlap = skillKeywords.some((keyword) => jobSkillsLower.includes(keyword))
    if (hasOverlap) {
      score += 15
    }
  }

  // +5 if postedDaysAgo <= 2
  if (typeof job.postedDaysAgo === 'number' && job.postedDaysAgo <= 2) {
    score += 5
  }

  // +5 if source is LinkedIn
  if (job.source === 'LinkedIn') {
    score += 5
  }

  if (score > 100) return 100
  if (score < 0) return 0
  return score
}

export function getMatchBand(score) {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  if (score >= 40) return 'low'
  return 'minimal'
}

