import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as CharContext } from "../config/CharContext";
import { Context as ChallContext } from "../config/ChallContext";

import ThemeContext from "../config/ThemeContext";
import ActivityIndicator from "./ActivityIndicator";
import AppButton from "./AppButton";
import AppText from "./AppText";
import Link from "./Link";
import PopDropDown from "./PopDropDown";
import PostVideo from "./PostVideo";
import Separator from "./Separator";
import colors from "../constants/colors";
import PopMessage from "./PopMessage";
import AppPickerItem from "./AppPickerItem";
import { AddPropInfoFieldNonFormik } from "./CreateFormArray";
import {
  challenger_info_lookup,
  characterRoles,
  characterTypes,
  showGenres,
  subGenres,
} from "../constants/data_store";
import getFormatTime from "../constants/getFormatTime";
import { DisplayInstance } from "./SearchInstance";
import { capFirstLetter, launchGallery } from "../constants/helpers";

const { width, height } = Dimensions.get("screen");

const dateTimerProps = ["birthday", "releaseDate", "endDate"];

const Challenger = ({
  data,
  setLoading,
  fetchInstance,
  parentError,
  asset,
  setAsset,
  setter,
}) => {
  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
    updateMe,
  } = useContext(AuthContext);
  const { startInstanceChallenge, acceptInstanceChallenge } =
    useContext(ChallContext);

  const [popper, setPopper] = useState({ vis: false });
  const [errMsg, setErrMsg] = useState(null);

  const type = data?.contest?.type;

  const isManager = data.owner._id === userInfo._id;

  const handleChallenge = () => {
    if (!data.isFollowing) {
      return setPopper({
        vis: true,
        msg: "Please follow instance",
        type: "failed",
      });
    }

    if (!asset || asset === null || !asset?.type) {
      return setPopper({
        vis: true,
        msg: "Provide your challenge media or info",
        type: "failed",
      });
    }
    setLoading(true);
    parentError.setErrMsg(null);
    let info_data = null;
    const isMedia = asset.type !== "info";
    if (!isMedia) {
      info_data = asset.data.filter((obj) => obj.selected);
    }

    const sendData = {
      isMedia: asset.type === "info" ? false : true,
      media: isMedia
        ? {
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
            type: asset.type,
            durationMillis: asset.duration,
          }
        : null,
      data: info_data,
      instance: data.instance,
      instanceID: data.id,
      type: asset.type,
    };

    startInstanceChallenge(
      sendData,
      (resData) => {
        setAsset(null);
        setLoading(false);
        fetchInstance("cover", null, {
          msg: "Instance challenged!",
          type: "success",
        });
        updateMe(resData.points, "points");
        setter();
      },
      (errData) => {
        parentError.setErrMsg(errData?.data?.err ?? errData.msg);
        setLoading(false);
      }
    );
  };

  const handleAccept = () => {
    if (!asset || asset === null || !asset?.type) {
      return setPopper({
        vis: true,
        msg: "Provide your challenge media or info",
        type: "failed",
      });
    }
    setLoading(true);
    const isMedia = asset.type !== "info_accept" && asset.type !== "info";

    // VALIDATION
    if (type !== asset.type.replace("_accept", "")) {
      setPopper({
        vis: true,
        msg: "Choose a challenge mode",
        type: "failed",
      });
      setLoading(false);
      return;
    }

    const sendData = {
      isMedia,
      media: isMedia
        ? {
            uri: asset?.uri,
            width: asset?.width,
            height: asset?.height,
            type: asset?.type,
            durationMillis: asset?.duration,
          }
        : null,
      contest: {
        user: data?.contest?.user?._id,
        challengerId: data?.contest?._id,
      },
      mediaInfoPath: "media",
      instance: data.instance,
      instanceID: data.id,
      type: asset.type,
    };

    acceptInstanceChallenge(
      sendData,
      (_resData) => {
        setAsset(null);
        setLoading(false);
        fetchInstance("cover", null, {
          msg: "Challenge accepted!",
          type: "success",
        });
        setter();
      },
      (errData) => {
        setErrMsg(errData?.data ?? errData.msg);
        setLoading(false);
      }
    );
  };

  const initializeChallenge = async (type) => {
    switch (type) {
      case "image":
        const { results } = await launchGallery("image", true, false);
        results && setAsset(results[0]);

        break;
      case "video":
        const { _error, results: videos } = await launchGallery(
          "video",
          false,
          false,
          null,
          60
        );
        if (_error) {
          setErrMsg(_error);
        } else {
          setAsset(videos[0]);
        }
        break;
      case "info":
        setAsset({ type: "info" });
        break;
      default:
        break;
    }
  };

  const acceptChallenge = async (type) => {
    // to accept a challenge
    // challengerId, userId and challengeData is needed

    switch (type) {
      case "info":
        setAsset({ type: "info_accept", data: "info" });
        break;
      case "image":
        const { results } = await launchGallery("image", true, false);
        results && setAsset(results[0]);
        break;
      case "video":
        const { _error, results: videos } = await launchGallery(
          "video",
          false,
          false,
          null,
          60
        );
        if (_error) {
          setErrMsg(_error);
        } else {
          setAsset(videos[0]);
        }
        break;

      default:
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppText style={styles.title}>
        A chance to become an Instance Manager
      </AppText>
      {errMsg && <AppText style={styles.error}> {errMsg} </AppText>}
      {parentError?.errMsg && (
        <AppText style={styles.error}> {parentError?.errMsg} </AppText>
      )}
      {!isManager ? (
        <View style={styles.links}>
          <View style={styles.row}>
            <Link
              style={styles.linkShort}
              name="Image"
              iconName="image-multiple"
              onPress={() => initializeChallenge("image")}
            />
            <Link
              style={styles.linkShort}
              name="Video"
              iconName="video"
              onPress={() => initializeChallenge("video")}
            />
          </View>
          <Link
            style={styles.link}
            name="Invalid information"
            iconName="information-variant"
            onPress={() => initializeChallenge("info")}
          />
        </View>
      ) : (
        <>
          {type === "info" && (
            <Link
              style={styles.link}
              name="Invalid information"
              iconName="information-variant"
              onPress={() => acceptChallenge("info")}
            />
          )}
          {type === "image" && (
            <Link
              style={styles.link}
              name="Image"
              iconName="image-multiple"
              onPress={() => acceptChallenge("image")}
            />
          )}
          {type === "video" && (
            <Link
              style={styles.link}
              name="Video"
              iconName="video"
              onPress={() => acceptChallenge("video")}
            />
          )}
        </>
      )}
      <View style={styles.row}>
        {!isManager ? (
          <AppButton
            title="Challenge"
            onPress={handleChallenge}
            bare
            style={styles.btn}
          />
        ) : (
          <AppButton
            title="Accept"
            onPress={handleAccept}
            bare
            style={styles.btn}
          />
        )}
        <AppButton
          title="Cancel"
          bare
          bareRed
          onPress={() => {
            setAsset(null);
            setter();
          }}
          style={styles.btn}
          LIcon="cancel"
        />
      </View>
      <ActivityIndicator visible={false} style={styles.activity} />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
    </View>
  );
};

