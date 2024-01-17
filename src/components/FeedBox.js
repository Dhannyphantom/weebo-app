import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

import colors from "../constants/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";
import LoaderImage from "./LoaderImage";
import PostVideo, { RenderMediaIcon } from "./PostVideo";
import MediaModal from "./MediaModal";
import ThemeContext from "../config/ThemeContext";
import { Image } from "react-native";
import Spacer from "./Spacer";

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
  const theme = useContext(ThemeContext);
  const handleShowMedia = (mediaObj) => {
    if (!mediaObj) return null;
    setDisplayMedia({
      vis: true,
      item: mediaObj,
    });
  };

  let borderProps = {};

  if (border) {
    borderProps.borderWidth = 3;
    borderProps.borderColor =
      theme.mode == "light" ? colors.primary : theme.unchange;
  }

  const handleMediaPress = () => {
    if (onPress) {
      onPress();
    } else {
      if (mediaType == "image") {
        handleShowMedia(image);
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.white, ...borderProps },
      ]}
    >
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
      </View>
      {mediaType == "image" && (
        <TouchableOpacity
          activeOpacity={onPress ? 0.96 : 1}
          onPress={handleMediaPress}
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
        <Pressable onPress={() => handleShowMedia(image)}>
          <Image
            blurRadius={6}
            source={{ uri: image.thumb }}
            style={styles.thumb}
          />
          <RenderMediaIcon style={{ left: 10 }} />
        </Pressable>
      )}
      {mediaType == "text" && (
        <View style={styles.infoCont}>
          <AppText size="large" style={styles.infoText} bold>
            {image}
          </AppText>
        </View>
      )}
      {/* <Separator h={1} /> */}

      <View style={styles.stats}>
        {statLeft ? (
          <AppText
            style={{
              ...styles.statText,
              color: rightColored ? colors.primary : theme.color,
            }}
          >
            {statLeft}
          </AppText>
        ) : (
          <View />
        )}
        {!midBtn && (
          <AppText
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.author}
            bold
          >
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
      {/* <Separator h={1} /> */}
      <MediaModal modalObject={displayMedia} setVisible={setDisplayMedia} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: width * 0.96,
    marginTop: 5,
    borderRadius: 20,
    alignSelf: "center",
    elevation: 2,
    shadowRadius: 8,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    marginBottom: 20,
  },
  author: {
    textTransform: "uppercase",
    minWidth: width * 0.33,
    maxWidth: width * 0.333,
    textAlign: "center",
    color: colors.medium,
  },
  bgImage: {
    flex: 1,
    width: "93%",
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
    paddingTop: 15,
    paddingLeft: 15,
    // paddingRight: 10,
    paddingBottom: 10,
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
  infoText: {
    textAlign: "center",
    lineHeight: 28,
  },
  image: { width: "100%", height: "100%", borderRadius: 9 },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 25,
    marginTop: 10,
  },
  statText: {
    width: (width * 0.95) / 3,
    maxWidth: (width * 0.95) / 3.2,
    textAlign: "center",
    alignSelf: "center",
  },
  title: {
    textTransform: "capitalize",
    marginBottom: 7,
    marginLeft: 6,
    width: "95%",
    color: colors.primary,
  },
  thumb: {
    width: "96%",
    height: height * 0.65,
    alignSelf: "center",
    borderRadius: 10,
  },
});
export default FeedBox;
