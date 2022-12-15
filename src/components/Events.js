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
import DateTimePicker from "@react-native-community/datetimepicker";
import getFormatTime from "../constants/getFormatTime";
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
import TabList from "./TabList";
import { RenderCoverUpload } from "./CoverUpload";
import { launchGallery } from "../constants/helpers";

const { width, height } = Dimensions.get("window");

const eventTypes = {
  image: true,
  video: false,
  text: false,
};
const typeFalsy = {
  image: false,
  video: false,
  text: false,
};
const tabItems = [
  { tab: "image", name: "Image" },
  { tab: "video", name: "Video" },
  { tab: "text", name: "Text" },
];

const INITIAL_DATE = new Date(Date.now() + 1000 * 60 * 60);

const Events = ({ closer, instance, instanceID }) => {
  const { handleNewEvents } = useContext(AcctContext);
  const { updateMe } = useContext(AuthContext);

  const [type, setType] = useState(eventTypes);
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

  const cpCalculator = Math.round(number * (number / 6));
  const activeTabName = tabItems.find((obj) => type[obj.tab]).name;
  const showImage = asset && type.image && asset.type === "image";
  const showVideo = asset && type.video && asset.type == "video";

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
    if (type.image) {
      const { results } = await launchGallery("image", true);
      if (results) {
        res = results[0];
      }
    } else if (type.video) {
      const { results } = await launchGallery("video", false, false, null, 60);
      if (results) {
        res = results[0];
      }

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
    if (!asset && !type.text) {
      setErrMsg("Please provide event data");
      setIsLoading(false);
      return;
    }
    if (input.length < 2 && type.text) {
      setErrMsg("Please provide event message");
      setIsLoading(false);
      return;
    }
    const sendAsset = { ...asset };
    delete sendAsset.cancelled;
    const data = {
      title,
      eventTime: date,
      c_type: type.text ? "text" : asset.type,
      instance,
      points: cpCalculator,
      isMedia: !type.text,
      instanceID,
      challengersNum: number,
      challengeInfo: type.text ? input : sendAsset,
    };
    handleNewEvents(
      data,
      (resData) => {
        updateMe(resData.points, "points");
        setIsLoading(false);
        closer && closer();
      },
      (err) => {
        setIsLoading(false);

        if (err?.err?.response?.data?.err?.includes("ongoing event")) {
          setPopper({
            vis: true,
            msg: err?.err?.response?.data?.err,
            type: "failed",
          });
        }

        setErrMsg(err.msg);
      }
    );
  };

  const onChangeTab = (item) => {
    setType({ ...typeFalsy, [item]: true });
  };

  const renderEvents = () => {
    return (
      <View style={{ flex: 1 }}>
        <AppText style={styles.subTitles} bold>
          Choose Event Type:
        </AppText>
        <TabList items={tabItems} state={type} onPress={onChangeTab} />
        <AppText style={styles.subTitles} bold>
          Give Event Title:
        </AppText>
        <GrowInput
          text={title}
          mLine={false}
          setText={setTitle}
          placeholder="Event title"
        />

        <AppText style={styles.subTitles} bold>
          Schedule Event Day-time:
        </AppText>
        <View>
          <AppText size="xlarge" bold style={styles.title}>
            {getFormatTime(date, null, "date")} {getFormatTime(date)}
          </AppText>
          <View style={styles.eventTypeCont}>
            <AppButton
              title="Set Date"
              onPress={() => handleTime("date")}
              bare
            />
            <AppButton
              title="Set Time"
              onPress={() => handleTime("time")}
              bare
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
          <AppText style={{ color: colors.primary }}>{cpCalculator}WP</AppText>{" "}
        </AppText>
        <AppText style={styles.subTitles} bold>
          My Media:
        </AppText>
        {(type.image || type.video) && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              width,
              alignItems: "center",
            }}
          >
            <RenderCoverUpload
              show={type.image}
              visible={
                type.image && (asset && asset.type == "image" ? false : true)
              }
              onPress={handleAssetPick}
              type={activeTabName}
            />
            <RenderCoverUpload
              visible={
                type.video && (asset && asset.type == "video" ? false : true)
              }
              show={type.image}
              onPress={handleAssetPick}
              type={activeTabName}
            />
            {showImage && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={handleAssetPick}
                style={{
                  ...styles.mediaContainer,
                  aspectRatio: asset.width / asset.height,
                }}
              >
                <Image source={{ uri: asset.uri }} style={styles.media} />
              </TouchableOpacity>
            )}
            {showVideo && (
              <PostVideo
                source={asset}
                style={styles.postVideo}
                onLongPress={handleAssetPick}
                disableThumb
                disableLongPress
                viewable={false}
              />
            )}
          </View>
        )}
        {type.text && (
          <KeyboardAvoidingView
            behavior={isInput ? "position" : null}
            // keyboardVerticalOffset={isInput ? 1 : 0}
          >
            <View style={styles.inputContainer}>
              <TextInput
                value={input}
                onChangeText={(val) => setInput(val)}
                multiline
                placeholder="Ask a Question"
                onFocus={() => setIsInput(true)}
                onBlur={() => setIsInput(false)}
                style={styles.input}
              />
            </View>
          </KeyboardAvoidingView>
        )}
        <View style={styles.btns}>
          <AppButton
            LIcon="check"
            title="SCHEDULE"
            onPress={handleStartEvent}
            bare
          />
          <AppButton
            title="CANCEL"
            onPress={() => {
              // setStatusBarStyle("light");
              closer && closer();
            }}
            LIcon="cancel"
            bare
            bareRed
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
      <View style={styles.content}>
        {errMsg && <AppText style={styles.error}>{errMsg}</AppText>}

        <ScrollView
          contentContainerStyle={{
            paddingBottom: height * 0.1,
          }}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderEvents()}
        </ScrollView>
      </View>
      <ActivityIndicator
        type="spin"
        visible={isLoading}
        style={styles.activity}
        wTransparent
      />
      <PopMessage
        popData={popper}
        setter={() => setPopper({ vis: false })}
        timer={1}
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
  btns: {
    width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
  },
  content: {
    flex: 1,
    marginTop: 10,
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
    borderRadius: 12,
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
