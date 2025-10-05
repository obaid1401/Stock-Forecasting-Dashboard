import feedparser
from services.db import db

def _clean_and_save_news(news_list, symbol):
    """Clean and store news in MongoDB."""
    news_records = []
    for entry in news_list:
        news_records.append({
            "headline": entry.get("title"),
            "link": entry.get("link"),
            "date": entry.get("published", ""),
            "symbol": symbol
        })

    if news_records:
        db.news.insert_many(news_records)
        print(f"✅ Saved {len(news_records)} news for {symbol} in MongoDB")

    return news_records


def get_yahoo_finance_news(symbol, limit=5):
    """Fetch news from Yahoo Finance RSS for a specific stock symbol."""
    rss_url = f"https://feeds.finance.yahoo.com/rss/2.0/headline?s={symbol}&region=US&lang=en-US"
    feed = feedparser.parse(rss_url)
    news_list = feed.entries[:limit]
    return _clean_and_save_news(news_list, symbol)


def get_reuters_news(limit=5):
    """Fetch general business news from Reuters RSS."""
    rss_url = "https://feeds.reuters.com/reuters/businessNews"
    feed = feedparser.parse(rss_url)
    news_list = feed.entries[:limit]
    return _clean_and_save_news(news_list, "Reuters")


def get_coindesk_news(limit=5, symbol="Crypto"):
    """Fetch crypto news from CoinDesk RSS."""
    rss_url = "https://www.coindesk.com/arc/outboundfeeds/rss/"
    feed = feedparser.parse(rss_url)
    news_list = feed.entries[:limit]
    return _clean_and_save_news(news_list, symbol)

