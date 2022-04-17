import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import MasonryList from "react-native-masonry-list";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as VideoThumnails from "expo-video-thumbnails";

import AppText from "./AppText";
import colors from "../constants/colors";
import getVideoTime from "../constants/getVideoTime";
import ActivityIndicator from "./ActivityIndicator";
import MediaModal from "./MediaModal";

const screen = Dimensions.get("window");

const MansonryList = ({ images, columns = 2 }) => {
  // images = [{uri, width, height, postId}]
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [displayMedia, setDisplayMedia] = useState({ vis: false, data: null });

  const vidThumbs = [];
  const vidArr = images.filter((obj) => obj?.uri?.endsWith(".mp4"));
  const imgArr = images.filter(
    (obj) =>
      obj?.uri?.endsWith(".jpg") ||
      obj?.uri?.endsWith(".png") ||
      obj?.uri?.endsWith(".jpeg")
  );

  const handleImagePress = ({ uri }, isVideo) => {
    // console.log(uri);
    const finder = images.find((obj) => obj.uri == uri);
    if (!finder) return; // improve error handling
    let obj;
    if (!isVideo) {
      obj = {
        type: "image",
        _id: finder.postId,
        posts: images,
        // { width: finder.width, height: finder.height, uri }
      };
    } else {
      obj = {
        _id: finder.postId,
        type: "video",
        posts: images,
        pos: 0,
      };
    }
    setDisplayMedia({
      vis: true,
      data: {
        feed: obj,
        item: {
          ...finder,
          uri,
        },
      },
    });
    // navigation.navigate("Display", {
    //   item: { width: finder.width, height: finder.height, uri },
    //   data: obj,
    // });
  };

  const handleDotPress = (item) => {
    console.log("Dot");
  };

  const handleEndReach = () => {
    // console.log("GALLERY END");
  };

  const ImageComponent = (data1, data2) => {
    const [vidTime, setVidTime] = useState(0);
    const { source, style } = data1;
    const vidPost = posts.find((obj) => obj.uri === source.uri);
    const showPlayIcon = source?.uri.startsWith("file://");
    const uriObj = showPlayIcon ? { uri: vidPost?.vidUri } : source;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleImagePress(uriObj, showPlayIcon)}
      >
        <Image resizeMethod="resize" source={source} style={style} />
        {showPlayIcon && (
          <View style={styles.playIcon}>
            <Video
              shouldPlay={false}
              source={{ uri: vidPost?.vidUri }}
              onLoad={(AVstatus) => setVidTime(AVstatus.durationMillis)}
            />
            <MaterialCommunityIcons
              name="play-circle"
              size={30}
              color="white"
            />
            <AppText style={styles.vidTime} bold>
              {getVideoTime(vidTime)}
            </AppText>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const FooterComponent = (item) => {
    return (
      <View style={styles.footer}>
        <AppText></AppText>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => handleDotPress(item)}
        >
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={18}
            color={colors.medium}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const EmptyComponent = () => {
    return (
      <ActivityIndicator
        type="isEmpty"
        visible={true}
        text="Fetching media..."
      />
    );
  };

  const getThumbnail = async () => {
    for (let i = 0; i < vidArr.length; i++) {
      const e = vidArr[i];
      try {
        const res = await VideoThumnails.getThumbnailAsync(e.uri, {
          time: 3500,
        });
        vidThumbs.push({ ...res, thumb: true, vidUri: e.uri, time: e.time });
      } catch (err) {
        console.log("Errr", err.message);
      }
    }
    const sortedArr = imgArr.concat(vidThumbs).sort((a, b) => b.time - a.time);
    setPosts(sortedArr);
  };

  useEffect(() => {
    getThumbnail();
  }, [images]);

  return (
    <>
      <MasonryList
        images={posts}
        imageContainerStyle={styles.image}
        containerWidth={screen.width}
        rerender={true}
        sorted={true}
        columns={columns}
        initialColToRender={4}
        masonryFlatListColProps={{ showsVerticalScrollIndicator: false }}
        initialNumInColsToRender={8}
        onEndReached={handleEndReach}
        renderIndividualFooter={FooterComponent}
        emptyView={EmptyComponent}
        customImageComponent={ImageComponent}
      />
      <MediaModal modalObject={displayMedia} setVisible={setDisplayMedia} />
    </>
  );
};
const styles = StyleSheet.create({
  image: {
    borderRadius: 10,
    opacity: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
  },
  playIcon: {
    position: "absolute",
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  vidTime: {
    color: colors.white,
    marginLeft: 4,
  },
});
export default MansonryList;
