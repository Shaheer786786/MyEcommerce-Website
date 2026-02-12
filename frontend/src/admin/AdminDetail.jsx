// import React, { useEffect, useState } from "react";
// import "./AdminDetail.css";

// const emptyForm = {
//   name: "",
//   category: "",
//   price: 0,
//   stock: 0,
//   shortDesc: "",
//   description: "",
//   image: "",
//   images: [],
//   offer: 0
// };

// function AdminDetail() {
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editingId, setEditingId] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   /* ================= LOAD ================= */
//   const loadProducts = () => {
//     fetch("http://127.0.0.1:5000/products")
//       .then(res => res.json())
//       .then(data => setProducts(data.filter(p => !p.deleted)));
//   };

//   useEffect(loadProducts, []);

//   /* ================= ADD / UPDATE ================= */
//   const submitProduct = () => {
//     const url = editingId
//       ? `http://127.0.0.1:5000/products/${editingId}`
//       : "http://127.0.0.1:5000/products";

//     fetch(url, {
//       method: editingId ? "PUT" : "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form)
//     }).then(() => {
//       setForm(emptyForm);
//       setEditingId(null);
//       loadProducts();
//     });
//   };

//   const editProduct = (prod) => {
//     setForm(prod);
//     setEditingId(prod.id);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   /* ================= DELETE ================= */
//   const deleteProduct = async (id) => {
//     if (!window.confirm("Delete this product permanently?")) return;

//     await fetch(`http://127.0.0.1:5000/products/${id}`, { method: "DELETE" });
//     loadProducts();
//   };

//   /* ================= IMAGE UPLOAD ================= */
//   const uploadImage = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     const fd = new FormData();
//     fd.append("file", file);

//     fetch("http://127.0.0.1:5000/upload", {
//       method: "POST",
//       body: fd
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.filename) {
//           setForm(prev => ({
//             ...prev,
//             image: `http://127.0.0.1:5000/images/${data.filename}`
//           }));
//         }
//       })
//       .finally(() => setUploading(false));
//   };

//   const handleWebImage = (e) => {
//     setForm(prev => ({ ...prev, image: e.target.value }));
//   };

//   return (
//     <div className="admin-page">
//       <h2>Product Manager</h2>

//       {/* ================= FORM ================= */}
//       <div className="admin-card">
//         <input
//           placeholder="Product Name"
//           value={form.name}
//           onChange={e => setForm({ ...form, name: e.target.value })}
//         />

//         <input
//           placeholder="Category"
//           value={form.category}
//           onChange={e => setForm({ ...form, category: e.target.value })}
//         />

//         <input
//           type="number"
//           placeholder="Price"
//           value={form.price}
//           onChange={e => setForm({ ...form, price: Number(e.target.value) })}
//         />

//         <input
//           type="number"
//           placeholder="Stock"
//           value={form.stock}
//           onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
//         />

//         <input
//           placeholder="Short Description"
//           value={form.shortDesc}
//           onChange={e => setForm({ ...form, shortDesc: e.target.value })}
//         />

//         <textarea
//           placeholder="Full Description"
//           value={form.description}
//           onChange={e => setForm({ ...form, description: e.target.value })}
//         />

//         <input
//           type="number"
//           placeholder="Offer (%)"
//           value={form.offer}
//           onChange={e => setForm({ ...form, offer: Number(e.target.value) })}
//         />

//         <label>Upload Main Image</label>
//         <input type="file" accept="image/*" onChange={uploadImage} />
//         {uploading && <small>Uploading...</small>}

//         <label>Or Web Image URL</label>
//         <input
//           placeholder="https://example.com/product.jpg"
//           value={form.image.startsWith("http") ? form.image : ""}
//           onChange={handleWebImage}
//         />

//         {form.image && (
//           <img src={form.image} alt="preview" className="preview-img" />
//         )}

//         <button onClick={submitProduct}>
//           {editingId ? "Update Product" : "Add Product"}
//         </button>
//       </div>

//       {/* ================= PRODUCTS PREVIEW ================= */}
//       <div className="admin-products">
//         {products.map(prod => (
//           <div key={prod.id} className="admin-product-card">
//             {prod.image && <img src={prod.image} alt={prod.name} />}
//             <div className="admin-product-info">
//               <h3>{prod.name}</h3>
//               <p>Category: {prod.category}</p>
//               <p>Price: ₹{prod.price}</p>
//               <p>Stock: {prod.stock}</p>
//             </div>
//             <div className="admin-actions">
//               <button className="edit" onClick={() => editProduct(prod)}>Edit</button>
//               <button className="delete" onClick={() => deleteProduct(prod.id)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default AdminDetail;
    