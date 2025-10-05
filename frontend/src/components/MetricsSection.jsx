import { Activity, TrendingUp, Target } from "lucide-react"

export default function MetricsSection({ metrics }) {
  const metricCards = [
    {
      name: "RMSE",
      value: metrics.rmse,
      description: "Root Mean Square Error",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500",
    },
    {
      name: "MAE",
      value: metrics.mae,
      description: "Mean Absolute Error",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200",
      iconBg: "bg-green-500",
    },
    {
      name: "MAPE",
      value: metrics.mape,
      description: "Mean Absolute Percentage Error",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-500",
      suffix: "%",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accuracy Metrics</h2>
        <p className="text-sm text-gray-600 font-medium">Model performance indicators</p>
      </div>

      {metricCards.map((metric) => {
        const Icon = metric.icon
        const value =
          metric.value != null && !isNaN(metric.value)
            ? Number(metric.value).toFixed(3)
            : "N/A" // handle null/NaN gracefully

        return (
          <div
            key={metric.name}
            className={`bg-white rounded-2xl border-2 ${metric.borderColor} shadow-md hover:shadow-xl smooth-transition p-6 hover:scale-105 cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${metric.iconBg} rounded-xl p-3 shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-2 uppercase tracking-wide">
                {metric.description}
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mb-2">
                {value}
                {metric.suffix && <span className="text-xl text-gray-700 ml-1">{metric.suffix}</span>}
              </p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{metric.name}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