const InfoDropDown = ({ modal, setModal, item: data, onPress }) => {
  // item = {title, menu: []}
  const [actions, setActions] = useState({ modal: "open" });

  const closeModal = () => {
    return actions.modal;
  };

  let dropMenu = [];
  switch (data.key) {
    case "genres":
      dropMenu = showGenres;
      break;
    case "subGenres":
      dropMenu = subGenres;
      break;
    case "type":
      dropMenu = characterTypes;
      break;
    case "role":
      dropMenu = characterRoles;
      break;
    default:
      break;
  }

  return (
    <PopDropDown
      setter={() => setModal({ ...modal, dropdown: false })}
      visible={modal.dropdown}
      headerTitle={`Instance ${data.title}`}
      closer={closeModal}
      RenderComponent={() => (
        <View style={styles.modalContainer}>
          <FlatList
            data={dropMenu}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 15 }}
            renderItem={({ item }) => (
              <AppPickerItem
                text={item.title}
                desc={item.discription}
                example={item.example}
                onPress={() => {
                  onPress(item.title);
                  setActions({ modal: "close" });
                }}
              />
            )}
            numColumns={3}
            listKey="dropDown"
          />
        </View>
      )}
    />
  );
};

const InfoDatetime = ({ modal, item, setModal, onPress }) => {
  if (!modal.datetime) return null;

  const [date, setDate] = useState(
    dateTimerProps.includes(item.key)
      ? new Date(item.value)
      : new Date("January 1, 2000")
  );

  const timerType = ["endDate", "releaseDate"].includes(item.key)
    ? "month_year"
    : "month_day";

  const handleDate = (e, selectedDate) => {
    if (e.type !== "dismissed") {
      const timer = getFormatTime(selectedDate, null, timerType);
      const new_date = timer.ongoing ? "Currently airing" : timer.date;

      setDate(selectedDate);
      setModal({ ...modal, datetime: false });
      onPress(new_date);
    }
  };

  return (
    <>
      {modal.datetime && (
        <DateTimePicker
          value={date}
          textColor={colors.primary}
          display="default"
          mode="date"
          onChange={handleDate}
        />
      )}
    </>
  );
};

