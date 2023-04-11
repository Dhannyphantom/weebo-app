import axios from "axios";
import baseURL from "./baseURL";

export default axios.create({
  baseURL: `${baseURL.uri}/grab`,
  headers: {
    "Cache-Control": "no-cache,no-store,must-revalidate",
    Pragma: "no-cache",
    Expires: 0,
  },
  timeout: 10_000,
});
