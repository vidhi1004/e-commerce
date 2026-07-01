import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>

          {description && (
            <p className="mt-2 text-sm text-gray-400">{description}</p>
          )}
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <Icon className="h-7 w-7 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
