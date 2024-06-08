import createDataContext from "./createDataContext";
import authApi from "../api/authApi";
import fetchApi from "../api/fetchApi";
import baseURL from "../api/baseURL";
// import expoNotify from "../api/expoNotification";
import followApi from "../api/followApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

let socket = io(baseURL.uri);

const authReducer = (state, action) => {
  switch (action.type) {
    case "update_settings":
      return {
        ...state,
        userSettings: action.payload,
      };
    case "update_profile":
      return {
        ...state,
        errMsg: "",
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };
    case "update_avatar":
      return {
        ...state,
        userInfo: action.payload,
      };
    case "update_me":
      if (Array.isArray(action.payload.data)) {
        let updateState = {};

        action.payload.data.forEach((body) => {
          updateState[body.prop] = updateState[body.data];
        });

        return {
          ...state,
          userInfo: {
            ...state.userInfo,
            ...updateState,
          },
        };
      }
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          [action.payload.prop]: action.payload.data,
        },
      };
    case "update_remove":
      const filtedData = state.userInfo[action.payload.prop].filter(
        (obj) => obj._id != action.payload.data
      );
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          [action.payload.prop]: filtedData,
        },
      };
    case "update_data":
      // checkKey | checkValue | prop | checkProp | data
      // self | array | object
      const updatedData = state.userInfo[action.payload.prop].map((obj) => {
        if (obj[action.payload.checkKey] == action.payload.checkValue) {
          return {
            ...obj,
            [action.payload.checkProp]: action.payload.data,
          };
        } else {
          return obj;
        }
      });

      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          [action.payload.prop]: updatedData,
        },
      };
    case "clear_error":
      return { ...state, errMsg: "" };
    case "update_token":
      return {
        ...state,
        token: action.payload.token ?? state.token,
        userInfo: action.payload.user ?? state.userInfo,
      };
    case "signin":
      return {
        ...state,
        token: action.payload.token,
        errMsg: "",
        userInfo: action.payload.user,
      };
    case "signout":
      return { ...state, token: null, errMsg: "", userInfo: {} };
    default:
      return state;
  }
};

const updateToken = (dispatch) => (data) => {
  dispatch({ type: "update_token", payload: data });
};

const signIn = (dispatch) => async (data, sc, cb) => {
  try {
    const response = await authApi.post("/login", data);
    await AsyncStorage.setItem("token", response.data);

    const user = await authApi.get("/me", {
      headers: {
        "x-auth-token": response.data,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
      timeout: 15000,
    });

    dispatch({
      type: "signin",
      payload: { token: response.data, user: user.data },
    });
    sc && sc();
  } catch (err) {
    cb && cb({ err, data: err?.response?.data, msg: "Error signing in!" });
  }
};

const authSignIn = (dispatch) => async (data, sc, cb) => {
  try {
    const response = await authApi.post("/auth", { user: data });
    await AsyncStorage.setItem("token", response.data);

    const user = await authApi.get("/me", {
      headers: {
        "x-auth-token": response.data,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
      timeout: 15000,
    });

    dispatch({
      type: "signin",
      payload: { token: response.data, user: user.data },
    });
    sc && sc();
  } catch (err) {
    cb &&
      cb({ err, data: err?.response?.data, msg: "Error trying to sign in" });
  }
};

const signUp = (dispatch) => async (data, sc, cb) => {
  try {
    const response = await authApi.post("/register", data);
    await AsyncStorage.setItem("token", response.data);
    const user = await authApi.get("/me", {
      headers: {
        "x-auth-token": response.data,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
      timeout: 15000,
    });

    dispatch({
      type: "signin",
      payload: { token: response.data, user: user.data },
    });
    sc && sc();
  } catch (err) {
    cb && cb({ data: err?.response?.data, msg: "Error signing up!", err });
  }
};

const getMyData = (dispatch) => async (sc, cb) => {
  const token = await AsyncStorage.getItem("token");

  try {
    const user = await authApi.get("/me", {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    sc && sc(user.data);
  } catch (err) {
    cb && cb(err?.response?.data);
  }
};

const tryLocalSignin =
  (dispatch) =>
  async (callback, errCb, type = "default") => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return errCb && errCb({ msg: "Please provide user token" });

    try {
      const user = await authApi.get("/me", {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
        timeout: 15000,
      });
      switch (type) {
        case "default":
          dispatch({ type: "signin", payload: { token, user: user.data } });
          break;
        case "user":
          dispatch({ type: "update_token", payload: { user: user.data } });
          break;
      }
      await AsyncStorage.setItem("userInfo", JSON.stringify(user.data));
      callback && callback(user.data);
    } catch (err) {
      if (err?.response?.data?.includes("Please sign in")) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userInfo");
        dispatch({ type: "signout" });
      }
      errCb &&
        errCb({
          err,
          data: err?.response?.data,
          msg: "Error fetching user data",
        });
    }
  };

const signOut = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("userInfo");
  dispatch({ type: "signout" });
};

const updateAvatar = (dispatch) => async (data, sc, cb, prog) => {
  const imageObject = {
    name: data.uri.slice(-40),
    fileName: data.uri.slice(-40),
    type: "image/jpg",
    uri: data.uri,
  };
  const formData = new FormData();
  formData.append("avatar", imageObject);
  const sendData = { ...data, bucket: "avatars" };
  delete sendData.uri;
  formData.append("data", JSON.stringify(sendData));

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await authApi.post("/updateAvatar", formData, {
      headers: {
        "x-auth-token": token,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      transformRequest: () => {
        return formData;
      },
    });

    dispatch({
      type: "update_me",
      payload: { data: res.data.avatar, prop: "avatar" },
    });
    sc && sc(data);
  } catch (err) {
    cb && cb({ err, msg: "Error updating your profile avatar" });
  }
};

const updateProfile = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await authApi.post("/update", data, {
      headers: {
        "x-auth-token": token,
      },
    });

    dispatch({ type: "update_profile", payload: response.data });
    sc && sc();
  } catch (err) {
    cb && cb({ err, msg: "Error updating profile", data: err?.response?.data });
  }
};

