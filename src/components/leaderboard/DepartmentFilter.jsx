import { DEPARTMENTS } from '../../lib/constants';

/**
 * DepartmentFilter — Dropdown to filter leaderboard by department.
 */
export default function DepartmentFilter({ value, onChange }) {
  return (
    <select
      id="department-filter"
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="px-4 py-2 rounded-xl bg-surface-light/50 border border-surface-lighter
                 text-text-primary text-sm
                 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
                 transition-all appearance-none cursor-pointer"
    >
      <option value="" className="bg-surface-light">All Departments</option>
      {DEPARTMENTS.map((dept) => (
        <option key={dept} value={dept} className="bg-surface-light">
          {dept}
        </option>
      ))}
    </select>
  );
}
