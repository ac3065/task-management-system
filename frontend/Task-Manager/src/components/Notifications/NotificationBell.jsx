import React, { useEffect, useRef, useState } from "react";
import { LuBell } from "react-icons/lu";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

/**
 * Polls notifications every 10s.
 * Interview: "Short polling for inbox; later can upgrade to WebSockets."
 */
const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_ALL);
      setItems(res.data?.notifications || []);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch (error) {
      // silent — bell should not break the page
    }
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.put(API_PATHS.NOTIFICATIONS.MARK_ALL_READ);
      setUnreadCount(0);
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const markOneRead = async (id) => {
    try {
      await axiosInstance.put(API_PATHS.NOTIFICATIONS.MARK_READ(id));
      setItems((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative ml-auto" ref={panelRef}>
      <button
        type="button"
        className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <LuBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <p className="text-sm font-semibold text-slate-800">Notifications</p>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={markAllRead}
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-slate-500">
                No notifications yet
              </p>
            ) : (
              items.map((n) => (
                <button
                  type="button"
                  key={n._id}
                  onClick={() => !n.isRead && markOneRead(n._id)}
                  className={`block w-full border-b border-slate-50 px-3 py-2.5 text-left hover:bg-slate-50 ${
                    n.isRead ? "bg-white" : "bg-blue-50/60"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-800">
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-600">{n.message}</p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {moment(n.createdAt).fromNow()}
                    {n.sender?.name ? ` · ${n.sender.name}` : ""}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
