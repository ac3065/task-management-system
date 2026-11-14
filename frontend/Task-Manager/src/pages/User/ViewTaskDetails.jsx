import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AvatarGroup from "../../components/AvatarGroup";
import moment from "moment";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import toast from "react-hot-toast";
import ActivityTrail from "../../components/Activity/ActivityTrail";

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [updating, setUpdating] = useState(false);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-600 bg-cyan-50 border border-cyan-200";
      case "Completed":
        return "text-lime-700 bg-lime-50 border border-lime-200";
      default:
        return "text-violet-600 bg-violet-50 border border-violet-200";
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );
      if (response.data) setTask(response.data);
    } catch (error) {
      console.error("Error fetching task:", error);
      toast.error("Could not load task details");
    }
  };

  const updateTodoChecklist = async (index) => {
    if (!task?.todoChecklist?.[index] || updating) return;

    const todoChecklist = task.todoChecklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );

    setUpdating(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TOOD_CHECKLIST(id),
        { todoChecklist }
      );
      if (response.data?.task) {
        setTask(response.data.task);
        toast.success("Progress updated — admin dashboard will refresh");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update checklist"
      );
    } finally {
      setUpdating(false);
    }
  };

  const updateStatus = async (status) => {
    if (!task || updating || task.status === status) return;
    setUpdating(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK_STATUS(id),
        { status }
      );
      if (response.data?.task) {
        setTask(response.data.task);
        toast.success(`Marked as ${status}`);
      } else {
        await getTaskDetailsByID();
        toast.success(`Marked as ${status}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleLinkClick = (link) => {
    let target = link;
    if (!/^https?:\/\//i.test(target)) target = `https://${target}`;
    window.open(target, "_blank");
  };

  useEffect(() => {
    if (id) getTaskDetailsByID();
  }, [id]);

  const completedCount =
    task?.todoChecklist?.filter((item) => item.completed).length || 0;
  const totalTodos = task?.todoChecklist?.length || 0;
  const progress =
    typeof task?.progress === "number"
      ? task.progress
      : totalTodos > 0
        ? Math.round((completedCount / totalTodos) * 100)
        : 0;

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-medium md:text-xl">{task?.title}</h2>
                <div
                  className={`rounded px-3 py-1 text-[11px] font-medium md:text-[13px] ${getStatusTagColor(
                    task?.status
                  )}`}
                >
                  {task?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
                <div className="mt-4 grid grid-cols-12 gap-4">
                  <div className="col-span-6 md:col-span-4">
                    <InfoBox label="Priority" value={task?.priority} />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <InfoBox
                      label="Due Date"
                      value={
                        task?.dueDate
                          ? moment(task?.dueDate).format("Do MMM YYYY")
                          : "N/A"
                      }
                    />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <label className="text-xs font-medium text-slate-500">
                      Assigned To
                    </label>
                    <AvatarGroup
                      avatars={
                        task?.assignedTo?.map(
                          (item) => item?.profileImageUrl
                        ) || []
                      }
                      maxVisible={5}
                    />
                  </div>
                </div>
              </div>

              {/* Progress — how much done */}
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-600">
                    Your Progress
                  </label>
                  <span className="text-sm font-semibold text-primary">
                    {progress}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Checklist: {completedCount}/{totalTodos} done. Admin charts
                  update from this status.
                </p>
              </div>

              {/* Status actions — no delete */}
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-500">
                  Update Status
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updating || task.status === status}
                      onClick={() => updateStatus(status)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        task.status === status
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {status === "Completed" ? "Mark Completed" : status}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  You can update progress only. Delete is admin-only.
                </p>
              </div>

              <div className="mt-5">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>
                <div className="mt-2 space-y-2">
                  {task?.todoChecklist?.map((item, index) => (
                    <TodoChecklist
                      key={`todo_${index}`}
                      text={item.text}
                      isChecked={!!item?.completed}
                      disabled={updating}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))}
                  {!totalTodos && (
                    <p className="text-xs text-slate-500">
                      No checklist items. Use status buttons above.
                    </p>
                  )}
                </div>
              </div>

              {task?.attachments?.length > 0 && (
                <div className="mt-5">
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>
                  {task?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}

              <ActivityTrail taskId={id} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => (
  <>
    <label className="text-xs font-medium text-slate-500">{label}</label>
    <p className="mt-0.5 text-[12px] font-medium text-gray-700">{value}</p>
  </>
);

const TodoChecklist = ({ text, isChecked, onChange, disabled }) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50">
    <input
      type="checkbox"
      checked={isChecked}
      disabled={disabled}
      onChange={onChange}
      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary outline-none"
    />
    <p
      className={`text-[13px] ${
        isChecked ? "text-slate-400 line-through" : "text-gray-800"
      }`}
    >
      {text}
    </p>
  </label>
);

const Attachment = ({ link, index, onClick }) => {
  const label = (() => {
    try {
      return decodeURIComponent(link.split("/").pop() || link);
    } catch {
      return link;
    }
  })();

  return (
    <div
      className="mt-2 mb-3 flex cursor-pointer justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
      onClick={onClick}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="mr-2 text-xs font-semibold text-gray-400">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="truncate text-xs text-black" title={link}>
          {label}
        </p>
      </div>
      <LuSquareArrowOutUpRight className="shrink-0 text-gray-400" />
    </div>
  );
};
