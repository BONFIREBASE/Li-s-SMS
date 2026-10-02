/**
 * University of Antique grading helpers (1.00 - 5.00 scale).
 * Lower values are better; 3.00 is the passing mark, 5.00 is a fail.
 *
 * INC and DRP are markers rather than grades: INC is an unfinished subject and
 * carries no points, while DRP is a dropped subject recorded at the failing
 * 5.00. Neither earns credit units.
 */

/** Grade code recorded for a dropped subject. Matches grades.models.GRADE_DROPPED. */
export const GRADE_DROPPED = 'DRP'

/** Grade code recorded for an unfinished subject. Matches grades.models.GRADE_INC. */
export const GRADE_INCOMPLETE = 'INC'

/** Grade points at or above which a subject earns no credit units. */
export const FAILING_GRADE_POINTS = 5.0

export const GRADE_POINT_ORDER = [
  '1.00',
  '1.25',
  '1.50',
  '1.75',
  '2.00',
  '2.25',
  '2.50',
  '2.75',
  '3.00',
  GRADE_INCOMPLETE,
  '5.00',
  GRADE_DROPPED,
]

export const GRADE_DESCRIPTIONS = {
  '1.00': 'Outstanding (98-100)',
  '1.25': 'Excellent (95-97)',
  '1.50': 'Very Good (92-94)',
  '1.75': 'Good (89-91)',
  '2.00': 'Fairly Good (86-88)',
  '2.25': 'Fair (83-85)',
  '2.50': 'Satisfactory (80-82)',
  '2.75': 'Needs Improvement (77-79)',
  '3.00': 'Passing (75-76)',
  [GRADE_INCOMPLETE]: 'Incomplete (not counted)',
  '5.00': 'Failed (below 75)',
  [GRADE_DROPPED]: 'Dropped (no units earned)',
}

const BADGE_BY_GRADE_POINT = {
  '1.00': 'badge-gp-1',
  '1.25': 'badge-gp-1',
  '1.50': 'badge-gp-2',
  '1.75': 'badge-gp-2',
  '2.00': 'badge-gp-3',
  '2.25': 'badge-gp-3',
  '2.50': 'badge-gp-4',
  '2.75': 'badge-gp-4',
  '3.00': 'badge-gp-5',
  [GRADE_INCOMPLETE]: 'badge-gp-inc',
  '5.00': 'badge-gp-fail',
  [GRADE_DROPPED]: 'badge-gp-dropped',
}

const COLOR_BY_GRADE_POINT = {
  '1.00': 'var(--color-success)',
  '1.25': 'var(--color-success)',
  '1.50': 'var(--color-info)',
  '1.75': 'var(--color-info)',
  '2.00': 'var(--color-gold-600)',
  '2.25': 'var(--color-gold-600)',
  '2.50': 'var(--color-warning)',
  '2.75': 'var(--color-warning)',
  '3.00': 'var(--color-warning)',
  [GRADE_INCOMPLETE]: 'var(--color-gray-500)',
  '5.00': 'var(--color-error)',
  // Distinct from a fail: a drop is a withdrawal, not a failed attempt.
  [GRADE_DROPPED]: 'var(--color-gray-600)',
}

const MARKER_ALIASES = {
  [GRADE_INCOMPLETE]: GRADE_INCOMPLETE,
  I: GRADE_INCOMPLETE,
  INCORRECT: GRADE_INCOMPLETE,
  [GRADE_DROPPED]: GRADE_DROPPED,
  D: GRADE_DROPPED,
  DROPPED: GRADE_DROPPED,
  DROP: GRADE_DROPPED,
}

const normalize = (value) => {
  if (value === null || value === undefined) return ''
  const text = String(value).trim().toUpperCase()
  // INC and DRP are labels, not numbers, so they must not run through toFixed().
  if (Object.prototype.hasOwnProperty.call(MARKER_ALIASES, text)) {
    return MARKER_ALIASES[text]
  }
  if (text === '') return ''
  const num = Number.parseFloat(text)
  return Number.isNaN(num) ? text : num.toFixed(2)
}

export const gradeBadgeClass = (value) => `badge ${BADGE_BY_GRADE_POINT[normalize(value)] || 'badge-gp-inc'}`

export const gradeColor = (value) => COLOR_BY_GRADE_POINT[normalize(value)] || 'var(--color-gray-500)'

export const gradeDescription = (value) => GRADE_DESCRIPTIONS[normalize(value)] || ''

/**
 * Credit units a grade earns the student.
 *
 * Mirrors Student.units_earned on the server: a grade earns its units only when
 * it passed, so INC, a 5.00 fail, and a drop all earn nothing.
 */
export const gradeUnitsEarned = (grade) => {
  if (!grade) return 0
  if (grade.is_incomplete || grade.is_dropped) return 0
  const points = Number.parseFloat(grade.grade_points)
  if (Number.isNaN(points) || points >= FAILING_GRADE_POINTS) return 0
  return grade.subject?.units || 0
}

/** Colour for a GPA or GWA on the 1.00-5.00 scale (lower is better). */
export const gpaColor = (value) => {
  const num = Number.parseFloat(value)
  if (Number.isNaN(num)) return 'var(--color-gray-500)'
  if (num <= 1.5) return 'var(--color-success)'
  if (num <= 2.0) return 'var(--color-info)'
  if (num <= 2.5) return 'var(--color-gold-600)'
  if (num <= 3.0) return 'var(--color-warning)'
  return 'var(--color-error)'
}

export const gwaColor = gpaColor
