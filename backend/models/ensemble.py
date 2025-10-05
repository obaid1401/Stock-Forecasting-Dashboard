from .arima_model import train_arima
from .lstm_model import train_lstm

def ensemble_forecast(df, forecast_steps=5):
    """Average ARIMA + LSTM predictions"""
    arima_preds = train_arima(df, forecast_steps)
    lstm_preds = train_lstm(df, forecast_steps)

    combined = [(a+l)/2 for a, l in zip(arima_preds, lstm_preds)]
    return {
        "arima": arima_preds,
        "lstm": lstm_preds,
        "ensemble": combined
    }
