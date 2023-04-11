import axios from "axios";
import baseURL from "./baseURL";

export default axios.create({
  baseURL: `${baseURL.uri}/follow`,
  timeout: 10_000,
});
