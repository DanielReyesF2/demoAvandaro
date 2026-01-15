import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative";
  icon?: ReactNode;
  children?: ReactNode;
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeType,
  icon,
  children,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-subtle p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
          {title}
        </span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">{value}</div>
      {subtitle && (
        <div className="text-sm text-gray-600 mb-2">{subtitle}</div>
      )}
      {change && (
        <div
          className={`text-xs font-medium ${
            changeType === "positive" ? "text-accent-green" : "text-red-500"
          }`}
        >
          {change}
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
