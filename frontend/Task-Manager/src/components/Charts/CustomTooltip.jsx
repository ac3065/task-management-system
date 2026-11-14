import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-lg border border-gray-300 bg-white p-2 shadow-md">
        <p className="mb-1 text-xs font-semibold text-slate-800">
          {item.name || item.payload?.status || item.payload?.priority}
        </p>
        <p className="text-sm text-gray-600">
          Count:{" "}
          <span className="font-medium text-gray-900">
            {item.value ?? item.payload?.count ?? 0}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
