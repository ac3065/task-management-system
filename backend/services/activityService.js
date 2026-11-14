const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * Core helper used by task controllers.
 * 1) Write audit log (always)
 * 2) Notify relevant users (admins / creator)
 */
async function recordTaskActivity({
  task,
  actor,
  action,
  fromStatus = null,
  toStatus = null,
  progress = null,
  message,
  meta = {},
  notifyAdmins = true,
}) {
  const log = await ActivityLog.create({
    task: task._id,
    actor: actor._id,
    action,
    fromStatus,
    toStatus,
    progress,
    message,
    meta,
  });

  if (!notifyAdmins) {
    return { log, notifications: [] };
  }

  // Notify all admins + task creator (if not the actor)
  const admins = await User.find({ role: "admin" }).select("_id");
  const recipientIds = new Set(admins.map((a) => a._id.toString()));

  if (task.createdBy) {
    recipientIds.add(task.createdBy.toString());
  }

  // Don't notify yourself
  recipientIds.delete(actor._id.toString());

  const notifications = await Promise.all(
    [...recipientIds].map((recipientId) =>
      Notification.create({
        recipient: recipientId,
        sender: actor._id,
        task: task._id,
        type: action,
        title: titleForAction(action),
        message,
      })
    )
  );

  return { log, notifications };
}

function titleForAction(action) {
  switch (action) {
    case "TASK_CREATED":
      return "New task created";
    case "STATUS_CHANGED":
      return "Task status updated";
    case "CHECKLIST_UPDATED":
      return "Task progress updated";
    default:
      return "Task activity";
  }
}

module.exports = { recordTaskActivity };
