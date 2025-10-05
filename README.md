Stock Forecasting Dashboard

An end-to-end AI-based stock forecasting web application that predicts future prices using ARIMA, LSTM, and Ensemble models, visualized on a modern React dashboard with data stored in MongoDB.

🚀 Features

Fetches and stores historical stock + news data in MongoDB.
Forecasts future prices using:
ARIMA (traditional statistical model)
LSTM (deep learning model)
Ensemble (average of ARIMA + LSTM)
Displays candlestick charts with forecast overlays.
Shows performance metrics (RMSE, MAE, MAPE).
Includes unit tests for data loading and metrics.

🧩 Tech Stack

Frontend: React (Vite), TailwindCSS, Recharts
Backend: Flask, TensorFlow, Statsmodels, Pandas, NumPy
Database: MongoDB Atlas

⚙️ Setup
Backend
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py

Frontend
cd frontend
npm install
npm run dev

Environment

Create a .env file inside backend/:

MONGO_URI=your_mongodb_connection_string

🧪 Testing

Run unit tests:

cd backend
pytest

📊 API Overview
Method	Endpoint	Description
POST	/api/forecast	Returns ARIMA, LSTM, and Ensemble forecasts + metrics
GET	/api/history?symbol=AAPL	Fetches historical stock data
GET	/api/news?symbol=AAPL	Fetches latest stock-related news
🧠 Example Forecast Output
{
  "symbol": "AAPL",
  "forecasts": {
    "arima": [257.5, 257.6, 258.3],
    "lstm": [263.7, 264.2, 265.0],
    "ensemble": [260.6, 260.9, 261.7]
  },
  "metrics": {
    "rmse": 5.85,
    "mae": 5.83,
    "mape": 2.27
  }
}

👨‍💻 Author

Name: Obaid Hussain
GitHub: @obaid1401
