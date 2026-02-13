from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from flask import abort
import os
import json
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta


app = Flask(__name__)
CORS(app)



JWT_SECRET = "supersecretkey"   # production me env variable
JWT_ALGO = "HS256"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "images")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "ico"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# MONGO_URI = "mongodb+srv://shaheer_mongodb:soyal12345@cluster0.qhf6ili.mongodb.net/mydb?retryWrites=true&w=majority"
# client = MongoClient(MONGO_URI)

MONGO_URI = os.environ.get("mongodb+srv://shaheer_mongodb:soyal12345@cluster0.qhf6ili.mongodb.net/mydb?retryWrites=true&w=majority")
client = MongoClient(MONGO_URI)
db = client["ecommerce"]
collection = db["products"] 
orders_col = db["orders"]      
   


ORDERS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "orders.json")

# Load orders from JSON into MongoDB
if os.path.exists(ORDERS_FILE):
    with open(ORDERS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        orders = data.get("orders", [])
        if orders:
            for order in orders:
                orders_col.update_one({"id": order["id"]}, {"$set": order}, upsert=True)

@app.route("/user-orders/<user_id>")
def get_user_orders(user_id):
    # Make sure we use string form of ObjectId
    user_orders = list(orders_col.find({"userId": user_id}, {"_id": 0}))
    
    # If your MongoDB orders don't have 'userId', you must include it when creating orders
    # For example, when creating order:
    # order_data["userId"] = user_id
    
    return jsonify(user_orders)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def read_data():
    return collection.find_one({}, {"_id": 0}) or {}

def write_data(new_data):
    collection.update_one({}, {"$set": new_data})

def get_list(data, key):
    return [item for item in data.get(key, []) if not item.get("deleted", False)]

def add_item(data, key, item):
    item["id"] = max([i.get("id",0) for i in data.get(key, [])]+[0]) + 1
    item["deleted"] = False
    item["createdAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    temp = data.get(key, [])
    temp.insert(0, item)
    data[key] = temp
    write_data(data)
    return item

def modify_item(data, key, item_id, new_data=None, delete=False):
    items = data.get(key, [])
    item = next((i for i in items if i["id"] == item_id), None)
    if not item:
        return None
    if delete:
        item["deleted"] = True
    elif new_data:
        item.update(new_data)
    data[key] = items
    write_data(data)
    return item

@app.route("/images/<path:filename>")
def images(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return jsonify({"filename": filename}), 201
    return jsonify({"error": "Invalid file"}), 400

@app.route("/preloader")
def preloader():
    """
    Returns preloader configuration for frontend from MongoDB
    """
    try:
        data = collection.find_one({"preloader": {"$exists": True}}, {"_id": 0, "preloader": 1})
        if not data:
            return jsonify({"error": "Preloader config not found"}), 404

        return jsonify(data["preloader"])

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    existing = db.users.find_one({"email": email})
    if existing:
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = generate_password_hash(password)

    user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "createdAt": datetime.utcnow()
    }

    db.users.insert_one(user)

    return jsonify({"success": True, "message": "User registered"})

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {"user_id": str(user["_id"]), "email": user["email"]},
        JWT_SECRET,
        algorithm=JWT_ALGO
    )

    return jsonify({
        "token": token,
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    })

@app.route("/admin/dashboard/stats")
def admin_dashboard_stats():
    total_customers = db.users.count_documents({})

    today = datetime.utcnow().replace(hour=0, minute=0, second=0)
    new_today = db.users.count_documents({
        "createdAt": {"$gte": today}
    })

    last_7_days = datetime.utcnow() - timedelta(days=7)
    new_week = db.users.count_documents({
        "createdAt": {"$gte": last_7_days}
    })

    total_orders = orders_col.count_documents({})
    total_revenue = sum(
        o.get("total", 0) for o in orders_col.find()
    )

    return jsonify({
        "totalCustomers": total_customers,
        "newCustomersToday": new_today,
        "newCustomersWeek": new_week,
        "totalOrders": total_orders,
        "totalRevenue": total_revenue
    })

@app.route("/admin/customers")
def admin_customers():
    users = list(db.users.find({}, {"password": 0}))
    for u in users:
        u["_id"] = str(u["_id"])
    return jsonify(users)

@app.route("/user/<user_id>", methods=["GET", "PUT"])
def user_profile(user_id):
    user = db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    user["_id"] = str(user["_id"])
    
    if request.method == "PUT":
        update_data = request.get_json()
        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        user.update(update_data)
        return jsonify({"success": True, "user": user})
    
    return jsonify(user)

@app.route("/")
def home():
    return "Backend is Running Successfully 🚀"

@app.route("/banner")
def banners():
    data = read_data()
    return jsonify(get_list(data, "banners"))


@app.route("/brands")
def brands():
    data = read_data()
    return jsonify(get_list(data, "brands"))

@app.route("/admin/brands", methods=["GET", "POST"])
def admin_brands():
    data = read_data()

    if "brands" not in data:
        data["brands"] = []

    if request.method == "GET":
        return jsonify(get_list(data, "brands"))

    # ===== POST : ADD BRAND =====
    item = request.form.to_dict()

    if not item.get("name"):
        return jsonify({"success": False, "error": "Brand name required"}), 400

    file = request.files.get("imageFile")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        item["image"] = f"http://127.0.0.1:5000/images/{filename}"

    item["id"] = max([b.get("id", 0) for b in data["brands"]] + [0]) + 1
    item["deleted"] = False
    item["createdAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    data["brands"].insert(0, item)
    write_data(data)

    return jsonify({"success": True, "brand": item})

@app.route("/admin/brands/<int:id>", methods=["PUT", "DELETE"])
def admin_brands_modify(id):
    data = read_data()

    if request.method == "DELETE":
        item = modify_item(data, "brands", id, delete=True)
        write_data(data)
        return jsonify({"success": True if item else False})

    # ===== PUT : EDIT BRAND =====
    update_data = request.form.to_dict()

    file = request.files.get("imageFile")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        update_data["image"] = f"http://127.0.0.1:5000/images/{filename}"

    item = modify_item(data, "brands", id, new_data=update_data)
    write_data(data)

    return jsonify({"success": True if item else False})
  

@app.route("/products")
def products():
    data = read_data()
    active_products = get_list(data, "products")
    active_products.sort(key=lambda x: x.get("id",0), reverse=True)
    return jsonify(active_products)

@app.route("/latestProducts")
def latest_products():
    data = read_data()
    latest = get_list(data, "LatestProducts")
    latest.sort(key=lambda x: x.get("id",0), reverse=True)
    return jsonify(latest)

@app.route("/admin/latest-products", methods=["GET"])
def admin_get_latest_products():
    data = read_data()
    return jsonify(data.get("LatestProducts", []))

@app.route("/admin/latest-products", methods=["POST"])
def admin_add_latest_product():
    data = read_data()
    products = data.get("LatestProducts", [])

    product = request.form.to_dict()

    file = request.files.get("imageFile")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        product["image"] = f"http://127.0.0.1:5000/images/{filename}"

    product["id"] = max([p.get("id", 0) for p in products] + [0]) + 1
    product["deleted"] = False
    product["createdAt"] = datetime.now().isoformat()

    products.insert(0, product)
    data["LatestProducts"] = products
    collection.update_one({}, {"$set": data}, upsert=True)

    return jsonify({"success": True})


@app.route("/admin/latest-products/<int:id>", methods=["PUT"])
def admin_update_latest_product(id):
    data = read_data()
    products = data.get("LatestProducts", [])

    product = next((p for p in products if p["id"] == id), None)
    if not product:
        return jsonify({"error": "Not found"}), 404

    update_data = request.form.to_dict()

    file = request.files.get("imageFile")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        update_data["image"] = f"http://127.0.0.1:5000/images/{filename}"

    product.update(update_data)
    collection.update_one({}, {"$set": data}, upsert=True)

    return jsonify({"success": True})

@app.route("/admin/latest-products/<int:id>", methods=["DELETE"])
def admin_delete_latest_product(id):
    data = read_data()
    products = data.get("LatestProducts", [])

    product = next((p for p in products if p["id"] == id), None)
    if not product:
        return jsonify({"error": "Not found"}), 404

    product["deleted"] = True
    collection.update_one({}, {"$set": data}, upsert=True)

    return jsonify({"success": True})

@app.route("/admin/latest-products/<int:id>/recover", methods=["POST"])
def admin_recover_latest_product(id):
    data = read_data()
    products = data.get("LatestProducts", [])

    product = next((p for p in products if p["id"] == id), None)
    if not product:
        return jsonify({"error": "Not found"}), 404

    product["deleted"] = False
    collection.update_one({}, {"$set": data}, upsert=True)

    return jsonify({"success": True})


@app.route("/admin/latest-products/<int:id>/permanent", methods=["DELETE"])
def admin_permanent_delete_latest_product(id):
    data = read_data()
    products = data.get("LatestProducts", [])

    data["LatestProducts"] = [p for p in products if p["id"] != id]
    collection.update_one({}, {"$set": data}, upsert=True)

    return jsonify({"success": True})




@app.route("/categories")
def categories():
    data = read_data()
    return jsonify(get_list(data, "categories"))


# ============================
# ELECTRONICS (PUBLIC)
# ============================
@app.route("/electronics")
def electronics():
    data = read_data()
    electronics = [e for e in data.get("electronics", []) if not e.get("deleted", False)]
    electronics.sort(key=lambda x: x.get("id", 0), reverse=True)
    return jsonify(electronics)


# ============================
# ADMIN ELECTRONICS
# ============================
@app.route("/admin/electronics", methods=["GET", "POST"])
def admin_electronics():
    data = read_data()
    data.setdefault("electronics", [])

    # ---------- GET ----------
    if request.method == "GET":
        return jsonify(data["electronics"])

    # ---------- POST ----------
    if request.is_json:
        item = request.get_json()
    else:
        item = request.form.to_dict()

    # BASIC
    item["id"] = max([i.get("id", 0) for i in data["electronics"]] + [0]) + 1
    item["deleted"] = False
    item["createdAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # EXTRA DETAILS
    item["brand"] = item.get("brand", "")
    item["model"] = item.get("model", "")
    item["material"] = item.get("material", "")
    item["warranty"] = item.get("warranty", "")
    item["quantity"] = int(item.get("quantity", 1))

    item["colors"] = item.get("colors", [])
    item["sizes"] = item.get("sizes", [])
    item["highlights"] = item.get("highlights", [])

    item["specifications"] = item.get("specifications", {})

    if "images" not in item:
        item["images"] = []

    # NUMBERS
    for f in ["price", "oldPrice", "stock", "rating", "reviews"]:
        if f in item and item[f] != "":
            item[f] = float(item[f]) if "." in str(item[f]) else int(item[f])

    data["electronics"].insert(0, item)
    write_data(data)
    return jsonify(item)


# ============================
# UPDATE / DELETE
# ============================
@app.route("/admin/electronics/<int:id>", methods=["PUT", "DELETE"])
def admin_electronics_modify(id):
    data = read_data()
    item = next((e for e in data.get("electronics", []) if e["id"] == id), None)
    if not item:
        return jsonify({"error": "Not found"}), 404

    if request.method == "DELETE":
        item["deleted"] = True
        write_data(data)
        return jsonify({"success": True})

    # PUT
    update_data = request.get_json() if request.is_json else request.form.to_dict()

    item.update(update_data)

    write_data(data)
    return jsonify({"success": True})


# ============================
# RECOVER
# ============================
@app.route("/admin/electronics/<int:id>/recover", methods=["POST"])
def recover_electronics(id):
    data = read_data()
    item = next((e for e in data.get("electronics", []) if e["id"] == id), None)
    if not item:
        return jsonify({"error": "Not found"}), 404
    item["deleted"] = False
    write_data(data)
    return jsonify({"success": True})


# ============================
# PERMANENT DELETE
# ============================
@app.route("/admin/electronics/<int:id>/permanent", methods=["DELETE"])
def permanent_delete_electronics(id):
    data = read_data()
    data["electronics"] = [e for e in data.get("electronics", []) if e["id"] != id]
    write_data(data)
    return jsonify({"success": True})


@app.route("/features")
def features():
    data = read_data()
    return jsonify(get_list(data, "features"))

@app.route("/promo")
def promo():
    data = read_data()
    return jsonify(get_list(data, "promo"))
# ============================
# BANNERS TWO CRUD (inside products collection)
# ============================

def get_banners_two_list():
    data = read_data()
    return [b for b in data.get("bannersTwo", []) if not b.get("deleted", False)]

@app.route("/banners-two", methods=["GET"])
def get_banners_two():
    return jsonify(get_banners_two_list())


@app.route("/banners-two", methods=["POST"])
def add_banner_two():
    banner = request.json
    if not banner.get("image"):
        return jsonify({"success": False, "message": "Image required"}), 400

    # Initialize if not exists
    data = read_data()
    if "bannersTwo" not in data:
        data["bannersTwo"] = []

    banner["id"] = max([b.get("id",0) for b in data["bannersTwo"]] + [0]) + 1
    banner["deleted"] = False
    banner["createdAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Insert at beginning
    data["bannersTwo"].insert(0, banner)
    write_data(data)

    return jsonify({"success": True, "banner": banner})


@app.route("/banners-two/<int:id>", methods=["PUT"])
def update_banner_two(id):
    data = read_data()
    banners = data.get("bannersTwo", [])
    banner = next((b for b in banners if b["id"] == id), None)
    if not banner:
        return jsonify({"success": False, "message": "Banner not found"}), 404

    update_data = request.json
    banner.update(update_data)
    data["bannersTwo"] = banners
    write_data(data)

    return jsonify({"success": True, "banner": banner})


@app.route("/banners-two/<int:id>", methods=["DELETE"])
def delete_banner_two(id):
    data = read_data()
    banners = data.get("bannersTwo", [])
    banner = next((b for b in banners if b["id"] == id), None)
    if not banner:
        return jsonify({"success": False, "message": "Banner not found"}), 404

    banner["deleted"] = True
    data["bannersTwo"] = banners
    write_data(data)

    return jsonify({"success": True, "banner": banner})


@app.route("/site-config")
def site_config():
    data = read_data()
    return jsonify(data.get("site", {}))

@app.route("/navbar")
def navbar():
    data = read_data()
    return jsonify(data.get("navbar", {}))

@app.route("/footer")
def get_footer():
    data = read_data()
    return jsonify(data.get("footer", {}))

# PUT footer
@app.route("/admin/footer", methods=["PUT"])
def admin_footer():
    footer_data = request.get_json()
    data = read_data()
    if "footer" not in data:
        data["footer"] = {}
    data["footer"].update(footer_data)
    write_data(data)
    return jsonify({"success": True})

@app.route("/orders", methods=["POST"])
def create_order():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    data["createdAt"] = datetime.now()
    data["status"] = "Pending"

    last_order = orders_col.find_one(sort=[("createdAt", -1)])
    data["displayId"] = last_order["displayId"] + 1 if last_order else 1

    result = orders_col.insert_one(data)
    return jsonify({"message": "Order created", "order_id": str(result.inserted_id)}), 201



# GET all orders (newest first)
@app.route("/orders")
def get_orders():
    orders = list(orders_col.find().sort("createdAt", -1))  # newest first
    for order in orders:
        order["_id"] = str(order["_id"])  # MongoID ko string me convert
        order["displayId"] = order["_id"]  # displayId ab MongoDB ka real ID
        if "createdAt" in order:
            order["createdAt"] = order["createdAt"].isoformat()
    return jsonify(orders)

# PUT update order status
@app.route("/orders/<order_id>/status", methods=["PUT"])
def update_order_status(order_id):
    status = request.json.get("status")
    result = orders_col.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status}}
    )
    if result.modified_count:
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Order not found"})

@app.route("/orders/<order_id>", methods=["DELETE"])
def delete_order(order_id):
    if not ObjectId.is_valid(order_id):
        return jsonify({"success": False, "error": "Invalid ID"}), 400

    result = orders_col.delete_one({"_id": ObjectId(order_id)})
    if result.deleted_count == 1:
        return jsonify({"success": True})

    return jsonify({"success": False, "error": "Order not found"}), 404



@app.route("/admin/sidebar")
def admin_sidebar():
    data = read_data()
    return jsonify(data.get("admin", {}).get("sidebar", {"title":"Admin Panel","menus":[] }))

@app.route("/admin/topbar")
def admin_topbar():
    data = read_data()
    return jsonify(data.get("admin", {}).get("topbar", {"title":"Welcome Admin"}))

@app.route("/admin/navbar/menu", methods=["GET", "POST"])
def admin_navbar_menu():
    data = read_data()

    if "navbar" not in data:
        data["navbar"] = {"menu": []}

    menu = data["navbar"].get("menu", [])

    if request.method == "GET":
        return jsonify(menu)

    new_menu = request.get_json()
    new_menu["id"] = max([m.get("id", 0) for m in menu] + [0]) + 1
    new_menu["deleted"] = False
    new_menu["createdAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    menu.insert(0, new_menu)
    data["navbar"]["menu"] = menu
    write_data(data)

    return jsonify({"success": True})

@app.route("/admin/navbar/menu/<int:menu_id>", methods=["DELETE", "POST"])
def admin_navbar_menu_modify(menu_id):
    data = read_data()
    menu = data.get("navbar", {}).get("menu", [])

    item = next((m for m in menu if m["id"] == menu_id), None)
    if not item:
        return jsonify({"error": "Not found"}), 404

    if request.method == "DELETE":
        if request.args.get("permanent") == "true":
            data["navbar"]["menu"] = [m for m in menu if m["id"] != menu_id]
        else:
            item["deleted"] = True

    if request.method == "POST":
        item["deleted"] = False

    write_data(data)
    return jsonify({"success": True})

@app.route("/admin/navbar/config", methods=["GET", "PUT"])
def admin_navbar_config():
    data = read_data()

    if "navbar" not in data:
        data["navbar"] = {}

    if request.method == "GET":
        return jsonify(data["navbar"])

    config = request.get_json()
    data["navbar"].update(config)
    write_data(data)
    return jsonify({"success": True})

@app.route("/admin/<string:key>", methods=["GET","POST"])
def admin_get_post(key):
    key_map = {
        "banners":"banners",
        "products":"products",
        # "latest-products":"LatestProducts",
        "categories":"categories",
        "features":"features",
        "promo":"promo"
    }
    if key not in key_map:
        return jsonify({"error":"Invalid key"}), 400
    data = read_data()
    col_key = key_map[key]
    if request.method=="GET":
        return jsonify(get_list(data,col_key))
    item = request.get_json()
    added = add_item(data,col_key,item)
    return jsonify({"success": True, col_key: added})
@app.route("/admin/<string:key>/<int:item_id>", methods=["PUT","DELETE"])
def admin_put_delete(key, item_id):
    key_map = {
        "banners":"banners",
        "products":"products",
        # "latest-products":"LatestProducts",
        "categories":"categories",
        "features":"features",
        "promo":"promo"
    }

    if key not in key_map:
        return jsonify({"error":"Invalid key"}), 400

    data = read_data()
    col_key = key_map[key]

    if request.method == "DELETE":
        items = data.get(col_key, [])
        new_items = [i for i in items if i["id"] != item_id]
        if len(items) == len(new_items):
            return jsonify({"error":"Item not found"}), 404 
        data[col_key] = new_items
        write_data(data)
        return jsonify({"success": True})

    item = modify_item(data, col_key, item_id, request.get_json())
    if not item:
        return jsonify({"error":"Not found"}), 404

    return jsonify({"success": True})

if __name__ == "__main__":
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)

