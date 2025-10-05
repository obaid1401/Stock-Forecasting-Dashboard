"use client"

import { ChevronDown } from "lucide-react"

const STOCKS = [
  { value: "AAPL", label: "Apple Inc. (AAPL)" },
  { value: "TSLA", label: "Tesla Inc. (TSLA)" },
  { value: "GOOGL", label: "Alphabet Inc. (GOOGL)" },
  { value: "MSFT", label: "Microsoft Corp. (MSFT)" },
  { value: "AMZN", label: "Amazon.com Inc. (AMZN)" },
  { value: "BTC-USD", label: "Bitcoin USD (BTC-USD)" },
]

export default function StockSelector({ selectedStock, onStockChange }) {
  return (
    <div className="flex-1 min-w-[250px]">
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Select Stock</label>
      <div className="relative">
        <select
          value={selectedStock}
          onChange={(e) => onStockChange(e.target.value)}
          className="w-full appearance-none bg-white border-2 border-gray-300 rounded-xl px-4 py-3.5 pr-10 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-blue-400 shadow-sm hover:shadow-md"
        >
          {STOCKS.map((stock) => (
            <option key={stock.value} value={stock.value}>
              {stock.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
      </div>
    </div>
  )
}
