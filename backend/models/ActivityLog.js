const mongoose = require("mongoose");

/**
 * AUDIT TRAIL (append-only)
 * -----------------
 * Why separate collection?
 * - Task document = current state
 * - ActivityLog = history of WHO changed WHAT and WHEN
 * - Never overwrite old logs (audit/compliance friendly)
 *
 * Interview line:
 * "We store immutable activity events so status changes are traceable."
 */
const activityLogSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "TASK_CREATED",
        "STATUS_CHANGED",
        "CHECKLIST_UPDATED",
        "TASK_UPDATED",
      ],
      required: true,
    },
    fromStatus: { type: String, default: null },
    toStatus: { type: String, default: null },
    progress: { type: Number, default: null },
    message: { type: String, required: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
