// import { useEffect, useState } from "react";
// import "./AdminCategory.css";

// function AdminCategory() {
//   const [categories, setCategories] = useState([]);
//   const [name, setName] = useState("");
//   const [image, setImage] = useState("");
//   const [parentId, setParentId] = useState(""); 
//   const [editId, setEditId] = useState(null);

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:5000/admin/categories");
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const saveCategory = async () => {
//     if (!name.trim() || !image.trim()) return;

//     const url = editId
//       ? `http://127.0.0.1:5000/admin/categories/${editId}`
//       : "http://127.0.0.1:5000/admin/categories";

//     const method = editId ? "PUT" : "POST";

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, image, parentId }),
//       });

//       if (res.ok) {
//         setName("");
//         setImage("");
//         setParentId(""); 
//         setEditId(null);
//         fetchCategories();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteCategory = async (id) => {
//     try {
//       const res = await fetch(
//         `http://127.0.0.1:5000/admin/categories/${id}`,
//         { method: "DELETE" }
//       );
//       if (res.ok) fetchCategories();
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   const recoverCategory = async (id) => {
//     try {
//       const res = await fetch(
//         `http://127.0.0.1:5000/admin/categories/recover/${id}`,
//         { method: "PUT" }
//       );
//       if (res.ok) fetchCategories();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const permanentDeleteCategory = async (id) => {
//     try {
//       const res = await fetch(
//         `http://127.0.0.1:5000/admin/categories/permanent/${id}`,
//         { method: "DELETE" }
//       );
//       if (res.ok) fetchCategories();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const editCategory = (cat) => {
//     setEditId(cat.id);
//     setName(cat.name);
//     setImage(cat.image);
//     setParentId(cat.parentId || ""); 
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <div className="admin-category-container">
//       <h2>Manage Categories</h2>

// <div className="admin-category-form">
//   <input
//     list="category-list"
//     type="text"
//     placeholder="Category Name"
//     value={name}
//     onChange={(e) => setName(e.target.value)}
//   />
//   <datalist id="category-list">
//     {categories
//       .filter((c) => !c.deleted && c.id !== editId)
//       .map((c) => (
//         <option key={c.id} value={c.name} />
//       ))}
//   </datalist>

//   <input
//     type="text"
//     placeholder="Image URL"
//     value={image}
//     onChange={(e) => setImage(e.target.value)}
//   />

//   <button onClick={saveCategory}>
//     {editId ? "Update Category" : "Add Category"}
//   </button>

//   {editId && (
//     <button
//       className="cancel-btn"
//       onClick={() => {
//         setEditId(null);
//         setName("");
//         setImage("");
//       }}
//     >
//       Cancel
//     </button>
//   )}
// </div>

//       <ul className="admin-category-list">
//         {categories.map((cat) => (
//           <li key={cat.id} className={cat.deleted ? "deleted" : ""}>
//             <div className="cat-left">
//               <img
//                 src={cat.image}
//                 alt={cat.name}
//                 onError={(e) =>
//                   (e.target.src = "https://via.placeholder.com/40")
//                 }
//               />
//               <span>{cat.name}</span>
//               {cat.parentId && (
//                 <span className="parent-label">
//                   (Parent: {categories.find((c) => c.id === cat.parentId)?.name || "Deleted"})
//                 </span>
//               )}
//             </div>

//             <div className="cat-actions">
//               {!cat.deleted ? (
//                 <>
//                   <button onClick={() => editCategory(cat)}>Edit</button>
//                   <button onClick={() => deleteCategory(cat.id)}>Delete</button>
//                 </>
//               ) : (
//                 <>
//                   <button onClick={() => recoverCategory(cat.id)}>Recover</button>
//                   <button
//                     className="permanent-btn"
//                     onClick={() => permanentDeleteCategory(cat.id)}
//                   >
//                     Permanent Delete
//                   </button>
//                 </>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default AdminCategory;
import { useEffect, useState } from "react";
import "./AdminCategory.css";

function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [parentId, setParentId] = useState(""); 
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/admin/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveCategory = async () => {
    if (!name.trim() || !image.trim()) return;

    const url = editId
      ? `http://127.0.0.1:5000/admin/categories/${editId}`
      : "http://127.0.0.1:5000/admin/categories";

    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image, parentId }),
      });

      if (res.ok) {
        setName("");
        setImage("");
        setParentId(""); 
        setEditId(null);
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/admin/categories/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const recoverCategory = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/admin/categories/recover/${id}`,
        { method: "PUT" }
      );
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const permanentDeleteCategory = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/admin/categories/permanent/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const editCategory = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setImage(cat.image);
    setParentId(cat.parentId || ""); 
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="admin-category-container">
      <h2>Manage Categories</h2>

      <div className="admin-category-form">
        <input
          list="category-list"
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <datalist id="category-list">
          {categories
            .filter((c) => !c.deleted && c.id !== editId)
            .map((c) => (
              <option key={c.id} value={c.name} />
            ))}
        </datalist>

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button onClick={saveCategory}>
          {editId ? "Update Category" : "Add Category"}
        </button>

        {editId && (
          <button
            className="cancel-btn"
            onClick={() => {
              setEditId(null);
              setName("");
              setImage("");
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <ul className="admin-category-list">
        {categories.map((cat) => (
          <li key={cat.id} className={cat.deleted ? "deleted" : ""}>
            <div className="cat-left">
              <img
                src={cat.image}
                alt={cat.name}
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/40")
                }
              />
              <span>{cat.name}</span>
              {cat.parentId && (
                <span className="parent-label">
                  (Parent: {categories.find((c) => c.id === cat.parentId)?.name || "Deleted"})
                </span>
              )}
            </div>

            <div className="cat-actions">
              {!cat.deleted ? (
                <>
                  <button onClick={() => editCategory(cat)}>Edit</button>
                  <button onClick={() => deleteCategory(cat.id)}>Delete</button>
                </>
              ) : (
                <>
                  <button onClick={() => recoverCategory(cat.id)}>Recover</button>
                  <button
                    className="permanent-btn"
                    onClick={() => permanentDeleteCategory(cat.id)}
                  >
                    Permanent Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminCategory;
