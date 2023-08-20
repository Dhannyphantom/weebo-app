import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../api/baseURL";
import fetchApi from "../api/fetchApi";
import postApi from "../api/postApi";
import followApi from "../api/followApi";
import grabApi from "../api/grabApi";

const feedReducer = (state, action) => {
  switch (action.type) {
    case "get_statuses":
      return { ...state, statuses: action.payload };
    case "update_posts":
      return {
        ...state,
        posts: state.posts + 1,
      };
    case "get_shows":
      return { ...state, shows: action.payload };

    default:
      return state;
  }
};

const updateInstance = (dispatch) => (data) => {
  getShows();
};

const getShows =
  (dispatch) =>
  async (type = "normal", sc, cb) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetchApi.get(`/myShows/${type}`, {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      });
      if (type == "normal")
        dispatch({ type: "get_shows", payload: response.data });
      sc && sc(response.data);
    } catch (err) {
      cb &&
        cb({
          err,
          msg: "Error fetching anime data",
          data: err?.response?.data,
        });
    }
  };

const getInstancePosts = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(
      `/instance_posts?instanceID=${data.id}&type=${data.type}&instance=${data.instance}`,
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
        msg: "Error fetching posts for this anime",
        data: err?.response?.data,
      });
  }
};

const getComments = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(
      `/comments/${data.instanceID}/${data.type}?page=${data.page}&limit=${data.limit}`,
      {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      }
    );
    sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error collecting comments" });
  }
};

const getMoreReplies = (dispatch) => async (data, sc, cb) => {
  const { instanceID, commentId, type } = data;
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(
      `/moreReplies/${instanceID}/${commentId}/${type}`,
      {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      }
    );
    sc(res.data);
  } catch (err) {
    cb && cb({ err, msg: "Error collecting comments" });
  }
};

const updatePosts = (dispatch) => () => {
  dispatch({ type: "update_posts" });
};

const filterInstances = (dispatch) => async (data, sc, cb) => {
  // data = {instance: str, filters = [{type, filter, info}]}
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await grabApi.get(
      `/filter_instances?instance=${data.instance}&filters=${JSON.stringify(
        data.filters
      )}`,
      {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      }
    );
    sc && sc(response.data);
  } catch (err) {
    cb &&
      cb({
        err,
        msg: "Error fetching instance data",
        data: err?.response?.data,
      });
  }
};
const getGroups = (dispatch) => async (sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetchApi.get("/groups", {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    sc && sc(response.data);
  } catch (err) {
    cb && cb("Error getting groups info ", err?.response?.data);
  }
};

const postPix = (dispatch) => async (data, sc, cb, up) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify({ ...data, bucket: "posts" }));
  for (let i = 0; i < data.post.length; i++) {
    const e = data.post[i].uri;
    const imageObject = {
      name: e.slice(-40),
      fileName: e.slice(-40),
      type: data.type === "image" ? "image/jpeg" : "video/mp4",
      uri: e,
    };
    formData.append("post", imageObject);
  }

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await postApi.post("/postMedia", formData, {
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
    cb
      ? cb({
          err,
          data: err?.response?.data,
          msg: "Error sending post to server",
        })
      : null;
  }

  // ======================================
};

const commentPost = (dispatch) => async (id, type, comment, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await followApi.post(
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
    dispatch({ type: "get_comments", payload: response.data });
    sc && sc(response.data);
  } catch (err) {
    dispatch({ type: "add_error", payload: err.response.data });
    cb && cb("Error updating comments");
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
    sc && sc(response.data);
  } catch (err) {
    // dispatch({ type: "add_error", payload: err?.response?.data });
    cb && cb({ err, msg: "Error replying user" });
  }
};

const addNewCollection = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await postApi.post("/new_collection", data, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb("Error saving new collection!");
  }
};

