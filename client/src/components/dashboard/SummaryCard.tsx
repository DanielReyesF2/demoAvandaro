import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Scale, Trash2, BarChart, AlertTriangle } from "lucide-react";

const cardVariants = cva(
  "bg-white shadow rounded-lg p-5", {
    variants: {
      type: {
        organic: "organic-card",
        inorganic: "inorganic-card",
        total: "total-card",
        deviation: "deviation-card"
      }
    },
    defaultVariants: {
      type: "organic"
    }
  }
);

interface SummaryCardProps extends VariantProps<typeof cardVariants> {
  title: string;
  value: string;
  change: number;
  progress: number;
  progressLabel: string;
  type: "organic" | "inorganic" | "total" | "deviation";
}

export default function SummaryCard({
  title,
  value,
  change,
  progress,
  progressLabel,
  type
}: SummaryCardProps) {
  // Determine icon based on card type
  const renderIcon = () => {
    switch (type) {
      case "organic":
        return (
          <div className="bg-lime bg-opacity-20 p-2 rounded-md">
            <Scale className="w-6 h-6 text-lime" />
          </div>
        );
      case "inorganic":
        return (
          <div className="bg-navy bg-opacity-20 p-2 rounded-md">
            <Trash2 className="w-6 h-6 text-navy" />
          </div>
        );
      case "total":
        return (
          <div className="bg-gray-700 bg-opacity-20 p-2 rounded-md">
            <BarChart className="w-6 h-6 text-gray-700" />
          </div>
        );
      case "deviation":
        return (
          <div className="bg-orange-500 bg-opacity-20 p-2 rounded-md">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
        );
    }
  };

  // Determine progress bar color based on card type
  const getProgressBarColor = () => {
    switch (type) {
      case "organic":
        return "bg-lime";
      case "inorganic":
        return "bg-navy";
      case "total":
        return "bg-gray-700";
      case "deviation":
        return "bg-orange-500";
    }
  };

  return (
    <div className={cardVariants({ type })}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</div>
          <div className="mt-1 flex items-baseline">
            <span className="text-2xl font-semibold text-gray-800">{value}</span>
            <span className={`ml-2 text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? (
                <TrendingUp className="inline-block w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="inline-block w-3 h-3 mr-1" />
              )}
              {Math.abs(change)}%
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Comparado con el período anterior</div>
        </div>
        {renderIcon()}
      </div>
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`${getProgressBarColor()} h-1.5 rounded-full`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">{progressLabel}</div>
      </div>
    </div>
  );
}
