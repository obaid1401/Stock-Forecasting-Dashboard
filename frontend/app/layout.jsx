export const metadata = {
  title: "Stock Forecasting Dashboard",
  description: "Modern stock forecasting dashboard with ARIMA, LSTM, and Ensemble predictions",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
