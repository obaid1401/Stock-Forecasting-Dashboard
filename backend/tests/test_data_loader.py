import pytest
import pandas as pd
from models.data_loader import load_stock_data

def test_load_stock_data(monkeypatch):
    """Mock MongoDB and test that load_stock_data returns a valid DataFrame."""

    mock_data = [
        {"Date": "2025-09-01", "Open": 100, "High": 105, "Low": 99, "Close": 104, "Volume": 50000},
        {"Date": "2025-09-02", "Open": 104, "High": 108, "Low": 103, "Close": 107, "Volume": 48000}
    ]

    def mock_find(query):
        return mock_data

    monkeypatch.setattr("models.data_loader.db.historical_prices.find", mock_find)

    df = load_stock_data("AAPL")

    assert isinstance(df, pd.DataFrame)
    assert not df.empty
    assert all(col in df.columns for col in ["Date", "Open", "High", "Low", "Close", "Volume"])
