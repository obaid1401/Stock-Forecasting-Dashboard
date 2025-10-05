"use client"

export default function ForecastControls({ forecastSteps, onStepsChange, onGetForecast, isLoading }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      <div className="w-full sm:w-auto">
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Forecast Steps</label>
        <input
          type="number"
          min="1"
          max="10"
          value={forecastSteps}
          onChange={(e) => onStepsChange(Number(e.target.value))}
          className="w-full sm:w-32 bg-white border-2 border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md hover:border-blue-400"
        />
      </div>

      <button
        onClick={onGetForecast}
        disabled={isLoading}
        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 smooth-transition"
      >
        {isLoading ? (
          <>
            <div className="spinner"></div>
            <span>Loading...</span>
          </>
        ) : (
          "Get Forecast"
        )}
      </button>
    </div>
  )
}
