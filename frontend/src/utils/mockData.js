// Generate mock historical and forecast data
export function generateMockData(stock, forecastSteps) {
  const basePrice =
    {
      AAPL: 180,
      TSLA: 250,
      GOOGL: 140,
      MSFT: 380,
      AMZN: 170,
      "BTC-USD": 45000,
    }[stock] || 100

  const historicalDays = 30
  const chartData = []

  // Generate historical data
  for (let i = 0; i < historicalDays; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (historicalDays - i))

    const randomFactor = 0.95 + Math.random() * 0.1
    const open = basePrice * randomFactor
    const close = open * (0.97 + Math.random() * 0.06)
    const high = Math.max(open, close) * (1 + Math.random() * 0.03)
    const low = Math.min(open, close) * (1 - Math.random() * 0.03)

    chartData.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      open: Number.parseFloat(open.toFixed(2)),
      high: Number.parseFloat(high.toFixed(2)),
      low: Number.parseFloat(low.toFixed(2)),
      close: Number.parseFloat(close.toFixed(2)),
      arima: null,
      lstm: null,
      ensemble: null,
    })
  }

  // Generate forecast data
  const lastClose = chartData[chartData.length - 1].close
  for (let i = 1; i <= forecastSteps; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)

    const arimaForecast = lastClose * (1 + (Math.random() - 0.48) * 0.05 * i)
    const lstmForecast = lastClose * (1 + (Math.random() - 0.47) * 0.05 * i)
    const ensembleForecast = (arimaForecast + lstmForecast) / 2

    chartData.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      open: null,
      high: null,
      low: null,
      close: null,
      arima: Number.parseFloat(arimaForecast.toFixed(2)),
      lstm: Number.parseFloat(lstmForecast.toFixed(2)),
      ensemble: Number.parseFloat(ensembleForecast.toFixed(2)),
    })
  }

  // Generate metrics
  const metrics = {
    rmse: (Math.random() * 5 + 2).toFixed(2),
    mae: (Math.random() * 4 + 1.5).toFixed(2),
    mape: (Math.random() * 3 + 1).toFixed(2),
  }

  return { chartData, metrics }
}

// Mock news data
const newsTemplates = {
  AAPL: [
    { headline: "Apple Announces New Product Line for 2025", source: "TechCrunch", time: "2 hours ago", url: "#" },
    { headline: "iPhone Sales Exceed Expectations in Q4", source: "Bloomberg", time: "5 hours ago", url: "#" },
    { headline: "Apple Invests $500M in AI Research", source: "Reuters", time: "8 hours ago", url: "#" },
    { headline: "Analysts Upgrade AAPL Stock Rating", source: "CNBC", time: "1 day ago", url: "#" },
    { headline: "Apple Services Revenue Hits Record High", source: "The Verge", time: "1 day ago", url: "#" },
    { headline: "New Apple Store Opens in Tokyo", source: "MacRumors", time: "2 days ago", url: "#" },
    { headline: "Apple Watch Health Features Get FDA Approval", source: "HealthTech", time: "2 days ago", url: "#" },
    { headline: "Tim Cook Discusses Future of AR/VR", source: "The Information", time: "3 days ago", url: "#" },
    { headline: "Apple Expands Manufacturing in India", source: "Financial Times", time: "3 days ago", url: "#" },
    { headline: "Apple Music Reaches 100M Subscribers", source: "Billboard", time: "4 days ago", url: "#" },
  ],
  TSLA: [
    { headline: "Tesla Delivers Record Number of Vehicles", source: "Electrek", time: "1 hour ago", url: "#" },
    { headline: "New Gigafactory Announced in Europe", source: "Reuters", time: "4 hours ago", url: "#" },
    { headline: "Tesla FSD Beta Shows Significant Improvements", source: "TechCrunch", time: "6 hours ago", url: "#" },
    { headline: "Musk Discusses Tesla Energy Division Growth", source: "Bloomberg", time: "12 hours ago", url: "#" },
    { headline: "Tesla Stock Surges on Production Numbers", source: "CNBC", time: "1 day ago", url: "#" },
    { headline: "New Model Y Variant Unveiled", source: "InsideEVs", time: "1 day ago", url: "#" },
    { headline: "Tesla Supercharger Network Expands", source: "Electrek", time: "2 days ago", url: "#" },
    { headline: "Analysts Predict Strong Q1 for Tesla", source: "MarketWatch", time: "2 days ago", url: "#" },
    { headline: "Tesla Battery Technology Breakthrough", source: "MIT Tech Review", time: "3 days ago", url: "#" },
    { headline: "Tesla Insurance Launches in New States", source: "Insurance Journal", time: "3 days ago", url: "#" },
  ],
  GOOGL: [
    { headline: "Google AI Makes Major Breakthrough", source: "TechCrunch", time: "3 hours ago", url: "#" },
    { headline: "Alphabet Reports Strong Ad Revenue Growth", source: "Bloomberg", time: "6 hours ago", url: "#" },
    { headline: "Google Cloud Wins Major Enterprise Contract", source: "Reuters", time: "9 hours ago", url: "#" },
    { headline: "New Pixel Devices Launch Next Month", source: "The Verge", time: "1 day ago", url: "#" },
    { headline: "YouTube Premium Subscriber Count Soars", source: "CNBC", time: "1 day ago", url: "#" },
    { headline: "Google Expands Fiber Internet Service", source: "Ars Technica", time: "2 days ago", url: "#" },
    { headline: "Waymo Self-Driving Service Expands", source: "TechCrunch", time: "2 days ago", url: "#" },
    { headline: "Google Announces Sustainability Goals", source: "GreenBiz", time: "3 days ago", url: "#" },
    {
      headline: "Search Algorithm Update Impacts Rankings",
      source: "Search Engine Land",
      time: "3 days ago",
      url: "#",
    },
    { headline: "Google Workspace Gets New Features", source: "ZDNet", time: "4 days ago", url: "#" },
  ],
}

export function getNewsForStock(stock) {
  return newsTemplates[stock] || newsTemplates["AAPL"]
}
