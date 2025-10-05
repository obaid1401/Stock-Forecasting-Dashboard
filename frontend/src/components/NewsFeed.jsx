"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Newspaper } from "lucide-react"
import { fetchNews } from "../services/api"

export default function NewsFeed({ selectedStock }) {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const newsData = await fetchNews(selectedStock)

        let newsArray = newsData
        if (newsData && typeof newsData === "object" && !Array.isArray(newsData)) {
          // Handle nested structure { news: [...] }
          newsArray = newsData.news || []
        }

        if (Array.isArray(newsArray)) {
          // ✅ Remove duplicates based on unique URL or headline
          const uniqueNews = []
          const seen = new Set()

          for (const item of newsArray) {
            const key = (item.url || item.link || item.headline || item.title || "").trim()
            if (!seen.has(key) && key !== "") {
              seen.add(key)
              uniqueNews.push(item)
            }
          }

          setNews(uniqueNews)
        } else {
          console.error("[v0] News data is not an array:", newsData)
          setNews([])
          setError("Invalid news data format")
        }
      } catch (err) {
        setError(err.message)
        console.error("[v0] Error loading news:", err)
        setNews([])
      } finally {
        setIsLoading(false)
      }
    }

    loadNews()
  }, [selectedStock])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl smooth-transition p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shadow-lg">
          <Newspaper className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
          <p className="text-sm text-gray-600 font-medium">Recent headlines for {selectedStock}</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="text-sm">Failed to load news: {error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-3">
          {news.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No news available for {selectedStock}</p>
          ) : (
            news.map((item, index) => (
              <a
                key={index}
                href={item.url || item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 smooth-transition group hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 smooth-transition mb-2 leading-snug text-sm">
                      {item.headline || item.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold">
                      {item.source} • {item.time || item.date}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 smooth-transition flex-shrink-0 mt-1" />
                </div>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  )
}