const InfoProps = ({ item, state }) => {
  const theme = useContext(ThemeContext);

  const timerType = ["endDate", "releaseDate"].includes(item.key)
    ? "month_year"
    : "month_day";
  const isMoreInfo = ["affiliations", "other_infos"].includes(item.key);

  const [selected, setSelected] = useState(item.selected);
  const [info, setInfo] = useState(
    dateTimerProps.includes(item.key)
      ? item.value.includes(" ")
        ? item.value
        : getFormatTime(item.value, null, timerType).date
      : isMoreInfo
      ? item.value
      : String(item.value)
  );

  const [modal, setModal] = useState(false); // will be modified for datetime picker also

  const shouldShowBtn = isMoreInfo
    ? info !== item.value
    : info !== String(item.value);
  const isDropDown = challenger_info_lookup.dropdown.includes(item.key);
  const isDatetime = challenger_info_lookup.datetime.includes(item.key);
  const isListItem = ["genres", "subGenres"].includes(item.key);
  const isCharactersList = item.key === "characters";

  const updateAssetArr = (arr) => {
    return arr.map((obj) => {
      if (obj.key === item.key) {
        return {
          ...obj,
          value: info,
          selected: true,
        };
      } else {
        return obj;
      }
    });
  };

  const saveChanges = () => {
    state.setAsset((prev) => {
      return {
        ...prev,
        data: prev?.data
          ? updateAssetArr(prev.data)
          : updateAssetArr(state.assetData),
      };
    });
  };

  const updateInfo = (val) => {
    if (isListItem) {
      if (val.startsWith("remove_")) {
        // remove str
        setInfo((prev) => {
          const strToRemove = val.slice(7).trim();
          const isFirstOccurance = prev.indexOf(strToRemove);
          const edited = prev.replace(
            isFirstOccurance === 0 ? `${strToRemove}, ` : `, ${strToRemove}`,
            ""
          );
          return edited;
        });
      } else {
        setInfo((prev) => prev.trim() + `, ${val}`);
      }
    } else {
      setInfo(val);
    }
  };

  const addCharacters = (val) => {
    if (val.startsWith("remove_")) {
      // remove str
      setInfo((prev) => {
        const strToRemove = val.slice(7).trim();
        const isFirstOccurance = prev.indexOf(strToRemove) === 0;
        const edited = prev.replace(
          isFirstOccurance ? "" : `, ${strToRemove}`,
          ""
        );
        return edited;
      });
    } else {
      setInfo((prev) => {
        const isFirstOccurance = prev.length < 1;
        return isFirstOccurance ? val : prev.trim() + `, ${val}`;
      });
    }
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelected(!selected)}
        style={[styles.info, { backgroundColor: theme.extralight }]}
      >
        <View style={styles.infoTitle}>
          <AppText style={{ maxWidth: "85%" }} size="large" bold>
            {capFirstLetter(item.title)}
          </AppText>
          <MaterialCommunityIcons
            name={selected ? "circle" : "circle-outline"}
            color={selected ? colors.primary : colors.medium}
            size={22}
          />
        </View>
      </TouchableOpacity>
      {selected && (
        <View>
          {isListItem ? (
            <View style={styles.infoListContainer}>
              <InfoList onPress={(val) => updateInfo(val)} value={info} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setModal({ dropdown: isDropDown, datetime: isDatetime })
                }
                style={{ padding: width * 0.05 }}
              >
                <MaterialCommunityIcons
                  name="plus-circle"
                  color={colors.primary}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          ) : isCharactersList ? (
            <View>
              <FlatList
                data={item.characters}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={() => {
                  return (
                    <View>
                      <AppText style={styles.pickerText}>
                        {item.characters[0]
                          ? "Pick characters that are not members of this group"
                          : "No character found"}
                      </AppText>
                    </View>
                  );
                }}
                renderItem={({ item }) => {
                  const isAdded = info.includes(item.name);
                  return (
                    <View
                      style={{ ...styles.rowWide, justifyContent: "center" }}
                    >
                      <DisplayInstance item={item} onPress={null} type="rect" />
                      <TouchableOpacity
                        onPress={() =>
                          addCharacters(
                            isAdded ? `remove_${item.name}` : item.name
                          )
                        }
                        activeOpacity={0.8}
                        style={{ marginLeft: 50 }}
                      >
                        {!isAdded && (
                          <MaterialCommunityIcons
                            size={30}
                            name="circle-outline"
                            color={colors.medium}
                          />
                        )}
                        {isAdded && (
                          <Feather
                            size={24}
                            name="check-circle"
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          ) : isMoreInfo ? (
            <View>
              <AddPropInfoFieldNonFormik
                dataState={{ fields: info, setFields: setInfo }}
                placeHolderTitle={item.title}
                name={item.key}
              />
            </View>
          ) : (
            <TouchableOpacity
              disabled={!isDropDown && !isDatetime}
              activeOpacity={0.95}
              onPress={() =>
                setModal({ dropdown: isDropDown, datetime: isDatetime })
              }
              style={[
                styles.inputContainer,
                { backgroundColor: theme.extralight },
              ]}
            >
              <TextInput
                placeholder={`Enter ${item.title}, seperate values using commas`}
                placeholderTextColor={colors.m}
                editable={!isDatetime && !isDropDown}
                onChangeText={(val) => setInfo(val)}
                value={info}
                style={[styles.input, { color: theme.color }]}
              />
            </TouchableOpacity>
          )}
          {shouldShowBtn && (
            <AppButton
              title="Save Changes"
              onPress={saveChanges}
              bare
              style={styles.infoSaveBtn}
            />
          )}
        </View>
      )}
      <InfoDropDown
        modal={modal}
        setModal={setModal}
        item={item}
        onPress={(val) => updateInfo(val)}
      />
      <InfoDatetime
        modal={modal}
        item={item}
        setModal={setModal}
        onPress={(val) => setInfo(val)}
      />
    </View>
  );
};

const InfoList = ({ value, onPress }) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={styles.infoList}>
      {value.split(",").map((str, idx) => {
        return (
          <View
            key={str + idx}
            style={[styles.infoListItem, { backgroundColor: theme.extralight }]}
          >
            <TouchableOpacity
              onPress={() => onPress(`remove_${str}`)}
              style={styles.infoListCloseBtn}
            >
              <MaterialCommunityIcons
                name="close"
                size={18}
                color={colors.medium}
              />
            </TouchableOpacity>
            <AppText size="large" bold>
              {str.trim()}
            </AppText>
          </View>
        );
      })}
    </View>
  );
};

const ChallengeMedia = ({ asset, loading: loader, data, setAsset }) => {
  const [loading, setLoading] = useState(false);
  const [assetData, setAssetData] = useState(asset?.data ?? []);
  const [showInfo, setShowInfo] = useState(false);

  const theme = useContext(ThemeContext);
  const { fetchInfoProperties } = useContext(CharContext);
  const topper = useSafeAreaInsets().top;

  const fetchInstanceInfo = async () => {
    if (asset && asset.type === "info") {
      if (Boolean(asset?.data)) {
        setAssetData(asset?.data);
        return;
      }

      setLoading(true);
      await fetchInfoProperties(
        { id: data.id, instance: data.instance },
        (resData) => {
          setAssetData(resData.data);
          setLoading(false);
        },
        (_errData) => {}
      );
    }
  };

  useEffect(() => {
    fetchInstanceInfo();
  }, []);

  return (
    <View
      style={[
        styles.media,
        { backgroundColor: theme.background, marginTop: topper },
      ]}
    >
      {asset && asset.type === "image" && (
        <Image style={styles.image} source={asset} />
      )}
      {asset && asset.type === "video" && (
        <PostVideo
          source={asset}
          style={styles.video}
          viewable={false}
          autoPlayer
          disableDoublePress
          disableLongPress
        />
      )}
      {asset && asset.type === "info" && (
        <>
          <View style={styles.rowWide}>
            <AppText style={{ ...styles.title }} size="large" bold>
              Select Invalid Info ({capFirstLetter(data?.name, true)}{" "}
              {capFirstLetter(data?.instance)})
            </AppText>
            <TouchableOpacity
              style={{ padding: 14 }}
              onPress={() => setShowInfo(!showInfo)}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={26}
                color={colors.medium}
              />
            </TouchableOpacity>
          </View>
          <Separator h={2} m={5} />
          {showInfo && (
            <>
              <AppText style={styles.title}>
                Choose and select info properties that you're sure are invalid
                or incomplete, and REMEMBER to save changes for each info
                updated!
              </AppText>
              <View style={[styles.row, styles.instance]}>
                <AppText
                  style={{ textTransform: "capitalize" }}
                  size="large"
                  bold
                >
                  {data?.name}{" "}
                </AppText>
                <AppText size="large" style={{ color: colors.primary }} bold>
                  {data.instance}
                </AppText>
              </View>
            </>
          )}
          <View style={{ flex: 1 }}>
            <FlatList
              data={assetData}
              extraData={asset}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingVertical: 15,
              }}
              keyExtractor={(item, index) => item.title + index}
              renderItem={({ item }) => (
                <InfoProps item={item} state={{ asset, setAsset, assetData }} />
              )}
            />
          </View>
        </>
      )}
      {asset && asset.type === "info_accept" && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AppText style={styles.emptyText} size="xlarge" bold>
            A weeb believes some of the information provided for this instance
            are not valid. {"\n\n"} Accept challenge now to prove them wrong
          </AppText>
        </View>
      )}
      {!asset && (
        <View style={styles.empty}>
          <Feather name="info" size={width * 0.3} color={colors.light} />
          <AppText bold size="large" style={styles.emptyText}>
            Please select your challenge mode. {"\n\n"} Choose a media that
            better suits this instance and let the weeb community decides who
            keeps this instance
          </AppText>
        </View>
      )}
      <ActivityIndicator
        visible={loading && asset && asset.type === "info"}
        style={styles.activity}
      />
      <ActivityIndicator
        visible={loader}
        style={styles.activity}
        wTransparent
      />
    </View>
  );
};

