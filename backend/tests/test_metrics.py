import pytest
from utils.metrics import rmse, mae, mape

def test_rmse():
    actual = [1, 2, 3]
    predicted = [1, 2, 3]
    assert rmse(actual, predicted) == 0.0


def test_mae():
    actual = [2, 4, 6]
    predicted = [1, 5, 7]
    result = mae(actual, predicted)
    assert round(result, 2) == 1.0


def test_mape():
    actual = [100, 200, 300]
    predicted = [110, 190, 290]
    result = mape(actual, predicted)
    assert round(result, 2) == 6.11
