import axios from "axios";

export default axios.create({
  baseURL: "https://exp.host/--/api/v2/push/send",
});