export default function InstanceChallenger({
  data,
  fetchInstance,
  visible,
  setter,
}) {
  const [actions, setActions] = useState({ modal: "open" });
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  const closeModal = () => {
    return actions.modal;
  };
  return (
    <PopDropDown
      visible={visible}
      disableCloseTouch
      setter={() => {
        setActions({ modal: "open" });
        setter && setter();
      }}
      closer={closeModal}
      RenderComponent={() => (
        <Challenger
          setter={() => setActions({ ...actions, modal: "close" })}
          setAsset={setAsset}
          setLoading={setLoading}
          asset={asset}
          parentError={{ errMsg, setErrMsg }}
          fetchInstance={fetchInstance}
          data={data}
        />
      )}
      TopperComponent={() => (
        <ChallengeMedia
          data={data}
          loading={loading}
          setAsset={setAsset}
          asset={asset}
        />
      )}
      headerTitle="Challenge By"
    />
  );
}

const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  btn: {
    marginHorizontal: 10,
    marginVertical: 15,
  },
  container: {
    minHeight: height * 0.1,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    width: "75%",
    textAlign: "center",
    lineHeight: 32,
  },
  error: {
    textAlign: "center",
    color: colors.heart,
    marginVertical: 8,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  info: {
    padding: 18,
    marginBottom: 15,
    marginHorizontal: 18,
    borderRadius: 10,
  },
  infoTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  instance: {
    marginBottom: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.medium,
    padding: 10,
  },
  inputContainer: {
    // width,
    minHeight: 55,
    marginHorizontal: 40,
    marginBottom: 10,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    textTransform: "capitalize",
    paddingLeft: 15,
  },
  infoSaveBtn: {
    marginBottom: 40,
    alignSelf: "center",
  },
  infoListContainer: {
    marginLeft: width * 0.05,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoList: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  infoListItem: {
    height: 50,
    paddingRight: 18,
    marginRight: 15,
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  infoListCloseBtn: {
    // height: "100%",
    paddingLeft: 15,
    paddingRight: 10,
  },
  links: {},
  link: {
    width: width * 0.8,
    alignSelf: "center",
  },
  linkShort: {
    width: width * 0.38,
    marginRight: 10,
  },
  media: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  modalContainer: {
    height: height * 0.75,
  },
  pickerText: {
    textAlign: "center",
    width: "85%",
    marginBottom: 8,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  rowWide: {
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 14,
  },
  title: {
    textAlign: "center",
    maxWidth: width * 0.85,
    alignSelf: "center",
    marginBottom: 8,
  },
  video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    marginVertical: 0,
  },
});
