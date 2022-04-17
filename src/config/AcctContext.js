import createDataContext from "../config/createDataContext";
import authApi from "../api/authApi";
import grabApi from "../api/grabApi";
import baseURL from "../api/baseURL";
import challengeApi from "../api/challengeApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const accountReducer = (state, action) => {
  switch (action.type) {
    case "get_search":
      return { ...state, searchResults: action.payload };
    default:
      return state;
  }
};

const searchStuffs = (dispatch) => async (data, sc, cb) => {
  const { term, type } = data;
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await grabApi.get(`/global/${term}/${type}`, {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb("Error trying to search data");
  }
};

/// events stuffs
const handleNewEvents = (dispatch) => async (data, sc, cb) => {
  const formData = new FormData();
  if (data.isMedia) {
    const imageObject = {
      name: data?.challengeInfo?.uri.slice(-40),
      fileName: data?.challengeInfo?.uri.slice(-40),
      type: data.c_type === "image" ? "image/jpeg" : "video/mp4",
      uri: data?.challengeInfo?.uri,
    };
    fd.append("uploader", imageObject);
  }
  fd.append("data", JSON.stringify(data));

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await challengeApi.post("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": token,
        Accept: "application/json",
      },
      transformRequest: () => formData,
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error uploading event data" });
  }
};

const handleJoinEvent = (dispatch) => async (data, sc, cb) => {
  const formData = new FormData();
  if (data.isMedia) {
    const imageObject = {
      name: data?.challengeInfo?.uri.slice(-40),
      fileName: data?.challengeInfo?.uri.slice(-40),
      type: data.c_type === "image" ? "image/jpeg" : "video/mp4",
      uri: data?.challengeInfo?.uri,
    };
    fd.append("uploader", imageObject);
  }
  fd.append("data", JSON.stringify(data));

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await challengeApi.post("/joinEvent", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": token,
        Accept: "application/json",
      },
      transformRequest: () => formData,
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Sorry, could not join event" });
  }

  // =====================================================================
};

export const { Context, Provider } = createDataContext(
  accountReducer,
  { searchStuffs, handleNewEvents, handleJoinEvent },
  { searchResults: [] }
);
