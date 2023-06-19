import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import ChallengeCard from "./ChallengeCard";
import Icon from "./Icon";
import Score from "./Score";
import AppText from "./AppText";
import { RenderMediaIcon } from "./PostVideo";
import colors, { postColors } from "../constants/colors";
import ProfilePic from "./ProfilePic";
import MediaModal from "./MediaModal";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const Vote = ({ cardInfo, type = "characters", score, onPress, color }) => {
  const [showStat, setShowStat] = useState(false);
  const [displayMedia, setDisplayMedia] = useState({ vis: false, data: null });

  const navigation = useNavigation();
  const theme = useContext(ThemeContext);

  let touchTime = 0,
    timed;

  const handlePressImage = (type) => {
    const now = new Date().getTime();
    const diff = now - touchTime;
    let dPress = null;
    clearTimeout(timed);

    if (diff < 450 && diff > 0) {
      // double
      dPress = true;
      setShowStat(!showStat);
    } else {
      // single
      timed = setTimeout(() => {
        if (!dPress) {
          setDisplayMedia({
            vis: true,
            item:
              type === "info"
                ? {
                    bg: postColors[2].bg,
                    tColor: postColors[2].text,
                    text: cardInfo.info,
                    type: "text",
                  }
                : cardInfo.media,
          });
        }
      }, 500);
    }

    touchTime = new Date().getTime();
  };

  return (
    <View style={styles.container}>
      <View>
        {type === "characters" && (
          <ChallengeCard
            {...cardInfo}
            onPress={() =>
              navigation.navigate("Character", { item: cardInfo.id })
            }
          />
        )}
        {type === "events" && (
          <View>
            {cardInfo.type == "text" && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => handlePressImage("info")}
                style={[styles.infoContainer, { backgroundColor: theme.white }]}
              >
                {!showStat ? (
                  <AppText style={styles.infoText} size="large" bold>
                    {cardInfo.info}
                  </AppText>
                ) : (
                  <View style={styles.stats}>
                    <ProfilePic
                      source={cardInfo.user.avatar}
                      userID={cardInfo.user._id}
                      size={width * 0.2}
                      border={2}
                      borderColor={colors.white}
                    />
                    <AppText size="large" style={styles.username} bold>
                      @{cardInfo.user.username}
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            )}
            {cardInfo.type === "image" && (
              <View style={styles.imageContainerCont}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={handlePressImage}
                  onLongPress={() => setShowStat(!showStat)}
                  style={{
                    ...styles.imageContainer,
                    aspectRatio: cardInfo.media.width / cardInfo.media.height,
                  }}
                >
                  <Image
                    source={{ uri: cardInfo.media.uri }}
                    style={{
                      ...styles.image,
                      borderRadius: 12,
                    }}
                  />
                  {showStat && (
                    <View style={styles.stats}>
                      <ProfilePic
                        source={cardInfo.user.avatar}
                        size={width * 0.2}
                        userID={cardInfo.user._id}
                        border={2}
                        borderColor={colors.white}
                      />
                      <AppText size="large" style={styles.username} bold>
                        @{cardInfo.user.username}
                      </AppText>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
            {cardInfo.type === "video" && (
              <Pressable
                onPress={handlePressImage}
                onLongPress={() => setShowStat(!showStat)}
                style={styles.videoContainer}
              >
                <Image
                  source={{ uri: cardInfo?.media?.thumb }}
                  style={styles.thumb}
                  blurRadius={6}
                />
                <RenderMediaIcon />
                {showStat && (
                  <View style={styles.stats}>
                    <ProfilePic
                      source={cardInfo.user.avatar}
                      size={width * 0.2}
                      userID={cardInfo.user._id}
                      border={2}
                      borderColor={colors.white}
                    />
                    <AppText size="large" style={styles.username} bold>
                      @{cardInfo.user.username}
                    </AppText>
                  </View>
                )}
              </Pressable>
            )}
          </View>
        )}
        <View style={styles.voter}>
          <Icon name="heart" size={35} onPress={onPress} color={color} />
          <Score score={score} size={40} fScale={10} />
        </View>
      </View>
      <MediaModal modalObject={displayMedia} setVisible={setDisplayMedia} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 9,
    justifyContent: "center",
  },
  infoContainer: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.022,
    marginLeft: 10,
    marginVertical: width * 0.022,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
  },
  imageContainerCont: {
    width: width * 0.6,
    maxHeight: height * 0.7,
    marginLeft: 10,
    marginVertical: width * 0.022,
    // height: height * 0.4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoText: {
    width: "85%",
    textAlign: "center",
    color: colors.primary,
  },
  stats: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.35)",
    width: "100%",
    height: "100%",
    borderRadius: width * 0.022,
    justifyContent: "center",
    alignItems: "center",
  },
  thumb: {
    width: width * 0.6,
    height: height * 0.45,
    borderRadius: 10,
  },
  username: {
    textAlign: "center",
    textTransform: "lowercase",
    color: colors.white,
  },
  videoContainer: {
    height: height * 0.46,
    marginLeft: 10,
  },
  voter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 15,
  },
});
export default Vote;
