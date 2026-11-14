import React, { useEffect, useState } from "react";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

/**
 * Shows WHO changed WHAT on a task (audit trail).
 * Interview: "Append-only ActivityLog queried by taskId, newest first."
 */
const ActivityTrail = ({ taskId }) => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    let alive = true;

    const load = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.TASKS.GET_ACTIVITY(taskId)
        );
        if (alive) setActivity(res.data?.activity || []);
      } catch (error) {
        console.error("Failed to load activity", error);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    const timer = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [taskId]);

  return (
    <div className="mt-5">
      <label className="text-xs font-medium text-slate-500">
        Activity / Audit Trail
      </label>
      <div className="mt-2 space-y-2">
        {loading && (
          <p className="text-xs text-slate-500">Loading activity...</p>
        )}
        {!loading && activity.length === 0 && (
          <p className="text-xs text-slate-500">No activity yet.</p>
        )}
        {activity.map((log) => (
          <div
            key={log._id}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <p className="text-[12px] font-medium text-slate-800">
              {log.message}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              {log.actor?.name || "User"} · {log.action.replaceAll("_", " ")}
              {log.fromStatus && log.toStatus
                ? ` · ${log.fromStatus} → ${log.toStatus}`
                : ""}
              {typeof log.progress === "number" ? ` · ${log.progress}%` : ""}
              {" · "}
              {moment(log.createdAt).fromNow()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTrail;
