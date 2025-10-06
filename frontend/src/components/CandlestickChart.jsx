import { useEffect, useMemo, useRef } from "react"
import { createChart, CrosshairMode } from "lightweight-charts"

export default function CandlestickChart({ data, selectedStock, isLoading }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const candleSeriesRef = useRef(null)
  const arimaSeriesRef = useRef(null)
  const lstmSeriesRef = useRef(null)
  const ensembleSeriesRef = useRef(null)
  const tooltipRef = useRef(null)

  const { candles, arima, lstm, ensemble } = useMemo(() => {
    const candles = []
    const arima = []
    const lstm = []
    const ensemble = []

    const items = Array.isArray(data.chartData) ? data.chartData : []
    for (const item of items) {
      const t = new Date(item.date)
      const time = Math.floor(t.getTime() / 1000)
      if (item.open != null && item.high != null && item.low != null && item.close != null) {
        candles.push({ time, open: item.open, high: item.high, low: item.low, close: item.close })
      }
      if (item.arima != null) arima.push({ time, value: item.arima })
      if (item.lstm != null) lstm.push({ time, value: item.lstm })
      if (item.ensemble != null) ensemble.push({ time, value: item.ensemble })
    }
    return { candles, arima, lstm, ensemble }
  }, [data])

  useEffect(() => {
    if (!containerRef.current) return

    // init chart
    const chart = createChart(containerRef.current, {
      height: 600,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#6b7280",
      },
      grid: {
        vertLines: { color: "#f3f4f6" },
        horzLines: { color: "#f3f4f6" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: {
        borderColor: "#e5e7eb",
      },
      timeScale: {
        borderColor: "#e5e7eb",
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time, tickMarkType, locale) => {
          const d = new Date(time * 1000)
          const formatter = new Intl.DateTimeFormat(locale, { month: "short", day: "2-digit" })
          const monthOnly = new Intl.DateTimeFormat(locale, { month: "short" })
          if (d.getDate() <= 2) return monthOnly.format(d)
          return formatter.format(d)
        },
      },
    })

    chartRef.current = chart

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderDownColor: "#991b1b",
      borderUpColor: "#166534",
      wickDownColor: "#991b1b",
      wickUpColor: "#166534",
      priceLineVisible: false,
    })
    candleSeriesRef.current = candleSeries

    const arimaSeries = chart.addLineSeries({ color: "#3b82f6", lineWidth: 2 })
    const lstmSeries = chart.addLineSeries({ color: "#10b981", lineWidth: 2 })
    const ensembleSeries = chart.addLineSeries({ color: "#ef4444", lineWidth: 2 })
    arimaSeriesRef.current = arimaSeries
    lstmSeriesRef.current = lstmSeries
    ensembleSeriesRef.current = ensembleSeries

    // Tooltip setup
    const tooltip = document.createElement("div")
    tooltip.style.position = "absolute"
    tooltip.style.display = "none"
    tooltip.style.pointerEvents = "none"
    tooltip.style.background = "rgba(255,255,255,0.98)"
    tooltip.style.border = "1px solid #e5e7eb"
    tooltip.style.borderRadius = "8px"
    tooltip.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)"
    tooltip.style.padding = "10px 12px"
    tooltip.style.fontSize = "12px"
    tooltip.style.color = "#111827"
    tooltip.style.zIndex = "10"
    containerRef.current.style.position = "relative"
    containerRef.current.appendChild(tooltip)
    tooltipRef.current = tooltip

    const formatNumber = (v) => (v == null || Number.isNaN(v) ? "-" : Number(v).toFixed(2))

    const crosshairHandler = (param) => {
      if (!param || !param.point || !param.time || !tooltipRef.current) {
        tooltip.style.display = "none"
        return
      }
      const { point, time } = param
      const seriesMap = param.seriesData || param.seriesPrices || new Map()

      // Find OHLC from candles at time
      const c = candleSeriesRef.current
      let ohlcText = ""
      if (c) {
        const candleData = seriesMap.get(c)
        if (candleData && typeof candleData === "object" && "open" in candleData) {
          const { open, high, low, close } = candleData
          ohlcText = `
            <div style=\"display:flex; justify-content:space-between; gap:12px;\"><span style=\"color:#6b7280;\">Open:</span><strong>${formatNumber(open)}</strong></div>
            <div style=\"display:flex; justify-content:space-between; gap:12px;\"><span style=\"color:#6b7280;\">High:</span><strong style=\"color:#16a34a;\">${formatNumber(high)}</strong></div>
            <div style=\"display:flex; justify-content:space-between; gap:12px;\"><span style=\"color:#6b7280;\">Low:</span><strong style=\"color:#dc2626;\">${formatNumber(low)}</strong></div>
            <div style=\"display:flex; justify-content:space-between; gap:12px;\"><span style=\"color:#6b7280;\">Close:</span><strong>${formatNumber(close)}</strong></div>
          `
        }
      }

      const date = new Date(time * 1000)
      const dateStr = date.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })

      tooltip.innerHTML = `
        <div style="font-weight:700; margin-bottom:6px; color:#374151;">${dateStr}</div>
        ${ohlcText ? `<div style="margin-bottom:6px; color:#111827; display:grid; gap:4px;">${ohlcText}</div>` : ""}
        <div style="display:flex; gap:10px; align-items:center;">
          <span style="display:inline-flex; align-items:center; gap:6px; color:#1f2937;"><span style="width:10px; height:2px; background:#3b82f6; display:inline-block;"></span>ARIMA: <strong>${formatNumber(seriesMap.get(arimaSeriesRef.current))}</strong></span>
          <span style="display:inline-flex; align-items:center; gap:6px; color:#1f2937;"><span style="width:10px; height:2px; background:#10b981; display:inline-block;"></span>LSTM: <strong>${formatNumber(seriesMap.get(lstmSeriesRef.current))}</strong></span>
          <span style="display:inline-flex; align-items:center; gap:6px; color:#1f2937;"><span style="width:10px; height:2px; background:#ef4444; display:inline-block;"></span>Ensemble: <strong>${formatNumber(seriesMap.get(ensembleSeriesRef.current))}</strong></span>
        </div>
      `

      const containerRect = containerRef.current.getBoundingClientRect()
      const left = Math.min(Math.max(point.x + 12, 8), containerRect.width - 220)
      const top = Math.min(Math.max(point.y + 12, 8), containerRect.height - 100)
      tooltip.style.left = `${left}px`
      tooltip.style.top = `${top}px`
      tooltip.style.display = "block"
    }
    chart.subscribeCrosshairMove(crosshairHandler)

    const resize = () => {
      if (!containerRef.current || !chartRef.current) return
      const width = containerRef.current.clientWidth
      chartRef.current.applyOptions({ width })
    }
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
      chart.unsubscribeCrosshairMove(crosshairHandler)
      if (tooltipRef.current && tooltipRef.current.parentNode) {
        tooltipRef.current.parentNode.removeChild(tooltipRef.current)
      }
      chart.remove()
      chartRef.current = null
      candleSeriesRef.current = null
      arimaSeriesRef.current = null
      lstmSeriesRef.current = null
      ensembleSeriesRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current) return
    candleSeriesRef.current.setData(candles)
    arimaSeriesRef.current.setData(arima)
    lstmSeriesRef.current.setData(lstm)
    ensembleSeriesRef.current.setData(ensemble)
    chartRef.current.timeScale().fitContent()
  }, [candles, arima, lstm, ensemble])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl smooth-transition p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedStock} Price Chart & Forecast</h2>
        <p className="text-sm text-gray-600 font-medium">Historical candlestick data with AI-powered predictions</p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
          <span className="inline-flex items-center gap-2"><span style={{ width: 14, height: 3, background: "#3b82f6", display: "inline-block" }}></span>ARIMA (blue)</span>
          <span className="inline-flex items-center gap-2"><span style={{ width: 14, height: 3, background: "#10b981", display: "inline-block" }}></span>LSTM (green)</span>
          <span className="inline-flex items-center gap-2"><span style={{ width: 14, height: 3, background: "#ef4444", display: "inline-block" }}></span>Ensemble (red)</span>
        </div>
      </div>
      {isLoading ? (
        <div className="h-[700px] flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" style={{ width: "48px", height: "48px", borderWidth: "4px" }}></div>
            <p className="text-gray-600 font-medium">Loading forecast data...</p>
          </div>
        </div>
      ) : (
        <div ref={containerRef} style={{ width: "100%" }} />
      )}
    </div>
  )
}