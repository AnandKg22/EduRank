import { usePresenceStore } from '../../../stores/usePresenceStore';
import { UserStatusBadge } from './UserStatusBadge';

/**
 * OnlineSidebar — Displays the list of currently online users.
 */
export const OnlineSidebar = () => {
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Online Players
        </span>
        <span className="text-xs text-primary font-medium">{onlineUsers.length}</span>
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto">
        {onlineUsers.length === 0 ? (
          <p className="text-xs text-text-muted px-1 py-2">No players online</p>
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user.userId}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-light/50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-[10px] font-bold shrink-0">
                {user.username?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">
                  {user.username}
                </p>
              </div>
              <UserStatusBadge status={user.activity} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OnlineSidebar;
