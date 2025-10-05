import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "forecast_db")

if not MONGO_URI:
    raise Exception("Mongo URI not found in .env file")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

print("✅ Connected to MongoDB:", DB_NAME)
