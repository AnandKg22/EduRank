import { ACTIVITY_STATUS } from '../../lib/constants';

const statusConfig = {
  [ACTIVITY_STATUS.IDLE]: { color: 'bg-success', label: 'Online' },
  [ACTIVITY_STATUS.SEARCHING]: { color: 'bg-warning animate-pulse', label: 'Searching' },
  [ACTIVITY_STATUS.BATTLING]: { color: 'bg-danger animate-pulse', label: 'In Battle' },
};

/**
 * UserStatusBadge — Color-coded activity status indicator.
 */
export default function UserStatusBadge({ status, showLabel = false }) {
  const config = statusConfig[status] || statusConfig[ACTIVITY_STATUS.IDLE];

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      {showLabel && (
        <span className="text-[10px] text-text-muted">{config.label}</span>
      )}
    </div>
  );
}
