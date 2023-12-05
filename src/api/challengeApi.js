import axios from "axios";
import baseURL from "./baseURL";

export default axios.create({
  baseURL: `${baseURL.uri}/challenge`,
  timeout: 10000,
});
