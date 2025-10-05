import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

def train_lstm(df, forecast_steps=5):
    """Train LSTM and forecast"""
    series = df["Close"].values.reshape(-1, 1)

    scaler = MinMaxScaler(feature_range=(0,1))
    scaled = scaler.fit_transform(series)

    X, y = [], []
    for i in range(10, len(scaled)):
        X.append(scaled[i-10:i, 0])
        y.append(scaled[i, 0])
    X, y = np.array(X), np.array(y)

    X = np.reshape(X, (X.shape[0], X.shape[1], 1))

    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(X.shape[1], 1)),
        LSTM(50),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X, y, epochs=3, batch_size=1, verbose=0)

    last_10 = scaled[-10:].reshape(1, 10, 1)
    preds = []
    for _ in range(forecast_steps):
        pred = model.predict(last_10, verbose=0)[0][0]
        preds.append(pred)
        last_10 = np.append(last_10[:,1:,:], [[[pred]]], axis=1)

    preds = scaler.inverse_transform(np.array(preds).reshape(-1,1))
    return preds.flatten().tolist()
