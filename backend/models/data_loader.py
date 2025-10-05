import pandas as pd
from services.db import db

def load_stock_data(symbol, limit=100):
    """Fetch stock data for a given symbol from MongoDB and return a clean DataFrame."""
    cursor = (
        db.historical_prices
        .find({"symbol": symbol}, {"_id": 0})
        .sort("Date", -1)
        .limit(limit)
    )
    data = list(cursor)

    if not data:
        raise ValueError(f"No data found for {symbol} in MongoDB.")

    df = pd.DataFrame(data)
    
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df = df.dropna(subset=["Date"]) 
    
    df = df.sort_values("Date").reset_index(drop=True)

    return df
