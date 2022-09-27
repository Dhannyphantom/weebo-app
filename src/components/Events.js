import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import getFormatTime from "../constants/getFormatTime";
import * as ImagePicker from "expo-image-picker";
import { setStatusBarStyle } from "expo-status-bar";

import { Context as AcctContext } from "../config/AcctContext";
import { Context as AuthContext } from "../config/AuthContext";

import colors from "../constants/colors";
import AppText from "./AppText";
import SelectNumber from "./SelectNumber";
import GrowInput from "./GrowInput";
import AppButton from "./AppButton";
import PopMessage from "./PopMessage";
import PostVideo from "./PostVideo";
import ActivityIndicator from "./ActivityIndicator";
import vidMaxChecker from "../constants/vidMaxChecker";
import ThemeContext from "../config/ThemeContext";
import Screen from "./Screen";

const { width, height } = Dimensions.get("window");

const eventTypeArr = [
  {
    id: "1",
    name: "Image",
    selected: true,
  },
  {
    id: "2",
    name: "Video",
    selected: false,
  },
  {
    id: "3",
    name: "Text",
    selected: false,
  },
];

const INITIAL_DATE = new Date(Date.now() + 1000 * 60 * 60);

const Events = ({ closer, instance, instanceID }) => {
  const { handleNewEvents } = useContext(AcctContext);
  const { updateMe } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const [type, setType] = useState(eventTypeArr);
  const [asset, setAsset] = useState(null);
  const [title, setTitle] = useState("");
  const [isInput, setIsInput] = useState(false);
  const [input, setInput] = useState("");
  const [number, setNumber] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [popper, setPopper] = useState({ vis: false });
  const [errMsg, setErrMsg] = useState(null);
  //
  const [date, setDate] = useState(INITIAL_DATE);
  const [mode, setMode] = useState("date");
  const [showDate, setShowDate] = useState(false);

  const finder = type.find((obj) => obj.selected === true);
  const isVid = finder.name === "Video";
  const isImage = finder.name === "Image";
  const isText = finder.name === "Text";
  const cpCalculator = Math.round(number * (number / 6));
  let mediaBtnTitle;
  if (!asset && isImage) {
    mediaBtnTitle = "Add Image";
  } else if (!asset && isVid) {
    mediaBtnTitle = "Add Video";
  } else if (asset && isImage && asset.type === "image") {
    mediaBtnTitle = "Change Image";
  } else if (asset && isVid && asset.type === "video") {
    mediaBtnTitle = "Change Video";
  } else if (asset && asset.type === "image" && isVid) {
    mediaBtnTitle = "Add Video";
  } else if (asset && asset.type === "video" && isImage) {
    mediaBtnTitle = "Add Image";
  }

  const handleChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (selectedDate < INITIAL_DATE)
      return setPopper({
        type: "failed",
        msg: "Invalid time and date selected",
        vis: true,
      });
    setShowDate(false);
    setDate(currentDate);
  };

  const handleTime = (type) => {
    setMode(type);
    setShowDate(true);
  };

  const handleAssetPick = async () => {
    setAsset(null);
    let res;
    if (isImage) {
      res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
    } else if (isVid) {
      res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });
      // RESTRICT VIDEO LIMIT
      const { vidErr, bool } = vidMaxChecker(res.duration, 4);
      if (bool) {
        return setPopper({
          vis: true,
          type: "failed",
          msg: vidErr,
        });
      }
    }
    if (!res.cancelled) setAsset(res);
  };

  const handleStartEvent = () => {
    setIsLoading(true);
    setErrMsg(null);
    if (title.length < 2) {
      setErrMsg("Please provide event title");
      setIsLoading(false);
      return;
    }
    if (!asset && !isText) {
      setErrMsg("Please provide event data");
      setIsLoading(false);
      return;
    }
    if (input.length < 2 && isText) {
      setErrMsg("Please provide event message");
      setIsLoading(false);
      return;
    }
    const sendAsset = { ...asset };
    delete sendAsset.cancelled;
    const data = {
      title,
      eventTime: date,
      c_type: isText ? "text" : asset.type,
      instance,
      points: cpCalculator,
      isMedia: !isText,
      instanceID,
      challengersNum: number,
      challengeInfo: isText ? input : sendAsset,
    };
    handleNewEvents(
      data,
      (resData) => {
        updateMe(resData.points, "points");
        setIsLoading(false);
        closer && closer();
      },
      (err) => {
        setErrMsg(err.msg);
        setIsLoading(false);
      }
    );
  };

  const renderEventTypes = ({ item }) => {
    const isSelected = item.selected ? colors.primary : theme.medium;
    const handleTypePress = () => {
      const copyArr = [...type];
      const index = copyArr.findIndex((obj) => obj.id == item.id);
      const indexSelected = copyArr.findIndex((obj) => obj.selected === true);
      if (index < 0) return;
      copyArr[indexSelected].selected = false;
      copyArr[index].selected = true;
      setType(copyArr);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleTypePress}
        style={styles.eventType}
        key={item.id}
      >
        <Feather name="check-circle" size={16} color={isSelected} />
        <AppText style={{ ...styles.eventTypeText, color: isSelected }}>
          {item.name}
        </AppText>
      </TouchableOpacity>
    );
  };

  const renderEvents = () => {
    return (
      <View style={{ flex: 1 }}>
        <AppText style={styles.subTitles} bold>
          Choose Event Type:
        </AppText>
        <View style={styles.eventTypeCont}>
          {type.map((obj) => renderEventTypes({ item: obj }))}
        </View>
        <AppText style={styles.subTitles} bold>
          Give Event Title:
        </AppText>
        <GrowInput text={title} setText={setTitle} placeholder="Event title" />

        <AppText style={styles.subTitles} bold>
          Schedule Event Day-time:
        </AppText>
        <View>
          <AppText style={styles.title}>
            {getFormatTime(date, null, "date")} {getFormatTime(date)}
          </AppText>
          <View style={styles.eventTypeCont}>
            <AppButton
              title="set date"
              onPress={() => handleTime("date")}
              naked
            />
            <AppButton
              title="set time"
              onPress={() => handleTime("time")}
              naked
            />
          </View>
          {showDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              textColor={colors.primary}
              minuteInterval={30}
              mode={mode}
              minimumDate={new Date()}
              is24Hour={false}
              // display="spinner"
              onChange={handleChangeDate}
            />
          )}
        </View>

        <AppText style={styles.subTitles} bold>
          Maximum Number of participants:
        </AppText>
        <SelectNumber
          num={number}
          setNum={setNumber}
          style={{ marginVertical: 8 }}
          limitX={10}
          limitY={50}
        />
        <AppText style={{ textAlign: "center" }}>
          Will require{" "}
          <AppText style={{ color: colors.primary }}>{cpCalculator}CP</AppText>{" "}
        </AppText>
        <AppText style={styles.subTitles} bold>
          My Media:
        </AppText>
        {(isImage || isVid) && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              width,
              alignItems: "center",
            }}
          >
            <AppButton
              style={{ alignSelf: "center" }}
              title={mediaBtnTitle}
              onPress={handleAssetPick}
              naked
            />
            {asset && isImage && asset.type === "image" && (
              <View
                style={{
                  ...styles.mediaContainer,
                  aspectRatio: asset.width / asset.height,
                }}
              >
                <Image source={{ uri: asset.uri }} style={styles.media} />
              </View>
            )}
            {asset && isVid && asset.type == "video" && (
              <PostVideo
                vidUri={asset.uri}
                style={styles.postVideo}
                disableThumb
                viewable={false}
              />
            )}
          </View>
        )}
        {isText && (
          <KeyboardAvoidingView
            behavior={isInput ? "position" : null}
            keyboardVerticalOffset={isInput ? height * 0.2 : 0}
          >
            <View style={styles.inputContainer}>
              <TextInput
                value={input}
                onChangeText={(val) => setInput(val)}
                multiline
                placeholder="Add event info"
                onFocus={() => setIsInput(true)}
                onBlur={() => setIsInput(false)}
                style={styles.input}
              />
            </View>
          </KeyboardAvoidingView>
        )}
        <View>
          <AppButton
            title="SCHEDULE"
            style={{ alignSelf: "center", marginTop: 15 }}
            onPress={handleStartEvent}
          />
          <AppButton
            title="CANCEL"
            style={{
              alignSelf: "center",
              width: width * 0.6,
              marginTop: 5,
            }}
            onPress={() => {
              // setStatusBarStyle("light");
              closer && closer();
            }}
            bare
          />
        </View>
      </View>
    );
  };

  useEffect(() => {
    setStatusBarStyle("dark");
  }, []);

  return (
    <>
      <Screen style={styles.content}>
        {errMsg && <AppText style={styles.error}>{errMsg}</AppText>}

        <ScrollView
          contentContainerStyle={{
            paddingBottom: height * 0.1,
          }}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
        >
          {renderEvents()}
        </ScrollView>
      </Screen>
      <ActivityIndicator
        type="spin"
        visible={isLoading}
        style={styles.activity}
        wTransparent
      />
      <PopMessage
        popData={popper}
        setter={() => setPopper({ vis: false })}
        timer={0.35}
      />
    </>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "99%",
    height: "100%",
    borderRadius: width * 0.04,
  },
  addBtn: {
    right: width * 0.07,
  },
  content: {
    flex: 1,
    width,
    // backgroundColor: colors.extraLight,
  },
  error: {
    textAlign: "center",
    marginBottom: 8,
    color: colors.heart,
  },
  eventType: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventRuleInput: {
    width: width * 0.65,
    alignSelf: "flex-start",
  },
  eventTypeCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  eventTypeText: {
    marginLeft: 3,
  },
  inputContainer: {
    width: width * 0.8,
    height: width * 0.7,
    backgroundColor: colors.extraLight,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    elevation: 2,
    borderRadius: 13,
  },
  input: {
    flex: 1,
    width: "100%",
    textAlign: "center",
    lineHeight: 40,
    fontSize: 20,
    fontFamily: "sen-bold-b1",
  },
  media: {
    height: "100%",
    width: "100%",
    borderRadius: width * 0.03,
  },
  mediaContainer: {
    maxHeight: height * 0.92,
    width: width * 0.95,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  postVideo: {
    width: width * 0.95,
    maxHeight: height * 0.85,
    marginBottom: 10,
  },
  postVideoCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  subTitles: {
    marginLeft: 8,
    marginVertical: 10,
  },
  title: {
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 9,
  },
});
export default Events;