const fetchNearbyWeebs = (dispatch) => async (data, sc, cb) => {
  const { page, limit } = data;
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(
      `/nearby_weebs?page=${page}&limit=${limit}`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({
        err,
        msg: "Error connecting with weebs",
        data: err?.response?.data,
      });
  }
};

const updateUserData = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await authApi.put("/updateInstance", data, {
      headers: {
        "x-auth-token": token,
      },
    });
    dispatch({
      type: "update_me",
      payload: { data: res.data.data, prop: res.data.prop },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb("Error updating your profile.");
  }
};

const getUserData = (dispatch) => async (data, sc, cb) => {
  // HAVE CHANGED THE PARAMS FOR THIS FUNCTION SO UPDATE THIS ^^
  const { id, type, query, pagination } = data;

  let routeStr = `/userProfile/${id}/${type}?data=${query}`;

  if (Boolean(pagination)) {
    routeStr = `/userProfile/${id}/${type}?data=${query}&page=${pagination.page}&limit=${pagination.limit}`;
  }

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(routeStr, {
      headers: {
        "x-auth-token": token,
      },
      timeout: 15000,
    });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({ err, msg: "Error fetching user info", data: err?.response?.data });
  }
};

const collectionRequestHandler = (dispatch) => async (data, sc, cb) => {
  let ENDPOINT = "/request_collection";
  delete data.endpoint;
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await authApi.post(ENDPOINT, data, {
      headers: {
        "x-auth-token": token,
      },
      timeout: 15000,
    });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({ err, msg: "Error updating collection", data: err?.response?.data });
  }
};

const addWeeb = (dispatch) => async (data, sc, cb) => {
  // data = {id, type}
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.put("/addWeeb", data, {
      headers: {
        "x-auth-token": token,
      },
      timeout: 30000,
    });

    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error adding weeb!", data: err?.response?.data });
  }
};

const requestWeeb = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.post("/weeb_request", data, {
      headers: {
        "x-auth-token": token,
      },
    });

    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({ err, msg: "Error sending weeb request", data: err?.response?.data });
  }
};

const deleteUserAccount = (dispatch) => async (sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await authApi.delete("/user", {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({
        err,
        msg: "Error deleting user account",
        data: err?.response?.data,
      });
  }
};

const instanceTransfer = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.post(
      "/instanceTransfer",
      { data },
      {
        headers: {
          "x-auth-token": token,
        },
        timeout: 15000,
      }
    );
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err?.response?.data);
  }
};

const addToCollection =
  (dispatch) =>
  async (data, sc, cb, callDispatch = true) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await authApi.post("/add_to_collection", data, {
        headers: {
          "x-auth-token": token,
        },
        timeout: 30000,
      });
      callDispatch &&
        dispatch({
          type: "update_me",
          payload: { data: res.data, prop: "my_collections" },
        });
      sc && sc(res.data);
    } catch (err) {
      cb &&
        cb({
          err,
          msg: "Error updating collection",
          data: err?.response?.data,
        });
    }
  };

const deleteMediaItem = (dispatch) => async (data, sc, cb) => {
  // data = {id, itemId, type}
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await authApi.delete(
      `/collection_item?type=${data.type}&id=${data.id}&itemId=${data.itemId}&postId=${data.postId}`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );

    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error deleting media", data: err?.response?.data });
  }
};

const mailVerifier = (dispatch) => async (mailData, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await authApi.post("/verifyMail", mailData, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err?.response?.data);
  }
};

const readNotification = (dispatch) => async (notifyData, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    await authApi.post("/notifications", notifyData, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc();
  } catch (err) {
    cb &&
      cb({
        err,
        msg: "Error updating notification",
        data: err?.response?.data,
      });
  }
};

