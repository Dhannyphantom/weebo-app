import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";

import { Context as AuthContext } from "../config/AuthContext";

import PopUpModal from "./PopUpModal";
import AppText from "./AppText";
import Separator from "./Separator";
import colors from "../constants/colors";
import AppButton from "./AppButton";
import ActivityIndicator from "./ActivityIndicator";
import PostVideo from "./PostVideo";
import { capCapitalize } from "../constants/helpers";

const screen = Dimensions.get("window");

const JoinComponent = ({
  joinData,
  setter,
  challengerState,
  setJoiner,
  titles,
  visible,
  handleJoinEvent,
}) => {
  const [joinLoading, setjoinLoading] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [errMsg, setErrMsg] = useState(null);

  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const isImage = joinData?.asset && joinData?.asset.type === "image";
  const isVideo = joinData?.asset && joinData?.asset.type === "video";
  const isText = joinData?.asset && joinData?.asset.type === "text";

  const handleJoinAnEvent = () => {
    if (!userInfo.verified)
      return setErrMsg("Complete and verify your account!");
    setjoinLoading(true);
    setErrMsg(null);
    const isText = joinData?.asset.type === "text";
    const data = {
      challengeInfo: { ...joinData?.asset, eventId: joinData?.eventId },
      c_type: joinData?.asset.type,
      isMedia: !isText,
    };
    if (isText) {
      data.challengeInfo = {
        ...joinData?.asset,
        eventId: joinData?.eventId,
        info: joinInput,
      };
    }

    handleJoinEvent(
      data,
      (resData) => {
        setjoinLoading(false);
        setter(() => {
          setJoiner(true);
          challengerState.setChallengerNum(challengerState.challengerNum + 1);
        });
      },
      (err) => {
        setErrMsg(
          `${err.msg}${
            Boolean(err?.err?.response?.data)
              ? ": " + err?.err?.response?.data
              : ""
          }`
        );
        setjoinLoading(false);
      }
    );
  };

  if (!visible) return null;
  return (
    <View style={{ flex: 1, paddingBottom: 30 }}>
      <AppText style={styles.title} size="large" bold>
        {titles.title}{" "}
        {titles?.subTitle ? `-- ${capCapitalize(titles.subTitle)}` : null} Event
        Challenge
      </AppText>
      <Separator h={1} />
      <AppText style={{ textAlign: "center", marginBottom: 15 }}>
        Will require{" "}
        <AppText style={{ color: colors.primary }} textStyle="black">
          10WP{" "}
        </AppText>
        to join
      </AppText>
      {errMsg && <AppText style={styles.error}> {errMsg}</AppText>}
      {/* <FlatList
        data={["1"]}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        // keyboardShouldPersistTaps="handled"
        listKey="event@5487"
        renderItem={() => {
          return (
            <View style={{ flex: 1 }}>
              {joinData?.asset && joinData?.asset.type === "image" && (
                <View
                  style={{
                    ...styles.joinImage,
                    aspectRatio: joinData?.asset.width / joinData?.asset.height,
                  }}
                >
                  {joinData?.asset && joinData?.asset.uri && (
                    <Image
                      source={{ uri: joinData?.asset.uri }}
                      style={{ ...styles.image, borderRadius: 12 }}
                    />
                  )}
                </View>
              )}
              {joinData?.asset && joinData?.asset.type === "video" && (
                <>
                  {joinData?.asset.uri && (
                    <PostVideo source={joinData?.asset} viewable={false} />
                  )}
                </>
              )}
              {joinData?.asset && joinData?.asset.type === "text" && (
                // <View style={styles.infoCont}>
                <TextInput
                  // value={joinInput}
                  // onChangeText={(val) => setJoinInput(val)}
                  multiline
                  style={styles.joinInput}
                  placeholder="Add event info"
                />
                // </View>
              )}

              <AppButton
                title="JOIN"
                onPress={handleJoinAnEvent}
                style={{ alignSelf: "center", marginVertical: 25 }}
              />
            </View>
          );
        }}
      /> */}

      <ScrollView style={{ flex: 1 }}>
        {isImage && (
          <View
            style={{
              ...styles.joinImage,
              aspectRatio: joinData?.asset.width / joinData?.asset.height,
            }}
          >
            {joinData?.asset && joinData?.asset.uri && (
              <Image
                source={{ uri: joinData?.asset.uri }}
                style={{ ...styles.image, borderRadius: 12 }}
              />
            )}
          </View>
        )}
        {isVideo && (
          <>
            {joinData?.asset.uri && (
              <PostVideo source={joinData?.asset} viewable={false} />
            )}
          </>
        )}
        {isText && (
          <View style={styles.infoCont}>
            <TextInput
              value={joinInput}
              onChangeText={(val) => setJoinInput(val)}
              multiline
              style={styles.joinInput}
              placeholder="Add event info"
            />
          </View>
        )}

        <AppButton
          title="JOIN"
          onPress={handleJoinAnEvent}
          style={{ alignSelf: "center", marginVertical: 25 }}
        />
      </ScrollView>
      <ActivityIndicator
        visible={joinLoading}
        wTransparent
        style={styles.activity}
      />
    </View>
  );
};

const JoinEvents = ({
  visible,
  joinData,
  setter,
  challengerState,
  setJoiner,
  titles,
  handleJoinEvent,
}) => {
  return (
    <PopUpModal
      visible={visible}
      setter={setter}
      ContentComponent={() => (
        <JoinComponent
          joinData={joinData}
          challengerState={challengerState}
          setJoiner={setJoiner}
          titles={titles}
          handleJoinEvent={handleJoinEvent}
          setter={setter}
          visible={visible}
        />
      )}
    />
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 35,
  },

  container: {},
  error: {
    textAlign: "center",
    color: colors.heart,
    marginVertical: 5,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  infoCont: {
    width: screen.width * 0.9,
    height: screen.height * 0.4,
    backgroundColor: colors.extraLight,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowRadius: 6,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 1.5,
      height: 3,
    },
    borderRadius: 12,
  },
  joinImage: {
    width: screen.width * 0.95,
    maxHeight: screen.height * 0.75,
    borderRadius: 13,
    alignSelf: "center",
    marginVertical: 10,
  },
  joinInput: {
    flex: 1,
    width: "100%",
    textAlign: "center",
    lineHeight: 40,
    fontSize: 18,
    fontFamily: "sans-semibold",
  },
  title: {
    textAlign: "center",
    marginTop: 12,
    maxWidth: "90%",
    alignSelf: "center",
  },
});
export default JoinEvents;
