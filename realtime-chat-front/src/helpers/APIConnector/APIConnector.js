import axios from "axios";

export default axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_BASE_API_URL
      : process.env.REACT_APP_DEV_BASE_API_URL,
});