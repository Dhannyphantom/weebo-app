import axios from "axios";
import baseURL from "./baseURL";

export default axios.create({
  baseURL: `${baseURL.uri}/post`,
  timeout: 10_000,
});
