const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"

// Fetch historical OHLC data
export const fetchHistoricalData = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/history?symbol=${symbol}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch historical data: ${response.statusText}`)
    }

    const data = await response.json()

    const historyArray = data.history || []

    if (!Array.isArray(historyArray)) {
      console.error("[v0] History is not an array:", historyArray)
      return []
    }

    return historyArray
  } catch (error) {
    console.error("[v0] Error fetching historical data:", error)
    return []
  }
}

// Fetch forecast data
export const fetchForecast = async (symbol, steps) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/forecast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbol, steps }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch forecast: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching forecast:", error)
    return { forecasts: {}, metrics: {} }
  }
}

// Fetch news headlines
export const fetchNews = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/news?symbol=${symbol}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`)
    }

    const data = await response.json()

    const newsArray = data.news || []

    if (!Array.isArray(newsArray)) {
      console.error("[v0] News is not an array:", newsArray)
      return []
    }

    return newsArray
  } catch (error) {
    console.error("[v0] Error fetching news:", error)
    return []
  }
}
