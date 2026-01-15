import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  controls?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ title, subtitle, controls, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg border border-subtle p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1.5">{subtitle}</p>
          )}
        </div>
        {controls && <div>{controls}</div>}
      </div>
      {children}
    </div>
  );
}
