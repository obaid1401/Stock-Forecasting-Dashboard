import yfinance as yf
import pandas as pd
from services.db import db

def get_stock_data(symbol, period="1mo"):
    """Fetch historical stock/crypto data with indicators and save to MongoDB"""
    data = yf.download(symbol, period=period, interval="1d")

    if data.empty:
        print(f" No data returned for {symbol}. Try a longer period.")
        return pd.DataFrame()

    if isinstance(data.columns, pd.MultiIndex):
        data.columns = [col[0] for col in data.columns]

    data["Return"] = data["Close"].pct_change()
    data["MA5"] = data["Close"].rolling(window=5).mean()
    data["Volatility"] = data["Return"].rolling(window=5).std()

    data.reset_index(inplace=True)

    cols = ["Date", "Open", "High", "Low", "Close", "Volume", "Return", "MA5", "Volatility"]
    data = data[cols].dropna()

    data["Date"] = data["Date"].astype(str)

    records = data.to_dict(orient="records")

    if records:
        db.historical_prices.delete_many({"symbol": symbol}) 
        for record in records:
            record["symbol"] = symbol
        db.historical_prices.insert_many(records)
        print(f"✅ Saved {len(records)} records for {symbol} in MongoDB")

    return data
