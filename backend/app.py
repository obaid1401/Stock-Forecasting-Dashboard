from flask import Flask, jsonify, request
from flask_cors import CORS  # ✅ Add this import
from services.db import db
from models.data_loader import load_stock_data
from models.ensemble import ensemble_forecast
from utils.metrics import rmse, mae, mape

app = Flask(__name__)

# ✅ Enable CORS for your frontend
CORS(app, origins=["http://localhost:5173"])

# --------------------------------------------------
# 🟩 API 1: Get Historical Data (for Candlestick)
# --------------------------------------------------
@app.route("/api/history", methods=["GET"])
def get_history():
    symbol = request.args.get("symbol", "AAPL")
    limit = int(request.args.get("limit", 30))

    try:
        cursor = db.historical_prices.find({"symbol": symbol}).sort("Date", -1).limit(limit)
        data = list(cursor)

        for d in data:
            d["_id"] = str(d["_id"])

        data.reverse()
        return jsonify({"symbol": symbol, "history": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# 🟩 API 2: Get News Headlines (for News Feed)
# --------------------------------------------------
@app.route("/api/news", methods=["GET"])
def get_news():
    symbol = request.args.get("symbol", "AAPL")
    limit = int(request.args.get("limit", 10))

    try:
        cursor = db.news.find({"symbol": symbol}).sort("date", -1).limit(limit)
        news = list(cursor)

        for n in news:
            n["_id"] = str(n["_id"])

        return jsonify({"symbol": symbol, "news": news})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# 🟩 API 3: Forecast Endpoint (ARIMA + LSTM + Ensemble)
# --------------------------------------------------
@app.route("/api/forecast", methods=["POST"])
def forecast():
    data = request.json
    symbol = data.get("symbol", "AAPL")
    steps = int(data.get("steps", 5))

    try:
        df = load_stock_data(symbol)
        forecasts = ensemble_forecast(df, forecast_steps=steps)

        actual = df["Close"].values[-steps:].tolist()
        metrics = {
            "rmse": rmse(actual, forecasts["ensemble"]),
            "mae": mae(actual, forecasts["ensemble"]),
            "mape": mape(actual, forecasts["ensemble"])
        }

        return jsonify({
            "symbol": symbol,
            "forecasts": forecasts,
            "metrics": metrics
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# 🟩 Default Home Route
# --------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"msg": "✅ Flask backend is running. Use /api/history, /api/news, or /api/forecast"})


# --------------------------------------------------
# 🟩 Run Flask App
# --------------------------------------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False, use_reloader=False)
