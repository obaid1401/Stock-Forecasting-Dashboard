import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import StockSelector from "./components/StockSelector"
import ForecastControls from "./components/ForecastControls"
import CandlestickChart from "./components/CandlestickChart"
import MetricsSection from "./components/MetricsSection"
import NewsFeed from "./components/NewsFeed"
import { fetchHistoricalData, fetchForecast } from "./services/api"

function App() {
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [forecastSteps, setForecastSteps] = useState(5)
  const [horizon, setHorizon] = useState("24hrs")
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState({ chartData: [], metrics: {} })
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHistoricalData()
  }, [selectedStock])

  const loadHistoricalData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const historyData = await fetchHistoricalData(selectedStock, { limit: 90 })

      let historyArray = historyData
      if (historyData && typeof historyData === "object" && !Array.isArray(historyData)) {
        // If it's an object with a 'history' property, extract it
        historyArray = historyData.history || []
      }

      if (!Array.isArray(historyArray) || historyArray.length === 0) {
        setChartData({ chartData: [], metrics: {} })
        setError("No historical data available for this stock")
        return
      }

      const transformedData = historyArray.map((item) => ({
        date: item.Date,
        open: item.Open,
        high: item.High,
        low: item.Low,
        close: item.Close,
        arima: null,
        lstm: null,
        ensemble: null,
      }))

      setChartData({ chartData: transformedData, metrics: {} })
    } catch (err) {
      setError(`Failed to load historical data: ${err.message}`)
      console.error("[v0] Error loading historical data:", err)
      setChartData({ chartData: [], metrics: {} })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetForecast = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const forecastData = await fetchForecast(selectedStock, forecastSteps, horizon)

      setChartData((prev) => {
        const historicalData = [...prev.chartData]

        if (forecastData.forecasts) {
          const { arima, lstm, ensemble } = forecastData.forecasts

          const forecastLength = Math.max(arima?.length || 0, lstm?.length || 0, ensemble?.length || 0)

          // Determine last timestamp from history
          const lastHist = historicalData.filter((d) => d && d.date).slice(-1)[0]
          const lastTime = lastHist ? new Date(lastHist.date).getTime() : Date.now()

          const horizonToMs = {
            "1hr": 60 * 60 * 1000,
            "3hrs": 3 * 60 * 60 * 1000,
            "24hrs": 24 * 60 * 60 * 1000,
            "72hrs": 72 * 60 * 60 * 1000,
          }
          const stepMs = horizonToMs[horizon] || 24 * 60 * 60 * 1000

          for (let i = 0; i < forecastLength; i++) {
            const t = new Date(lastTime + stepMs * (i + 1))
            const iso = t.toISOString()
            historicalData.push({
              date: iso,
              open: null,
              high: null,
              low: null,
              close: null,
              arima: arima?.[i] || null,
              lstm: lstm?.[i] || null,
              ensemble: ensemble?.[i] || null,
            })
          }
        }

        return {
          chartData: historicalData,
          metrics: forecastData.metrics || {},
        }
      })
    } catch (err) {
      setError(`Failed to load forecast: ${err.message}`)
      console.error("[v0] Error loading forecast:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Controls Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-end">
          <StockSelector selectedStock={selectedStock} onStockChange={setSelectedStock} />
          <ForecastControls
            forecastSteps={forecastSteps}
            onStepsChange={setForecastSteps}
            horizon={horizon}
            onHorizonChange={setHorizon}
            onGetForecast={handleGetForecast}
            isLoading={isLoading}
          />
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <CandlestickChart data={chartData} selectedStock={selectedStock} isLoading={isLoading} horizon={horizon} />
        </div>

        {/* Metrics and News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <MetricsSection metrics={chartData.metrics} />
          </div>
          <div className="lg:col-span-2">
            <NewsFeed selectedStock={selectedStock} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
