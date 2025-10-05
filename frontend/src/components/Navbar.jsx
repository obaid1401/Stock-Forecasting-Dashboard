import { TrendingUp } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="bg-white border-b-2 border-gray-200 shadow-md">
      <div className="container mx-auto px-6 py-5 max-w-7xl">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shadow-lg">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Stock Forecasting Dashboard</h1>
            <p className="text-sm text-gray-600 font-medium">AI-Powered Market Predictions</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
