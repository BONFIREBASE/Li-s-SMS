import { IconPlus, IconEdit, IconTrash } from './Icons'
import {
  gradeBadgeClass,
  gradeDescription,
  gradeUnitsEarned,
  gwaColor,
} from '../utils/grades'

/**
 * A single student's grades, shown after selecting their name on the Grades page.
 * Lets staff add, edit and delete that student's grades without leaving the view.
 */
export default function StudentGradePanel({
  data,
  loading,
  canModify,
  onBack,
  onAdd,
  onEdit,
  onDelete,
}) {
  const grades = data.grades || []

  return (    <div>
      <button className="btn btn-ghost btn-sm back-link" onClick={onBack} id="grades-back-btn">
        &lsaquo; All students
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">{data.student_name}</h1>
          <p className="page-subtitle">
            {data.student_id}
            {data.program ? ` · ${data.program}` : ''}
            {data.year_level ? ` · ${data.year_level}` : ''}
          </p>
        </div>
        {canModify && (
          <button className="btn btn-primary" onClick={onAdd} id="add-grade-btn">
            <IconPlus /> Record Grade
          </button>
        )}
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-card-label">GWA</div>
          <div className="stat-card-value" style={{ color: gwaColor(data.gwa ?? 5) }}>
            {(data.gwa ?? 5).toFixed(2)}
          </div>
          <div className="stat-hint">Weighted by units</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Simple GPA</div>
          <div className="stat-card-value" style={{ color: gwaColor(data.gpa ?? 5) }}>
            {(data.gpa ?? 5).toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Units Earned</div>
          <div className="stat-card-value">{data.units_earned ?? 0}</div>
          <div className="stat-hint">Failed and dropped subjects excluded</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Incomplete</div>
          <div className="stat-card-value">{data.incomplete_count ?? 0}</div>
          <div className="stat-hint">Not counted in GWA</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Dropped</div>
          <div className="stat-card-value">{data.dropped_count ?? 0}</div>
          <div className="stat-hint">Counts as 5.00, no units</div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-page"><div className="spinner spinner-lg" /></div>
        ) : grades.length === 0 ? (
          <div className="table-empty">
            No grades recorded for this student yet.
          </div>
        ) : (
          <table className="data-table" id="student-grades-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Units</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Points</th>
                <th>Recorded By</th>                {canModify && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{g.subject.code}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-gray-400)' }}>
                      {g.subject.name}
                    </div>
                  </td>
                  <td>
                    <UnitsCell grade={g} />
                  </td>
<td>
                      <div style={{ fontWeight: 500 }}>{g.score ?? '—'}</div>
                      {g.remark && (
                        <div
                          style={{
                            fontSize: 'var(--font-xs)',
                            color: 'var(--color-gray-400)',
                            maxWidth: 180,
                          }}
                          title={g.remark}
                        >
                          {g.remark}
                        </div>
                      )}
                    </td>
                  <td>
                    <span
                      className={gradeBadgeClass(g.letter)}
                      title={gradeDescription(g.letter)}
                    >
                      {g.letter}
                    </span>
                  </td>
                  <td>{g.grade_points ?? '—'}</td>
                  <td style={{ color: 'var(--color-gray-500)' }}>{g.recorded_by || '—'}</td>
                  {canModify && (
                    <td>
                      <div className="table-actions">
                        {g.can_edit ? (
                          <>
                            <button
                              className="btn-icon btn-ghost"
                              title={`Edit ${g.subject.code}`}
                              onClick={() => onEdit(g)}
                            >
                              <IconEdit />
                            </button>
                            <button
                              className="btn-icon btn-ghost"
                              title="Delete"
                              onClick={() => onDelete(g)}
                            >
                              <IconTrash />
                            </button>
                          </>
                        ) : (
                          <span
                            className="table-locked"
                            title={`Only the teacher for ${g.subject.code}, or an admin, can change this grade.`}
                          >
                            view only
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

/**
 * Credit units this subject actually earned.
 *
 * A failed or dropped subject shows 0 against its nominal units, so the reason
 * the student's units-earned total is lower than their subject load is visible
 * on the row rather than only in the summary card.
 */
export function UnitsCell({ grade }) {
  const nominal = grade.subject.units || 0
  const earned = grade.units_earned ?? gradeUnitsEarned(grade)

  if (earned === nominal) return <>{earned}</>

  const reason = grade.is_dropped
    ? 'Dropped'
    : grade.is_incomplete
      ? 'Incomplete'
      : 'Not passed'

  return (
    <div title={`${reason}: ${nominal} unit${nominal === 1 ? '' : 's'} not earned`}>
      <span style={{ color: 'var(--color-gray-400)', textDecoration: 'line-through' }}>
        {nominal}
      </span>{' '}
      <span style={{ fontWeight: 600 }}>{earned}</span>
      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-gray-400)' }}>
        {reason}
      </div>
    </div>
  )
}
