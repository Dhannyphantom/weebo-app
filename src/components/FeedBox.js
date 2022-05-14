import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

import colors from "../constants/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";
import LoaderImage from "./LoaderImage";
import Separator from "./Separator";
import PostVideo from "./PostVideo";
import MediaModal from "./MediaModal";

const { width, height } = Dimensions.get("window");

const FeedBox = ({
  title,
  title2,
  icon,
  onPress,
  image, // {uri, width, height}
  statLeft,
  mediaType, // ["image", "video", "text"]
  pack = "m",
  statMid,
  border = false,
  midBtn,
  rightColored,
  midBtnPress,
  statRight,
}) => {
  const [displayMedia, setDisplayMedia] = useState({ vis: false, data: null });

  const handleShowMedia = (mediaObj) => {
    setDisplayMedia({ vis: true, data: mediaObj });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {pack === "m" && (
            <MaterialCommunityIcons
              name={icon}
              size={18}
              color={colors.primary}
            />
          )}
          {pack === "a" && (
            <AntDesign name={icon} size={18} color={colors.primary} />
          )}
          <AppText size="large" style={styles.title} bold>
            {title} {title2 ? `- ${title2}` : null}
          </AppText>
        </View>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => console.log("DOTS")}
          style={styles.dots}
        >
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={width * 0.04}
            color={colors.medium}
          />
        </TouchableOpacity>
      </View>
      {mediaType == "image" && (
        <TouchableOpacity
          activeOpacity={onPress ? 0.96 : 1}
          onPress={onPress}
          style={{
            ...styles.bgImage,
            aspectRatio: image.width / image.height,
            borderRadius: image.width * 0.02,
          }}
        >
          <LoaderImage image={image} />
        </TouchableOpacity>
      )}
      {mediaType == "video" && (
        <PostVideo
          vidUri={image.uri}
          disableThumb
          showMediaFunc={handleShowMedia}
          viewable={false}
        />
      )}
      {mediaType == "text" && (
        <View style={styles.infoCont}>
          <AppText size="large" style={styles.infoText} bold>
            {" "}
            {image}{" "}
          </AppText>
        </View>
      )}
      <Separator h={1} />

      <View style={styles.stats}>
        {statLeft ? (
          <AppText
            style={{
              ...styles.statText,
              color: rightColored ? colors.primary : colors.black,
            }}
          >
            {" "}
            {statLeft}{" "}
          </AppText>
        ) : (
          <View />
        )}
        {!midBtn && (
          <AppText style={styles.author} bold>
            {statMid}
          </AppText>
        )}
        {midBtn && (
          <AppButton
            title={midBtn}
            onPress={midBtnPress}
            style={{ ...styles.statText, justifyContent: "center" }}
            naked
          />
        )}
        {statRight ? (
          <AppText style={styles.statText}> {statRight} </AppText>
        ) : (
          <View />
        )}
      </View>
      <Separator h={1} />
      <MediaModal modalObject={displayMedia} setVisible={setDisplayMedia} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
  author: {
    textTransform: "uppercase",
    width: width * 0.33,
    textAlign: "center",
  },
  bgImage: {
    flex: 1,
    width: width * 0.96,
    maxHeight: height * 0.6,
    alignSelf: "center",
  },
  dots: {
    padding: 8,
  },
  header: {
    flexDirection: "row",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: width * 0.022,
    paddingRight: width * 0.01,
  },
  infoCont: {
    width: width * 0.9,
    height: height * 0.4,
    backgroundColor: colors.extraLight,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    borderRadius: 12,
  },
  image: { width: "100%", height: "100%", borderRadius: 9 },
  stats: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  statText: {
    width: width * 0.33,
    textAlign: "center",
    alignSelf: "center",
  },
  title: {
    textTransform: "capitalize",
    marginBottom: 7,
    marginLeft: 6,

    color: colors.primary,
  },
});
export default FeedBox;
