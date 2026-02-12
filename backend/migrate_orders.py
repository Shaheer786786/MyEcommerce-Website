from pymongo import MongoClient
import json
import os

MONGO_URI = "mongodb+srv://shaheer_mongodb:soyal12345@cluster0.qhf6ili.mongodb.net/mydb?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client["ecommerce"]
orders_col = db["orders"]

ORDERS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "orders.json")

if os.path.exists(ORDERS_FILE):
    with open(ORDERS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        orders = data.get("orders", [])
        if orders:
            for order in orders:
                orders_col.update_one({"id": order["id"]}, {"$set": order}, upsert=True)