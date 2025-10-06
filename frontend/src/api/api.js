// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"

// // Fetch historical OHLC data
// export const fetchHistoricalData = async (symbol) => {
//   try {
//     console.log("[v0] Fetching historical data for:", symbol)
//     console.log("[v0] API URL:", `${API_BASE_URL}/api/history?symbol=${symbol}`)

//     const response = await fetch(`${API_BASE_URL}/api/history?symbol=${symbol}`)

//     console.log("[v0] Response status:", response.status)
//     console.log("[v0] Response ok:", response.ok)

//     if (!response.ok) {
//       throw new Error(`Failed to fetch historical data: ${response.statusText}`)
//     }

//     const data = await response.json()
//     console.log("[v0] Raw API response:", data)
//     console.log("[v0] History data:", data.history)
//     console.log("[v0] Is history an array?", Array.isArray(data.history))

//     if (!Array.isArray(data.history)) {
//       console.error("[v0] History is not an array:", data.history)
//       return []
//     }

//     return data.history
//   } catch (error) {
//     console.error("[v0] Error fetching historical data:", error)
//     return []
//   }
// }

// // Fetch forecast data
// export const fetchForecast = async (symbol, steps) => {
//   try {
//     console.log("[v0] Fetching forecast for:", symbol, "steps:", steps)

//     const response = await fetch(`${API_BASE_URL}/api/forecast`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ symbol, steps }),
//     })

//     console.log("[v0] Forecast response status:", response.status)

//     if (!response.ok) {
//       throw new Error(`Failed to fetch forecast: ${response.statusText}`)
//     }

//     const data = await response.json()
//     console.log("[v0] Forecast data:", data)
//     return data
//   } catch (error) {
//     console.error("[v0] Error fetching forecast:", error)
//     return { forecasts: {}, metrics: {} }
//   }
// }

// // Fetch news headlines
// export const fetchNews = async (symbol) => {
//   try {
//     console.log("[v0] Fetching news for:", symbol)
//     console.log("[v0] API URL:", `${API_BASE_URL}/api/news?symbol=${symbol}`)

//     const response = await fetch(`${API_BASE_URL}/api/news?symbol=${symbol}`)

//     console.log("[v0] News response status:", response.status)
//     console.log("[v0] News response ok:", response.ok)

//     if (!response.ok) {
//       throw new Error(`Failed to fetch news: ${response.statusText}`)
//     }

//     const data = await response.json()
//     console.log("[v0] Raw news API response:", data)
//     console.log("[v0] News data:", data.news)
//     console.log("[v0] Is news an array?", Array.isArray(data.news))

//     if (!Array.isArray(data.news)) {
//       console.error("[v0] News is not an array:", data.news)
//       return []
//     }

//     return data.news
//   } catch (error) {
//     console.error("[v0] Error fetching news:", error)
//     return []
//   }
// }
