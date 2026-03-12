// // Frontend config for Render live backend
// const BASE_URL = import.meta.env.VITE_BASE_URL || "https://my-backend-93up.onrender.com";
// export default BASE_URL;

// const BASE_URL = "http://127.0.0.1:5000"; // Local backend
// export default BASE_URL;
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BASE_URL = isLocal
  ? "http://127.0.0.1:5000"
  : "https://my-backend-93up.onrender.com";

export default BASE_URL;

// const BASE_URL = import.meta.env.VITE_BASE_URL;
// export default BASE_URL;

// const BASE_URL = "https://my-backend-93up.onrender.com";

// export default BASE_URL;