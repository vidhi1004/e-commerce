"use client";

interface OrderTimelineProps {
  currentStatus: string;
  awbCode?: string;
  courierName?: string;
}

export default function OrderTimeline({
  currentStatus,
  awbCode,
  courierName,
}: OrderTimelineProps) {
  // Map your backend Enum statuses to chronological timeline steps
  const steps = [
    { label: "Ordered", keys: ["PENDING"] },
    { label: "Confirmed", keys: ["CONFIRMED", "PAID"] },
    { label: "Shipped", keys: ["SHIPPED"] },
    { label: "Delivered", keys: ["DELIVERED"] },
  ];

  // If order is cancelled, we handle it outside the standard linear flow
  const isCancelled = currentStatus === "CANCELLED";

  // Find the highest completed index based on current status
  const currentStepIndex = steps.findIndex((step) =>
    step.keys.includes(currentStatus.toUpperCase()),
  );

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center font-medium my-6">
        ❌ This order has been cancelled.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 bg-white border rounded-xl shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">
        Delivery Progress
      </h3>

      {/* Visual Timeline Bar */}
      <div className="flex items-center justify-between relative w-full mb-8">
        {/* Progress Line Behind Circles */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-10" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 -z-10"
          style={{
            width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Timeline Nodes */}
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.label}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 bg-white
                  ${isCompleted ? "border-blue-600 text-blue-600 shadow-sm" : "border-gray-300 text-gray-400"}
                  ${isCurrent ? "bg-blue-50 ring-4 ring-blue-100" : ""}
                `}
              >
                {isCompleted && !isCurrent ? "✓" : index + 1}
              </div>

              <span
                className={`text-xs mt-2 font-semibold tracking-wide uppercase transition-colors
                  ${isCompleted ? "text-blue-600" : "text-gray-400"}
                  ${isCurrent ? "font-extrabold text-gray-900" : ""}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {currentStatus === "SHIPPED" && awbCode && (
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-lg">🚚</span>
            <p className="text-sm font-bold text-slate-800">
              Your package is on its way!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs">
            <div>
              <span className="block text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                Courier Partner
              </span>
              <span className="font-semibold text-slate-800 text-sm">
                {courierName || "Shiprocket Partner"}
              </span>
            </div>
            <div>
              <span className="block text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                AWB Tracking ID
              </span>
              <span className="font-mono bg-white px-2 py-1 rounded border text-blue-600 font-extrabold text-sm inline-block mt-0.5 select-all">
                {awbCode}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
