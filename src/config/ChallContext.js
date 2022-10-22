import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../api/baseURL";
import challengeApi from "../api/challengeApi";
import followApi from "../api/followApi";
import fetchApi from "../api/fetchApi";
const challengeReducer = (state, action) => {
  switch (action.type) {
    case "getChallenges":
      return { ...state, challenges: action.payload };
    case "getAwards":
      return { ...state, awards: action.payload };
    case "add_newChallenge":
      return { ...state, challenges: [...state.challenges, action.payload] };
    case "get_comments":
      return { ...state, cComments: action.payload };
    case "getC_Two":
      return { ...state, cTwo: action.payload };
    default:
      return state;
  }
};

/// CHARACTER-CHARACTER CHALLENGE
const charChallenge = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await challengeApi.post("/characters", data, {
      headers: {
        "x-auth-token": token,
      },
    });
    // dispatch({ type: "add_newChallenge", payload: response.data });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err.message);
  }
};

const startInstanceChallenge = (dispatch) => async (data, sc, cb) => {
  const formData = new FormData();
  if (data.isMedia) {
    const imageObject = {
      name: data?.media?.uri.slice(-40),
      fileName: data?.media?.uri.slice(-40),
      type: data?.type === "image" ? "image/jpeg" : "video/mp4",
      uri: data?.media?.uri,
    };
    formData.append("media", imageObject);
  }

  formData.append("data", JSON.stringify({ ...data, bucket: "challenges" }));

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await challengeApi.post("/instance", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": token,
        Accept: "application/json",
      },
      transformRequest: () => formData,
    });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({
        err,
        msg: "Error sending challenge data",
        data: err?.response?.data,
      });
  }
  // ========================================================================
};
const acceptInstanceChallenge = (dispatch) => async (data, sc, cb) => {
  const formData = new FormData();
  if (data.isMedia) {
    const imageObject = {
      name: data?.media?.uri.slice(-40),
      fileName: data?.media?.uri.slice(-40),
      type: data?.type === "image" ? "image/jpeg" : "video/mp4",
      uri: data?.media?.uri,
    };
    formData.append("media", imageObject);
  }

  formData.append("data", JSON.stringify({ ...data, bucket: "challenges" }));

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await challengeApi.post("/accept_instance", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": token,
        Accept: "application/json",
      },
      transformRequest: () => formData,
    });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({
        err,
        msg: "Error sending challenge data",
        data: err?.response?.data,
      });
  }
  // ===================================================
};

const voteOne = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await challengeApi.put(
      "/voteOne",
      data, // should be an object
      {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      }
    );
    sc && sc();
  } catch (err) {
    cb && cb("Error updating vote!" + err?.response?.data);
  }
};
const voteTwo = (dispatch) => async (voteId, type, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await challengeApi.put(
      "/voteTwo",
      { voteId, type },
      {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      }
    );
    cb && response.data !== "ok" && cb("Error updating vote!");
  } catch (err) {
    cb && cb("Error updating vote!");
  }
};

const getAwards = (dispatch) => async (sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetchApi.get("/getAwards", {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    dispatch({ type: "getAwards", payload: response.data });
    sc && sc(response.data);
  } catch (err) {
    console.log(err);
    cb && cb("Error getting challenges info!");
  }
};
const getChallenges = (dispatch) => async (sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetchApi.get("/getChallenges", {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    dispatch({ type: "getChallenges", payload: response.data });
    sc && sc(response.data);
  } catch (err) {
    console.log(err?.response?.data);
    cb && cb("Error getting challenges info!");
  }
};
const getMyChallenges = (dispatch) => async (sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetchApi.get("/getMyChallenges", {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    sc && sc(response.data);
  } catch (err) {
    cb && cb({ err, msg: "Error getting challenges info!" });
  }
};

const withdrawChallenge = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await challengeApi.post("/withdrawChallenge", data, {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err?.response?.data);
  }
};

const getComments = (dispatch) => async (instanceID, type, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(`/comments/${instanceID}/${type}`, {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error collecting comments" });
  }
};

// TODO:: SEND IMAGES ALSO IN COMMENTS
const commentPost = (dispatch) => async (id, type, comment, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.post(
      "/comment",
      { id, comment, type },
      {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      }
    );
    dispatch({ type: "get_comments", payload: res.data });
    sc && sc(res.data);
  } catch (err) {
    dispatch({ type: "add_error", payload: err.response.data });
    cb("Error updating comment");
  }
};

const replyComments = (dispatch) => async (pId, type, cId, reply, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await followApi.post(
      "/reply",
      { pId, cId, reply, type },
      {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      }
    );
    dispatch({ type: "get_comments", payload: response.data });
    sc && sc();
  } catch (err) {
    // dispatch({ type: "add_error", payload: err.response.data });
    cb && cb("Error replying user");
  }
};

export const { Context, Provider } = createDataContext(
  challengeReducer,
  {
    charChallenge,
    startInstanceChallenge,
    acceptInstanceChallenge,
    // startInfoChallenge,
    // startChallengeTwoB,
    withdrawChallenge,
    getMyChallenges,
    getChallenges,
    getAwards,
    getComments,
    commentPost,
    replyComments,
    voteOne,
    voteTwo,
  },
  { challenges: [], cComments: [], awards: [] }
);
