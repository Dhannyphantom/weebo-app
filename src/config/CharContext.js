import createDataContext from "./createDataContext";
import instanceApi from "../api/instanceApi";
import grabApi from "../api/grabApi";
import channelApi from "../api/channelApi";
import followApi from "../api/followApi";
import fetchApi from "../api/fetchApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

//  ---------------- FOR CHARACTER ==- AND CHANNEL ----======================================

const characterReducer = (state, action) => {
  switch (action.type) {
    // case "prepare_state":
    //   return { errMsg: "", data: { prepare: true } };
    case "create_me":
      return { errMsg: "", data: action.payload };
    case "add_error":
      return { ...state, errMsg: action.payload };
    default:
      return state;
  }
};

const createCharacter = (dispatch) => async (data, sc, cb) => {
  const imageObject = {
    name: data?.cover_photo?.uri.slice(-40),
    fileName: data?.cover_photo?.uri.slice(-40),
    type: "image/jpeg",
    uri: data?.cover_photo?.uri,
  };
  const formData = new FormData();
  formData.append("uploader", imageObject);
  formData.append("data", JSON.stringify({ ...data, bucket: "characters" }));

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await instanceApi.post("/new_character", formData, {
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
      cb({ err, msg: "Error creating character", data: err?.response?.data });
  }

  // ===================================================
};

const createShow = (dispatch) => async (data, sc, cb) => {
  const imageObject = {
    name: data?.cover_photo?.uri.slice(-40),
    fileName: data?.cover_photo?.uri.slice(-40),
    type: "image/jpeg",
    uri: data?.cover_photo?.uri,
  };
  const formData = new FormData();
  formData.append("uploader", imageObject);
  formData.append("data", JSON.stringify({ ...data, bucket: "shows" }));

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await instanceApi.post("/show", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": token,
        Accept: "application/json",
      },
      transformRequest: () => formData,
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error creating show", data: err?.response?.data });
  }

  // ===================================================
};

const createGroup = (dispatch) => async (data, sc, cb) => {
  const imageObject = {
    name: data?.cover_photo?.uri.slice(-40),
    fileName: data?.cover_photo?.uri.slice(-40),
    type: "image/jpeg",
    uri: data?.cover_photo?.uri,
  };
  const formData = new FormData();
  formData.append("uploader", imageObject);
  formData.append("data", JSON.stringify({ ...data, bucket: "groups" }));

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await instanceApi.post("/group", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": token,
        Accept: "application/json",
      },
      transformRequest: () => formData,
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error creating group", data: err?.response?.data });
  }

  // ===================================================
};

// const prepareState = (dispatch) => () => {
//   dispatch({ type: "prepare_state" });
// };

const roomCharacters = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(
      `/getCharacters/${data.instance}/${data.instanceID}`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err);
  }
};