const wipeNotifications = (dispatch) => async (sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    await authApi.delete("/notifications", {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc();
  } catch (err) {
    cb &&
      cb({
        err,
        msg: "Error updating notification",
        data: err?.response?.data,
      });
  }
};

const resetPassword = (dispatch) => async (passData, sc, cb) => {
  try {
    await authApi.post("/resetPass", passData);
    sc && sc();
  } catch (err) {
    cb && cb(err?.response?.data);
  }
};

const recoverPassword = (dispatch) => async (passData, sc, cb) => {
  // passData =  {email: "mail", type: "password" || "verification"}
  try {
    const res = await authApi.post("/recoverPass", passData, {
      timeout: 10000,
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err?.response?.data);
  }
};

const setPushToken = (dispatch) => async (tokenData, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await authApi.post("/setToken", tokenData, {
      headers: {
        "x-auth-token": token,
      },
    });
    dispatch({
      type: "update_me",
      payload: { data: tokenData.token, prop: "pushToken" },
    });
    sc && sc();
  } catch (err) {
    cb && cb(err?.response?.data);
  }
};

const notificationSender = (dispatch) => async (data, sc, cb) => {
  //notifyObj = { to: EXPO_PUSH_TOKEN, sound, body,title, data }
  // const strObj = JSON.stringify(notifyObj);

  try {
    const token = await AsyncStorage.getItem("token");
    // const res = await expoNotify.post("/", strObj, {
    //   headers: {
    //     host: "exp.host",
    //     accept: "application/json",
    //     "Accept-encoding": "gzip,deflate",
    //     "Content-Type": "application/json",
    //   },
    // });
    const res = await authApi.post("/sendNotification", data, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err);
  }
};

const sendInvite = (dispatch) => async (userId, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await authApi.get(`/invite_weebs?identifier=${userId}`, {
      headers: { "x-auth-token": token },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Unable to send invite" });
  }
};

const updateCollection = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const headers = { "x-auth-token": token };

    let res;
    switch (data.type) {
      case "update":
        res = await authApi.put("/collection", data, {
          headers,
        });
        dispatch({
          type: "update_data",
          payload: {
            prop: "my_collections",
            data: res.data.name,
            checkValue: data.id,
            checkProp: "name",
            checkKey: "_id",
          },
        });
        break;
      case "share":
        res = await authApi.post("/collection", data, {
          headers,
        });
        break;
      case "delete":
        res = await authApi.delete(`/collection?collectionId=${data.id}`, {
          headers,
        });
        dispatch({
          type: "update_remove",
          payload: { prop: "my_collections", data: res.data.collectionId },
        });
        break;

      default:
        break;
    }

    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({ err, msg: "Error updating collection", data: err?.response?.data });
  }
};

// THIS WILL UPDATE THE USER STATE
const updateMe = (dispatch) => (data, prop) => {
  if (typeof data === "object") {
    dispatch({
      type: "update_me",
      payload: { data: data.data, prop: data.prop },
    });
  } else {
    dispatch({ type: "update_me", payload: { data, prop } });
  }
};

const clearMessage = (dispatch) => () => {
  dispatch({ type: "clear_error" });
};

/////// ------------ CHAT FUNCTIONS ------------------ /////////////////

const joinRoom = (dispatch) => (sender, recipient) => {
  // sender && recipient == IDs
  socket.emit("join", { sender, recipient });
};

const changeOnlineStatus =
  (dispatch) =>
  ({ userId, status }) => {
    // sender && recipient == IDs
    console.log({ userId });
    socket.emit("status", { userId, status });
  };

const sendMessage = (dispatch) => (data, sc, cb) => {
  try {
    socket.emit("message", data, (result) => {
      sc && sc(result);
    });
  } catch (err) {
    cb && cb(err);
  }
};

const checkRoom = (dispatch) => () => {
  socket.emit("check room");
};

const updateSettings = (dispatch) => (newSettings) => {
  dispatch({ type: "update_settings", payload: newSettings });
};

// THIS IS CHAT MESSAGES BTW THE USER AND RECIPIENT
const getChatMessages = (dispatch) => async (data, sc, cb) => {
  // senderId, recipientId,
  const { senderId, recipientId } = data;

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(
      `/getMessages/${senderId}/${recipientId}?page=${data.page}&limit=${data.limit}`,
      {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      }
    );
    AsyncStorage.setItem("chats", JSON.stringify(res.data));
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({
        msg: "Error retrieving your chats",
        data: err?.response?.data,
        err,
      });
  }
};

const getSocket = (dispatch) => () => {
  return socket;
};

export const { Context, Provider } = createDataContext(
  authReducer,
  {
    authSignIn,
    signIn,
    signOut,
    signUp,
    tryLocalSignin,
    addWeeb,
    instanceTransfer,
    addToCollection,
    clearMessage,
    updateToken,
    getUserData,
    changeOnlineStatus,
    requestWeeb,
    getMyData,
    readNotification,
    notificationSender,
    collectionRequestHandler,
    wipeNotifications,
    updateCollection,
    updateProfile,
    updateAvatar,
    updateUserData,
    updateMe,
    setPushToken,
    mailVerifier,
    deleteMediaItem,
    sendInvite,
    deleteUserAccount,
    fetchNearbyWeebs,
    resetPassword,
    recoverPassword,
    updateSettings,
    //chats
    getSocket,
    joinRoom,
    sendMessage,
    getChatMessages,
    checkRoom,
  },
  {
    token: null,
    errMsg: "",
    userInfo: {},
    userSettings: [],
    appLoader: () => null,
  }
);
