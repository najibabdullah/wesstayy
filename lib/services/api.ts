import axios from "axios";

const api = axios.create({
  baseURL: "https://jajal.rplrus.com/api",
  headers: {
    Accept: "application/json",
  },
});

export default api;