const viewPostVideo = (dispatch) => async (id, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    await followApi.put(
      "/viewPost",
      { id },
      {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
        timeout: 8000,
      }
    );
  } catch (err) {
    cb && cb("Error updating this post");
  }
};

const likePost = (dispatch) => async (id, type, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    await followApi.post(
      `${type === "like" ? "like_post" : "unlike_post"}`,
      { id },
      {
        headers: {
          "x-auth-token": token,
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      }
    );
  } catch (err) {
    dispatch({ type: "add_error", payload: err?.response?.data });
    cb && cb("Error liking this post");
  }
};

const editPostCaption = (dispatch) => async (pId, text, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    await postApi.put(
      "/editCap",
      { pId, text },
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
    cb && cb("Error updating post caption");
  }
};

const deletePosts = (dispatch) => async (pId, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    await postApi.delete(`/deletePost/${pId}`, {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    sc && sc();
  } catch (err) {
    cb && cb("Error trying to delete post! - " + err?.response?.data);
  }
};

const userFeedback = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.post(
      "/feedback",
      { data },
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

const followInstance = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.put("/followInstance", data, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err);
  }
};

const statusUploader = (dispatch) => async (data, sc, cb) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify({ ...data, bucket: "statuses" }));
  if (data.post.mime !== "text") {
    const imageObject = {
      name: data.post.uri.slice(-40),
      fileName: data.post.uri.slice(-40),
      type: data.post.type === "image" ? "image/jpeg" : "video/mp4",
      uri: data.post.uri,
    };
    formData.append("uploader", imageObject);
  }

  const token = await AsyncStorage.getItem("token");
  fetch(`${baseURL.uri}/post/status`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token,
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      sc && sc(data);
    })
    .catch((err) => cb && cb({ err, msg: "Error uploading story" }));
  // ======================================
};

const getStatuses = (dispatch) => async (sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get("/statuses", {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    // dispatch({ type: "get_statuses", payload: res.data });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err);
  }
};

const getCommentReplies = (dispatch) => async (data, sc, cb) => {
  const routeStr = `instanceID=${data.instanceID}&type=${data.type}&commentId=${data.commentId}&page=${data.page}&limit=${data.limit}`;
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(`/getReplies?${routeStr}`, {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    // dispatch({ type: "get_statuses", payload: res.data });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({ err, msg: "Error fetching reply data", data: err?.response?.data });
  }
};

// GETS HOME DATA [posts, statuses, shows, userInfo]
const getHomeFeeds = (_dispatch) => async (query, sc, cb) => {
  const uri = query
    ? `/homeData?limit=${query.limit}&page=${query.page}`
    : `/homeData?limit=15&page=1`;
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetchApi.get(uri, {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
      timeout: 15000,
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err);
  }
};

const viewStatus = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await followApi.put("/viewStatus", data, {
      headers: {
        "x-auth-token": token,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb && cb(err);
  }
};

const postReport = (dispatch) => async (data, sc, cb) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await postApi.post("report", data, {
      headers: {
        "x-auth-token": token,
        "Cache-Control": "no-cache,no-store,must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
    });
    sc && sc(res.data);
  } catch (err) {
    cb &&
      cb({ err, msg: "Error sending post report", data: err?.response?.data });
  }
};

export const { Provider, Context } = createDataContext(
  feedReducer,
  {
    getShows,
    getGroups,
    likePost,
    updatePosts,
    getStatuses,
    deletePosts,
    getInstancePosts,
    filterInstances,
    getMoreReplies,
    statusUploader,
    getHomeFeeds,
    postReport,
    editPostCaption,
    commentPost,
    getCommentReplies,
    getComments,
    viewPostVideo,
    followInstance,
    replyComments,
    addNewCollection,
    updateInstance,
    viewStatus,
    postPix,
    userFeedback,
  },
  { shows: [], posts: 0, statuses: [], challengeFeeds: [], uploadStatus: {} }
);

// uploadStatus = {posts: ""}