const getCharacters = (dispatch) => async (term, sc, cb) => {
  try {
    const response = await grabApi.get(`/characters/${term}`, {
      headers: {
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    sc && sc(response.data);
  } catch (err) {
    cb && cb(err?.response?.data);
  }
};

const getTheCharacter = (dispatch) => async (id, sc, cb) => {
  try {
    const res = await fetchApi.get(`/singleCharacter/${id}`, {
      headers: {
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    dispatch({ type: "single_character", payload: res.data });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error collecting character information" });
  }
};

const followChar = (dispatch) => async (data, sc, cb) => {
  let route = "";
  switch (data.route) {
    case "follow":
      route = "followChar";
      break;

    case "unfollow":
      route = "unfollowChar";
      break;

    case "favorite":
      route = "favorite";
      break;
  }
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.put(`/${route}`, data, {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error updating character" });
  }
};

const sendInvite = () => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.put("/character_invite", data, {
      headers: {
        "x-auth-token": token,
      },
      timeout: 10000,
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err?.response?.data);
  }
};

const inviteActions = () => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.put("/invite_actions", data, {
      headers: {
        "x-auth-token": token,
      },
      timeout: 10000,
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err?.response?.data);
  }
};

const deleteInstance = () => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.delete(
      `/delete_instance/${JSON.stringify(data)}`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    sc && sc(res.data);
  } catch (err) {
    cb && cb("Error trying to delete instance " + err?.response?.data);
  }
};

const instanceUpdater = (dispatch) => async (data, sc, cb) => {
  let requestObj = {};

  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({ ...data, bucket: `${data.instance}s` })
  );
  if (data.media) {
    const imageObject = {
      name: data?.actionData?.uri.slice(-40),
      fileName: data?.actionData?.uri.slice(-40),
      type: data?.actionData?.type === "image" ? "image/jpeg" : "video/mp4",
      uri: data?.actionData?.uri,
    };
    formData.append("uploader", imageObject);
    requestObj = {
      transformRequest: () => {
        return formData;
      },
    };
  }
  const contentType = data.media ? "multipart/form-data" : "application/json";

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await instanceApi.put("/updateInstance", formData, {
      headers: {
        "x-auth-token": token,
        Accept: "application/json",
        "Content-Type": contentType,
      },
      // transformRequest: () => formData,
      ...requestObj,
    });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({
        err,
        msg: "Error updating instance",
        data: err?.response?.data,
      });
  }
};

/// ---------------  CHANNELS ========================================

const createChannel = (dispatch) => async (data, sc, cb) => {
  const imageObject = {
    name: data?.cover_photo?.uri.slice(-40),
    fileName: data?.cover_photo?.uri.slice(-40),
    type: "image/jpeg",
    uri: data?.cover_photo?.uri,
  };
  const formData = new FormData();
  formData.append("uploader", imageObject);
  formData.append("data", JSON.stringify({ ...data, bucket: "channels" }));

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await channelApi.post("/createChannel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": token,
        Accept: "application/json",
      },
      transformRequest: () => formData,
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error creating channel", data: err?.response?.data });
  }
  // ==========================================
};

const getChannels = (dispatch) => async (sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get("/channels", {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({
        msg: "Error fetching channels info",
        data: err?.response?.data,
        err,
      });
  }
};

const subscribeChannel = (dispatch) => async (type, id, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await channelApi.put(
      "/subscribe",
      { id, type },
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    sc && sc(res.data);
  } catch (err) {
    cb && cb("Error updating channel");
  }
};

const getAChannel = (dispatch) => async (data, sc, cb) => {
  const { id, page, limit } = data;
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(
      `/getChannel/${id}?page=${page}&limit=${limit}`,
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
        msg: "Error fetching channels info",
        data: err?.response?.data,
        err,
      });
  }
};

const fetchInfoProperties = (dispatch) => async (data, sc, cb) => {
  const { id, instance } = data;
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(`/info?id=${id}&instance=${instance}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({
        err,
        msg: "Error fetching channels info",
        data: err?.response?.data,
      });
  }
};

const fetchGroupProperty = () => async (data, sc, cb) => {
  const { id, prop } = data;
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(`/group_data?id=${id}&prop=${prop}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({
        err,
        msg: "Error fetching group data",
        data: err?.response?.data,
      });
  }
};

const searchChannels = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await grabApi.get(`/global/${data.term}/${data.type}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error fetching channels" });
  }
};

const deleteChannel = (dispatch) => async (channelId, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await channelApi.delete(`/channel?id=${channelId}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error deleting channel data" });
  }
};

const updateChannel = (dispatch) => async (data, sc, cb) => {
  const formData = new FormData();
  if (data.media) {
    const imageObject = {
      name: data.actionData?.uri.slice(-40),
      fileName: data.actionData?.uri.slice(-40),
      type: "image/jpeg",
      uri: data.actionData?.uri,
    };
    formData.append("uploader", imageObject);
  }
  formData.append("data", JSON.stringify({ ...data, bucket: "channels" }));

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await channelApi.post("/updateChannel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": token,
        Accept: "application/json",
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
      transformRequest: () => formData,
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error updating channel info" });
  }
  // ==========================================
};

export const { Context, Provider } = createDataContext(
  characterReducer,
  {
    createCharacter,
    createGroup,
    getCharacters,
    getTheCharacter,
    // prepareState,
    createShow,
    instanceUpdater,
    roomCharacters,
    followChar,
    fetchGroupProperty,
    fetchInfoProperties,
    deleteInstance,
    inviteActions,
    sendInvite,
    // CHANNELS
    createChannel,
    getChannels,
    subscribeChannel,
    searchChannels,
    updateChannel,
    deleteChannel,
    getAChannel,
  },
  { errMsg: "", data: {}, s_character: [] }
);
