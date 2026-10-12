import './Notifications.css';
import React, { useEffect, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, dismissNotification } from '../../api/Notifications';
import { useNavigate } from 'react-router-dom';
import { setAlert } from '../../Reducers/Alert';

const Notifications = () => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, unreadCount, loading, hasMore, nextCursor } = useSelector((state) => state.notifications);
  const observerRef = useRef();
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  // Only show unread notifications in sidebar dropdown
  const unreadItems = useMemo(() => items.filter(n => !n.read), [items]);

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications({ cursor: null }));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (!hasMore) return;
    const container = document.getElementById('notificationList');
    if (!container) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          dispatchRef.current(fetchNotifications({ cursor: nextCursor }));
        }
      },
      { root: container, rootMargin: '200px', threshold: 0 }
    );
    const sentinel = document.getElementById('loadMoreSentinel');
    if (sentinel) observerRef.current.observe(sentinel);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, nextCursor]);

  const handleNotificationClick = async (notification, e) => {
    if (e.target.closest('.notification-close')) return;
    
    if (!notification.read) {
      const result = await dispatch(markNotificationRead({ notificationId: notification._id }));
      if (result.meta.requestStatus === 'rejected') {
        dispatch(setAlert({ message: 'Failed to mark as read', type: 'error' }));
        return;
      }
    }
    if (notification.type === 'message' && notification.sender?.email) {
      navigate(`/messages/${notification.sender.email}`);
    } else if ((notification.type === 'like' || notification.type === 'comment' || notification.type === 'like_comment') && notification.entityId) {
      navigate(`/postInfo?postid=${notification.entityId.toString()}`);
    } else if (notification.entityType === 'user' && notification.sender?.email) {
      navigate(`/profile?email=${notification.sender.email}`);
    }
  };

  const handleDismissNotification = async (notificationId, e) => {
    e.stopPropagation();
    const result = await dispatch(dismissNotification({ notificationId }));
    if (result.meta.requestStatus === 'rejected') {
      dispatch(setAlert({ message: 'Failed to dismiss notification', type: 'error' }));
    }
  };

  const handleMarkAllRead = async () => {
    const result = await dispatch(markAllNotificationsRead());
    if (result.meta.requestStatus === 'rejected') {
      dispatch(setAlert({ message: 'Failed to mark all as read', type: 'error' }));
    }
  };

  if (!token) return null;

  const getAvatar = (notification) => {
    const sender = notification.sender || {};
    if (sender.pfp || sender.picture) {
      return <img src={sender.pfp || sender.picture} alt={sender.name} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }} />;
    }
    return <div className="avatar-letter">{sender.name ? sender.name.charAt(0).toUpperCase() : '?'}</div>;
  };

  return (
    <div id='Notifications'>
      <div id="notificationBox">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem .75rem' }}>
          <h2>Notifications</h2>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: 'var(--md-primary)', color: 'var(--md-on-primary)', border: 'none', borderRadius: '999px', cursor: 'pointer' }}>
              Mark all read
            </button>
          )}
        </div>
        <div id="notificationList" style={{ maxHeight: '75dvh', overflowY: 'auto', paddingBottom: '.5rem' }}>
          {unreadItems.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--md-on-surface-variant)' }}>No unread notifications</p>
          ) : (
            unreadItems.map((notification) => (
              <div
                key={notification._id}
                className="notification-item unread"
                onClick={(e) => handleNotificationClick(notification, e)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  {getAvatar(notification)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--md-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <strong>{notification.sender?.name || 'Someone'}</strong>{' '}
                      {getNotificationText(notification)}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--md-on-surface-variant)' }}>
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                  <span className="unread-dot" />
                  <button 
                    className="notification-close" 
                    onClick={(e) => handleDismissNotification(notification._id, e)}
                    aria-label="Mark as read"
                    title="Mark as read"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--md-on-surface-variant)',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      fontSize: '1rem',
                      lineHeight: 1,
                      opacity: 0.6,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
          <div id="loadMoreSentinel" style={{ height: '1rem' }} />
        </div>
      </div>
    </div>
  )
}

function getNotificationText(notification) {
  switch (notification.type) {
    case 'message':
      return 'sent you a message';
    case 'like':
      return 'liked your post';
    case 'comment':
      return 'commented on your post';
    case 'like_comment':
      return 'liked your comment';
    case 'follow':
      return 'started following you';
    case 'share':
      return 'shared your post';
    default:
      return '';
  }
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default Notifications