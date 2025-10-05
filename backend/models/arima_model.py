import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

def train_arima(df, forecast_steps=5):
    """Train ARIMA and forecast"""
    series = df["Close"]

    model = ARIMA(series, order=(5,1,0))  # (p,d,q)
    model_fit = model.fit()

    forecast = model_fit.forecast(steps=forecast_steps)
    return forecast.tolist()
