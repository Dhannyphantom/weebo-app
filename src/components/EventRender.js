import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Context as AcctContext } from "../config/AcctContext";

import FeedBox from "./FeedBox";
import JoinEvents from "./JoinEvents";
import getFormatTime from "../constants/getFormatTime";
import vidMaxChecker from "../constants/vidMaxChecker";
import PopMessage from "./PopMessage";

const EventRender = ({
  eventData,
  showTitle,
  renderType = "multiple",
  isSubscribed,
  updateMe,
  userID,
}) => {
  const { handleJoinEvent } = useContext(AcctContext);

  const RenderEvents = ({ item }) => {
    const [joiner, setJoiner] = useState(false);
    const [joinData, setJoinData] = useState({ vis: false });
    const [popper, setPopper] = useState({ vis: false });

    const finder = item.challengers[0];
    const participant = item.challengers.find((obj) => obj.user == userID);
    const isParticipant = participant ? true : false;
    let imgData = finder.media;
    const info = finder.info;
    let mediaType;
    if (!finder) return null;

    if (
      (imgData && imgData.uri.endsWith(".jpg")) ||
      (imgData && imgData.uri.endsWith(".jpeg")) ||
      (imgData && imgData.uri.endsWith(".png"))
    ) {
      mediaType = "image";
    } else if (imgData && imgData.uri.endsWith(".mp4")) {
      mediaType = "video";
    } else if (item.c_type == "text") {
      mediaType = "text";
      imgData = info;
    }

    const handleJoin = async (eventId) => {
      try {
        let res;
        if (mediaType == "image") {
          res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });
        } else if (mediaType == "video") {
          res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          });
          const { vidErr, bool } = vidMaxChecker(res.duration, 4);
          if (bool) {
            return setPopper({
              type: "failed",
              vis: true,
              msg: vidErr,
            });
          }
        } else {
          // DEFINITELY AN INFO
          res = {
            width: 0,
            height: 0,
            cancelled: false,
            uri: null,
            type: "text",
          };
        }
        if (!res.cancelled) {
          // NOT CANCELLED
          delete res.cancelled;
          delete res.rotation;
          setJoinData({ vis: true, asset: res, eventId });
        }
      } catch (err) {
        console.log(err);
      }
    };

    const handleCallback = (type, data) => {
      if (type == 1) {
        // SUCCESS
        setJoiner(true);
        // setTimeout(() => {
        //   updateMe(data, "points");
        // }, 1000);
      } else if (type == 2) {
        // eERROR
        setJoiner(false);
      } else if (type === 3) {
        // return setPopper({
        //   vis: true,
        //   type: "failed",
        //   msg: vidErr,
        // });
      }
    };

    const statLeft = `${item.challengers.length}/${item.challengersNum} participants`;
    const statRight = getFormatTime(item.eventTime, null, "event");

    const isExpired = new Date(item.eventTime) <= Date.now();
    if (isExpired) {
      return null;
    }

    let title2;
    if (item.tagChannel) title2 = item.tagChannel.name;
    if (item.tagGroup) title2 = item.tagGroup.name;
    if (item.tagCharacter) title2 = item.tagCharacter.name;
    if (item.tagShow) title2 = item.tagShow.name;

    return (
      <View>
        <FeedBox
          title={item.title}
          title2={title2}
          image={imgData}
          statLeft={statLeft}
          rightColored={joiner}
          icon="ninja"
          mediaType={mediaType}
          onPress={null}
          midBtnPress={() => handleJoin(item._id)}
          midBtn={isExpired || isParticipant || joiner ? null : "JOIN"}
          statMid={
            joiner || isParticipant ? "JOINED" : isExpired ? "EXPIRED" : null
          }
          statRight={statRight}
        />

        <JoinEvents
          visible={joinData?.vis}
          setter={() => setJoinData({ vis: false })}
          joinData={joinData}
          handleJoinEventCb={handleCallback}
          handleJoinEvent={handleJoinEvent}
        />
        <PopMessage
          popData={popper}
          timer={0.4}
          setter={() => setPopper({ vis: false })}
        />
      </View>
    );
  };

  if (renderType === "single") {
    return <RenderEvents item={eventData} />;
  } else {
    return (
      <View>
        <FlatList
          data={eventData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <RenderEvents item={item} />}
          listKey="eventss"
        />
      </View>
    );
  }
};
const styles = StyleSheet.create({
  container: {},
});
export default EventRender;

// CHECK APP.TXT FOR JUNKS 2162
