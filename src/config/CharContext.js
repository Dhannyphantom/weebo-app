import createDataContext from "./createDataContext";
import instanceApi from "../api/instanceApi";
import grabApi from "../api/grabApi";
import baseURL from "../api/baseURL";
import channelApi from "../api/channelApi";
import followApi from "../api/followApi";
import fetchApi from "../api/fetchApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

//  ---------------- FOR CHARACTER ==- AND CHANNEL ----======================================

const characterReducer = (state, action) => {
  switch (action.type) {
    case "prepare_state":
      return { errMsg: "", data: { prepare: true } };
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

  const token = await AsyncStorage.getItem("token");

  fetch(`${baseURL.uri}/create/new_character`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token,
      "Cache-Control": "no-cache,no-store,must-revalidate",
      Pragma: "no-cache",
      Expires: 0,
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      sc && sc(data);
    })
    .catch((err) => {
      // err.response.data.match(/Cast to Objectid/gi)
      cb && cb({ err, msg: "Error creating character" });
    });

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

  const token = await AsyncStorage.getItem("token");

  fetch(`${baseURL.uri}/create/group`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token,
      "Cache-Control": "no-cache,no-store,must-revalidate",
      Pragma: "no-cache",
      Expires: 0,
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((resData) => {
      dispatch({ type: "create_me", payload: resData.data.group });
      sc && sc(resData);
    })
    .catch((err) => {
      // err.response.data.match(/Cast to Objectid/gi)
      // dispatch({ type: "add_error", payload: err?.response?.data });
      cb && cb({ err, msg: "Error creating group" });
    });

  // ===================================================
};
const prepareState = (dispatch) => () => {
  dispatch({ type: "prepare_state" });
};

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

const followChar = (dispatch) => async (data, type, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const headers = {
      "x-auth-token": token,
    };
    if (type === "follow") {
      await followApi.put("/followChar", data, {
        headers,
      });
      if (sc) sc();
    } else if (type === "unfollow") {
      await followApi.put("/unfollowChar", data, {
        headers,
      });
      if (sc) sc();
    } else if (type === "favorite") {
      await followApi.put("/favorite", data, {
        headers,
      });
    }
  } catch (err) {
    cb && cb("Error updating character" + err?.response?.data);
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
  let router,
    requestObj = {};

  switch (data.instance) {
    case "character":
      router = "updateCharacterInstance";
      break;
    case "show":
      router = "updateShowInstance";
      break;
    case "group":
      router = "updateGroupInstance";
      break;
  }
  //
  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({ ...data, bucket: `${data.instance}s` })
  );
  if (data.media) {
    const imageObject = {
      name: data?.actionData?.uri.slice(-40),
      fileName: data?.actionData?.uri.slice(-40),
      type: data.c_type === "image" ? "image/jpeg" : "video/mp4",
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
    const res = await instanceApi.put(
      `${baseURL.uri}/create/${router}`,
      formData,
      {
        headers: {
          "x-auth-token": token,
          Accept: "application/json",
          "Content-Type": contentType,
        },
        ...requestObj,
      }
    );
    sc && sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error updating instance info" });
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
    cb && cb({ err, msg: "Error creating channel" });
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
    console.log(err);
    cb && cb("Error getting channels info");
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

const getAChannel = (dispatch) => async (id, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(`/getChannel/${id}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    console.log(err);
    cb && cb("Error getting channels info");
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
    prepareState,
    createShow,
    instanceUpdater,
    roomCharacters,
    followChar,
    deleteInstance,
    inviteActions,
    sendInvite,
    // CHANNELS
    createChannel,
    getChannels,
    subscribeChannel,
    searchChannels,
    updateChannel,
    getAChannel,
  },
  { errMsg: "", data: {}, s_character: [] }
);
