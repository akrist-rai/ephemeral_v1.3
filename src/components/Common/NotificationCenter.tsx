import React, { useEffect, useRef } from 'react';

export type NotifType = 'complete' | 'attention';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  detail?: string;
  timestamp: number;
  read: boolean;
}

interface Props {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onMarkRead: () => void;
  onClose: () => void;
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export const NotificationCenter: React.FC<Props> = ({
  notifications, onDismiss, onDismissAll, onMarkRead, onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Mark all as read when panel opens
  useEffect(() => { onMarkRead(); }, [onMarkRead]);

  // Close on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="nc-overlay">
      <div className="nc-panel" ref={panelRef}>
        <div className="nc-header">
          <span className="nc-title">
            ◈ NOTIFICATIONS
            {unread > 0 && <span className="nc-badge-inline">{unread}</span>}
          </span>
          <div className="nc-header-actions">
            {notifications.length > 0 && (
              <button className="nc-clear-all" onClick={onDismissAll}>
                CLEAR ALL
              </button>
            )}
            <button className="nc-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="nc-body">
          {notifications.length === 0 ? (
            <div className="nc-empty">
              <span className="nc-empty-icon">◎</span>
              <span>NO PENDING NOTIFICATIONS</span>
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`nc-item nc-item--${n.type}${n.read ? '' : ' nc-item--unread'}`}>
                <div className="nc-item-icon">
                  {n.type === 'complete' ? '✓' : '⚠'}
                </div>
                <div className="nc-item-body">
                  <div className="nc-item-title">{n.title}</div>
                  {n.detail && <div className="nc-item-detail">{n.detail}</div>}
                  <div className="nc-item-time">{timeAgo(n.timestamp)}</div>
                </div>
                <button
                  className="nc-item-dismiss"
                  onClick={() => onDismiss(n.id)}
                  title="Dismiss"
                >✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
