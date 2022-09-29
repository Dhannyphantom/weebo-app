import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import ChallengeCard from "./ChallengeCard";
import Icon from "./Icon";
import Score from "./Score";
import AppText from "./AppText";
import PostVideo from "./PostVideo";
import colors from "../constants/colors";
import ProfilePic from "./ProfilePic";
import MediaModal from "./MediaModal";

const { width, height } = Dimensions.get("window");

const Vote = ({ cardInfo, type = "characters", score, onPress, color }) => {
  const [showStat, setShowStat] = useState(false);
  const [displayMedia, setDisplayMedia] = useState({ vis: false, data: null });

  const navigation = useNavigation();

  const vidFeed = { posts: [cardInfo.media], type: "video" };
  let touchTime = 0,
    timed;

  const handlePressImage = () => {
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
          handleShowMedia({
            item: cardInfo.media,
            feed: {
              type: "image",
            },
          });
        }
      }, 500);
    }

    touchTime = new Date().getTime();
  };

  const handleShowMedia = (mediaObj) => {
    setDisplayMedia({ vis: true, data: mediaObj });
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
                onPress={() => setShowStat(!showStat)}
                style={styles.infoContainer}
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
              <View style={styles.videoContainer}>
                <PostVideo
                  vidUri={cardInfo?.media?.uri}
                  small
                  feed={vidFeed}
                  showMediaFunc={handleShowMedia}
                  disableDoublePress
                  viewable={false}
                />
              </View>
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
  },
  infoContainer: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: colors.extraLight,
    borderRadius: width * 0.022,
    marginLeft: width * 0.01,
    marginVertical: width * 0.022,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: width * 0.4,
    maxHeight: height * 0.4,
    marginLeft: width * 0.01,
    marginVertical: width * 0.022,
  },
  imageContainerCont: {
    height: height * 0.4,
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
  username: {
    textAlign: "center",
    textTransform: "lowercase",
    color: colors.white,
  },
  videoContainer: {
    height: height * 0.46,
    marginLeft: width * 0.01,
  },
  voter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 15,
    bottom: 5,
  },
});
export default Vote;
