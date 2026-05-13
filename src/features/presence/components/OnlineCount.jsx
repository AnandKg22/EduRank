import { usePresenceStore } from '../../../stores/usePresenceStore';

/**
 * OnlineCount — Displays the count of currently online users.
 */
export const OnlineCount = () => {
  const count = usePresenceStore((s) => s.onlineUsers.length);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-light/50">
      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
      <span className="text-xs font-medium text-text-secondary">
        {count} online
      </span>
    </div>
  );
};

export default OnlineCount;
