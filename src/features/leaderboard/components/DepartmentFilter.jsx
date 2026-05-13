import { DEPARTMENTS } from '../../../lib/constants';

/**
 * DepartmentFilter — Isolated dropdown filter controlling domain scope query parameters.
 */
export const DepartmentFilter = ({ value, onChange }) => {
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
};

export default DepartmentFilter;
