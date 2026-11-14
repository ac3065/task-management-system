const mongoose = require("mongoose");

/**
 * NOTIFICATIONS (per-user inbox)
 * -----------------
 * When a member updates a task, we create a notification for the admin(s).
 * Frontend polls / fetches unread count + list (bell icon).
 *
 * Interview line:
 * "Notifications are fan-out writes: one event can notify many recipients."
 */
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    type: {
      type: String,
      enum: ["TASK_CREATED", "STATUS_CHANGED", "CHECKLIST_UPDATED", "INFO"],
      default: "INFO",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
