import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts"

// 🟩 Custom candlestick rendering component
const Candlestick = (props) => {
  const { x, y, width, height, payload } = props

  if (!payload || !payload.open || !payload.close || !payload.high || !payload.low) {
    return null
  }

  const isGreen = payload.close >= payload.open
  const color = isGreen ? "#10b981" : "#ef4444"

  const yMin = props.yAxis?.scale?.domain?.()?.[0] || 0
  const yMax = props.yAxis?.scale?.domain?.()?.[1] || 100
  const yRange = yMax - yMin

  const highY = y + height - ((payload.high - yMin) / yRange) * height
  const lowY = y + height - ((payload.low - yMin) / yRange) * height
  const openY = y + height - ((payload.open - yMin) / yRange) * height
  const closeY = y + height - ((payload.close - yMin) / yRange) * height

  const bodyTop = Math.min(openY, closeY)
  const bodyHeight = Math.abs(openY - closeY)
  const bodyWidth = width * 0.6

  return (
    <g>
      {/* High-Low wick line */}
      <line x1={x + width / 2} y1={highY} x2={x + width / 2} y2={lowY} stroke={color} strokeWidth={2} />
      {/* Open-Close body rectangle */}
      <rect
        x={x + width * 0.2}
        y={bodyTop}
        width={bodyWidth}
        height={Math.max(bodyHeight, 2)}
        fill={color}
        stroke={color}
        strokeWidth={1}
        opacity={0.85}
      />
    </g>
  )
}

// 🟢 Main Candlestick Chart Component
export default function CandlestickChart({ data, selectedStock, isLoading }) {
  // ✅ Show only the last 8 days of data
  const last8DaysData = Array.isArray(data.chartData)
    ? data.chartData.slice(-10)
    : []

  // ✅ Custom Tooltip for detailed hover info
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-2xl">
          <p className="font-bold text-gray-900 mb-3 text-sm border-b border-gray-200 pb-2">{data.date}</p>
          {data.open && (
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between gap-6">
                <span className="text-xs text-gray-600 font-medium">Open:</span>
                <span className="text-xs text-gray-900 font-bold">${data.open.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-xs text-gray-600 font-medium">High:</span>
                <span className="text-xs text-green-600 font-bold">${data.high.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-xs text-gray-600 font-medium">Low:</span>
                <span className="text-xs text-red-600 font-bold">${data.low.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-xs text-gray-600 font-medium">Close:</span>
                <span className="text-xs text-gray-900 font-bold">${data.close.toFixed(2)}</span>
              </div>
            </div>
          )}
          {data.arima && (
            <div className="border-t-2 border-gray-200 pt-3 space-y-1.5">
              <div className="flex justify-between gap-6">
                <span className="text-xs font-semibold text-blue-600">ARIMA:</span>
                <span className="text-xs font-bold text-blue-700">${data.arima.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-xs font-semibold text-green-600">LSTM:</span>
                <span className="text-xs font-bold text-green-700">${data.lstm.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-xs font-semibold text-red-600">Ensemble:</span>
                <span className="text-xs font-bold text-red-700">${data.ensemble.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl smooth-transition p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedStock} Price Chart & Forecast</h2>
        <p className="text-sm text-gray-600 font-medium">
          Historical candlestick data (last 8 days) with AI-powered predictions
        </p>
      </div>

      {isLoading ? (
        <div className="h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" style={{ width: "48px", height: "48px", borderWidth: "4px" }}></div>
            <p className="text-gray-600 font-medium">Loading forecast data...</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={last8DaysData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              stroke="#6b7280"
              domain={["auto", "auto"]}
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#3b82f6", strokeWidth: 1, strokeDasharray: "5 5" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px", fontWeight: "600", fontSize: "13px" }} iconType="line" />

            {/* Candlestick Bars */}
            <Bar dataKey="close" shape={<Candlestick />} isAnimationActive={false} />

            {/* Forecast Lines */}
            <Line
              type="monotone"
              dataKey="arima"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              name="ARIMA Forecast"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="lstm"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              name="LSTM Forecast"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="ensemble"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 5, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
              name="Ensemble Forecast"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
