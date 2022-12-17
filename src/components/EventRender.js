import React, { useContext, useState } from "react";
import { FlatList, View } from "react-native";

import { Context as AcctContext } from "../config/AcctContext";

import FeedBox from "./FeedBox";
import JoinEvents from "./JoinEvents";
import getFormatTime from "../constants/getFormatTime";
import PopMessage from "./PopMessage";
import { launchGallery } from "../constants/helpers";

const RenderEvents = ({ item, userID, isFollowing, handleJoinEvent }) => {
  const [joiner, setJoiner] = useState(false);
  const [joinData, setJoinData] = useState({ vis: false });
  const [popper, setPopper] = useState({ vis: false });
  const [challengerNum, setChallengerNum] = useState(item?.challengers?.length);

  const finder = item.challengers[0];
  const participant = item.challengers.find((obj) => obj.user == userID);
  const isParticipant = participant ? true : false;
  const fullParticipants = challengerNum == item.challengersNum;
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
    if (!isFollowing) {
      return setPopper({
        vis: true,
        msg: "Please subscribe or follow instance",
        type: "failed",
      });
    }
    try {
      let res;
      if (mediaType == "image") {
        const { results } = await launchGallery("image", true, false);
        if (results) {
          res = results[0];
        }
      } else if (mediaType == "video") {
        const { _error, results } = await launchGallery(
          "video",
          false,
          false,
          null,
          60
        );
        if (results) {
          res = results[0];
        } else if (_error) {
          return setPopper({
            type: "failed",
            vis: true,
            msg: _error,
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

  const handleCloseEventModal = (cb) => {
    setJoinData({ vis: false, joined: true });
    cb && cb();
  };

  const statLeft = `${challengerNum} of ${item.challengersNum} weebs`;
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
    <>
      <FeedBox
        title={item.title}
        title2={title2}
        image={imgData}
        statLeft={statLeft}
        border
        rightColored={joiner}
        icon="ninja" //change ICON
        mediaType={mediaType}
        onPress={null}
        midBtnPress={() => handleJoin(item._id)}
        midBtn={
          isExpired || isParticipant || joiner || fullParticipants
            ? null
            : "JOIN"
        }
        statMid={
          joiner || isParticipant ? "JOINED" : isExpired ? "EXPIRED" : null
        }
        statRight={statRight}
      />

      <JoinEvents
        visible={joinData?.vis}
        setter={handleCloseEventModal}
        joinData={joinData}
        setJoiner={setJoiner}
        challengerState={{ challengerNum, setChallengerNum }}
        // handleJoinEventCb={handleCallback}
        handleJoinEvent={handleJoinEvent}
      />
      <PopMessage
        popData={popper}
        timer={0.4}
        setter={() => setPopper({ vis: false })}
      />
    </>
  );
};

const EventRender = ({
  eventData,
  isFollowing,
  renderType = "multiple",
  userID,
}) => {
  const { handleJoinEvent } = useContext(AcctContext);

  if (renderType === "single") {
    return (
      <RenderEvents
        item={eventData}
        userID={userID}
        isFollowing={isFollowing}
        handleJoinEvent={handleJoinEvent}
      />
    );
  } else {
    return (
      <View>
        <FlatList
          data={eventData}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <RenderEvents
              item={item}
              isFollowing={isFollowing}
              userID={userID}
              handleJoinEvent={handleJoinEvent}
            />
          )}
          listKey="eventss"
        />
      </View>
    );
  }
};

export default EventRender;
