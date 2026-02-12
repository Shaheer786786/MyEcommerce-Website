import { useEffect, useState } from "react";

function AdminLatestProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    oldPrice: "",
    stock: "",
    rating: "",
    reviews: "",
    offer: "",
    tag: "",
    shortDesc: "",

    // ===== ELECTRONICS EXTRA =====
    brand: "",
    model: "",
    material: "",
    warranty: "",
    colors: "",
    sizes: "",
    highlights: "",

    image: "",
    imageFile: null,
  });

  /* ================= FETCH ================= */
  const fetchProducts = () => {
    fetch("http://127.0.0.1:5000/admin/latest-products")
      .then(res => res.json())
      .then(data => setProducts(data || []));
  };

  useEffect(() => {
    fetchProducts();
  }, []);
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = new FormData();

  // ✅ ALWAYS append as STRING (FormData rule)
  payload.append("name", form.name);
  payload.append("category", form.category);
  payload.append("price", form.price);
  payload.append("oldPrice", form.oldPrice);
  payload.append("stock", form.stock);
  payload.append("rating", form.rating);
  payload.append("reviews", form.reviews);
  payload.append("offer", form.offer);
  payload.append("tag", form.tag);
  payload.append("shortDesc", form.shortDesc);

  // electronics
  payload.append("brand", form.brand);
  payload.append("model", form.model);
  payload.append("material", form.material);
  payload.append("warranty", form.warranty);
  payload.append("colors", form.colors);
  payload.append("sizes", form.sizes);
  payload.append("highlights", form.highlights);

  if (form.imageFile) {
    payload.append("imageFile", form.imageFile);
  } else {
    payload.append("image", form.image);
  }

  const url = editingId
    ? `http://127.0.0.1:5000/admin/latest-products/${editingId}`
    : "http://127.0.0.1:5000/admin/latest-products";

  const method = editingId ? "PUT" : "POST";

  await fetch(url, {
    method,
    body: payload,
  });

  setEditingId(null);
  resetForm();
  fetchProducts();
};


  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      oldPrice: "",
      stock: "",
      rating: "",
      reviews: "",
      offer: "",
      tag: "",
      shortDesc: "",
      brand: "",
      model: "",
      material: "",
      warranty: "",
      colors: "",
      sizes: "",
      highlights: "",
      image: "",
      imageFile: null,
    });
  };

  /* ================= ACTIONS ================= */
  const editProduct = (p) => {
    setForm({
      name: p.name || "",
      category: p.category || "",
      price: p.price || "",
      oldPrice: p.oldPrice || "",
      stock: p.stock || "",
      rating: p.rating || "",
      reviews: p.reviews || "",
      offer: p.offer || "",
      tag: p.tag || "",
      shortDesc: p.shortDesc || "",

      brand: p.brand || "",
      model: p.model || "",
      material: p.material || "",
      warranty: p.warranty || "",
      colors: p.colors || "",
      sizes: p.sizes || "",
      highlights: p.highlights || "",

      image: p.image || "",
      imageFile: null,
    });
    setEditingId(p.id);
  };

  const deleteProduct = async (id) => {
    await fetch(`http://127.0.0.1:5000/admin/latest-products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const recoverProduct = async (id) => {
    await fetch(
      `http://127.0.0.1:5000/admin/latest-products/${id}/recover`,
      { method: "POST" }
    );
    fetchProducts();
  };

  const permanentDelete = async (id) => {
    await fetch(
      `http://127.0.0.1:5000/admin/latest-products/${id}/permanent`,
      { method: "DELETE" }
    );
    fetchProducts();
  };

  /* ================= UI ================= */
  return (
    <div className="admin-page">
      <h2>Latest Products – Admin</h2>

      {/* ===== FORM ===== */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <input placeholder="Product Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Category" value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })} />

        <input type="number" placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })} />

        <input type="number" placeholder="Old Price"
          value={form.oldPrice}
          onChange={e => setForm({ ...form, oldPrice: e.target.value })} />

        <input type="number" placeholder="Stock"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })} />

        <input type="number" step="0.1" placeholder="Rating"
          value={form.rating}
          onChange={e => setForm({ ...form, rating: e.target.value })} />

        <input type="number" placeholder="Reviews"
          value={form.reviews}
          onChange={e => setForm({ ...form, reviews: e.target.value })} />

        <input placeholder="Offer" value={form.offer}
          onChange={e => setForm({ ...form, offer: e.target.value })} />

        <input placeholder="Tag" value={form.tag}
          onChange={e => setForm({ ...form, tag: e.target.value })} />

        <input placeholder="Short Description" value={form.shortDesc}
          onChange={e => setForm({ ...form, shortDesc: e.target.value })} />

        {/* ===== ELECTRONICS ===== */}
        <input placeholder="Brand" value={form.brand}
          onChange={e => setForm({ ...form, brand: e.target.value })} />

        <input placeholder="Model" value={form.model}
          onChange={e => setForm({ ...form, model: e.target.value })} />

        <input placeholder="Material" value={form.material}
          onChange={e => setForm({ ...form, material: e.target.value })} />

        <input placeholder="Warranty" value={form.warranty}
          onChange={e => setForm({ ...form, warranty: e.target.value })} />

        <input placeholder="Colors (comma separated)" value={form.colors}
          onChange={e => setForm({ ...form, colors: e.target.value })} />

        <input placeholder="Sizes (comma separated)" value={form.sizes}
          onChange={e => setForm({ ...form, sizes: e.target.value })} />

        <input placeholder="Highlights (comma separated)" value={form.highlights}
          onChange={e => setForm({ ...form, highlights: e.target.value })} />

        <input placeholder="Image URL"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value, imageFile: null })} />

        <input type="file" accept="image/*"
          onChange={e => setForm({ ...form, imageFile: e.target.files[0], image: "" })} />

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* ===== LIVE PREVIEW ===== */}
{(form.name || form.image || form.imageFile) && (
  <div className="ap-product-preview">
    <h3>Live Preview</h3>

    <div className="ap-product-item">
      <div className="ap-product-info">
        <div className="ap-image-wrapper">
          {form.imageFile ? (
            <img
              src={URL.createObjectURL(form.imageFile)}
              alt="preview"
            />
          ) : form.image ? (
            <img src={form.image} alt="preview" />
          ) : (
            <div className="ap-placeholder">No Image</div>
          )}
        </div>

        <div className="ap-details">
          <strong>{form.name || "Product Name"}</strong>

          <p>
            ₹{form.price || "0"}
            {form.oldPrice && (
              <span className="old-price">₹{form.oldPrice}</span>
            )}
          </p>

          {form.offer && (
            <span className="inline-offer">{form.offer}</span>
          )}

          <p>{form.shortDesc || "No description added"}</p>

          <p><b>Stock:</b> {form.stock || 0}</p>
          <p><b>Rating:</b> ⭐ {form.rating || 0} ({form.reviews || 0} reviews)</p>

          <hr />

          <p><b>Brand:</b> {form.brand || "-"}</p>
          <p><b>Model:</b> {form.model || "-"}</p>
          <p><b>Material:</b> {form.material || "-"}</p>
          <p><b>Warranty:</b> {form.warranty || "-"}</p>

          <p><b>Colors:</b> {form.colors || "-"}</p>
          <p><b>Sizes:</b> {form.sizes || "-"}</p>

          {form.highlights && (
            <>
              <p><b>Highlights:</b></p>
              <ul>
                {form.highlights.split(",").map((h, i) => (
                  <li key={i}>{h.trim()}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)}


      {/* ===== TABLE ===== */}
      <table className="admin-table">
<thead>
  <tr>
    <th>Image</th>
    <th>Name</th>
    <th>Category</th>        {/* ✅ NEW */}
    <th>Price</th>
    <th>Old Price</th>       {/* ✅ NEW */}
    <th>Tag</th>       {/* ✅ NEW */}
    <th>Offer</th>           {/* ✅ NEW */}
    <th>Stock</th>
    <th>Rating</th>
    <th>Reviews</th>         {/* ✅ NEW */}
    <th>Brand</th>
    <th>Model</th>
    <th>Material</th>
    <th>Warranty</th>
    <th>Colors</th>
    <th>Sizes</th>
    <th>Highlights</th>
    <th>Actions</th>
  </tr>
</thead>

<tbody>
  {products.map(p => (
   <tr key={p.id}>
  <td>
    <img src={p.image} className="product-thumb" />
  </td>

  <td>{p.name}</td>

  {/* ✅ CATEGORY */}
  <td>{p.category || "-"}</td>

  {/* ✅ PRICE */}
  <td>₹{p.price}</td>

  {/* ✅ OLD PRICE */}
  <td>
    {p.oldPrice ? (
      <span className="old-price">₹{p.oldPrice}</span>
    ) : "-"}
  </td>
  {/* ✅ Tag */}
  <td>
    {p.tag ? (
      <span className="inline-tag">{p.tag}</span>
    ) : "-"}
  </td>

  {/* ✅ OFFER */}
  <td>
    {p.offer ? (
      <span className="inline-offer">{p.offer}</span>
    ) : "-"}
  </td>

  <td>{p.stock}</td>

  {/* ✅ RATING */}
  <td>{p.rating}</td>

  {/* ✅ REVIEWS */}
  <td>{p.reviews || 0}</td>

  <td>{p.brand || "-"}</td>
  <td>{p.model || "-"}</td>
  <td>{p.material || "-"}</td>
  <td>{p.warranty || "-"}</td>

  <td>{p.colors || "-"}</td>
  <td>{p.sizes || "-"}</td>

  <td style={{ maxWidth: 200 }}>
    {p.highlights
      ? p.highlights.split(",").map((h, i) => (
          <div key={i}>• {h.trim()}</div>
        ))
      : "-"}
  </td>

  <td>
    {!p.deleted ? (
      <>
        <button onClick={() => editProduct(p)}>Edit</button>
        <button onClick={() => deleteProduct(p.id)}>Delete</button>
      </>
    ) : (
      <>
        <button className="recover-btn" onClick={() => recoverProduct(p.id)}>
          Recover
        </button>
        <button className="permanent-btn" onClick={() => permanentDelete(p.id)}>
          Permanent
        </button>
      </>
    )}
  </td>
</tr>
  ))}
</tbody>

      </table>
    </div>
  );
}

export default AdminLatestProducts;
