import axios from "axios";

export default axios.create({
  baseURL: `http://192.168.43.236:5000/single`,
  timeout: 10_000,
});
