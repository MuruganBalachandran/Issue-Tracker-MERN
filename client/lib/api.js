// region imports
import axios from "axios";
// endregion

// region create axios instances
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, //  to send cookies
});
// endregion

// region export
export default api;
// endregion