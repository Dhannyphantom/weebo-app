import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  Image,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MediaPicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as CharContext } from "../config/CharContext";

import ThemeContext from "../config/ThemeContext";
import ActivityIndicator from "./ActivityIndicator";
import AppButton from "./AppButton";
import AppText from "./AppText";
import Link from "./Link";
import PopDropDown from "./PopDropDown";
import PostVideo from "./PostVideo";
import Separator from "./Separator";
import colors from "../constants/colors";

const { width, height } = Dimensions.get("screen");

const Challenger = ({ data, setAsset, setter }) => {
  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const isManager = data.owner._id === userInfo._id;

  const initializeChallenge = async (type) => {
    switch (type) {
      case "image":
        const res_image = await MediaPicker.launchImageLibraryAsync({
          mediaTypes: MediaPicker.MediaTypeOptions.Images,
          allowsEditing: true,
          allowsMultipleSelection: false,
        });
        if (!res_image.cancelled) {
          delete res_image.cancelled;
          setAsset(res_image);
        }
        break;
      case "video":
        const res_video = await MediaPicker.launchImageLibraryAsync({
          mediaTypes: MediaPicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          allowsMultipleSelection: false,
        });
        if (!res_video.cancelled) {
          delete res_video.cancelled;
          setAsset(res_video);
        }
        break;
      case "info":
        setAsset({ type: "info" });
        break;
      default:
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppText style={styles.title}>
        A chance to be a Weebo Instance Manager by challenging this instance
      </AppText>
      {!isManager && (
        <View style={styles.links}>
          <View style={styles.row}>
            <Link
              style={styles.linkShort}
              name="Image"
              iconName="image-multiple"
              onPress={() => initializeChallenge("image")}
            />
            <Link
              style={styles.linkShort}
              name="Video"
              iconName="image-multiple"
              onPress={() => initializeChallenge("video")}
            />
          </View>
          <Link
            style={styles.link}
            name="Invalid information"
            iconName="image-multiple"
            onPress={() => initializeChallenge("info")}
          />
        </View>
      )}
      <View style={styles.row}>
        <AppButton title="Challenge" bare style={styles.btn} />
        <AppButton
          title="Cancel"
          bare
          bareRed
          onPress={() => setter()}
          style={styles.btn}
          LIcon="cancel"
        />
      </View>
      <ActivityIndicator visible={false} style={styles.activity} />
    </View>
  );
};

const InfoProps = ({ item }) => {
  const theme = useContext(ThemeContext);
  const [selected, setSelected] = useState(item.selected);

  return (
    <View style={[styles.info, { backgroundColor: theme.extralight }]}>
      <View style={styles.infoTitle}>
        <AppText size="large" bold>
          {item.title[0].toUpperCase() + item.title.slice(1)}
        </AppText>
        <MaterialCommunityIcons
          name={selected ? "circle" : "check-circle"}
          color={selected ? colors.primary : colors.medium}
          size={20}
        />
      </View>
    </View>
  );
};

const ChallengeMedia = ({ asset, data, setAsset }) => {
  const [loading, setLoading] = useState(true);
  const [assetData, setAssetData] = useState([]);
  const theme = useContext(ThemeContext);
  const { fetchInfoProperties } = useContext(CharContext);
  const topper = useSafeAreaInsets().top;

  const fetchInstanceInfo = async () => {
    if (asset && asset.type === "info" && loading) {
      await fetchInfoProperties(
        { id: data.id, instance: data.instance },
        (resData) => {
          setAssetData(resData.data);
          setLoading(false);
        },
        (errData) => {
          console.log(errData);
        }
      );
    }
  };

  useEffect(() => {
    fetchInstanceInfo();
  }, []);

  console.log(assetData);

  return (
    <View
      style={[
        styles.media,
        { backgroundColor: theme.background, marginTop: topper },
      ]}
    >
      {asset && asset.type === "image" && (
        <Image style={styles.image} source={asset} />
      )}
      {asset && asset.type === "video" && (
        <PostVideo
          source={asset}
          style={styles.video}
          viewable={false}
          autoPlayer
          disableDoublePress
          disableLongPress
        />
      )}
      {asset && asset.type === "info" && (
        <>
          <AppText style={{ ...styles.title, marginTop: 15 }} size="large" bold>
            Select Invalid Info
          </AppText>
          <Separator h={2} />
          <AppText style={styles.title}>
            Choose and select info properties that you're sure are wrong or
            incomplete information
          </AppText>
          <View style={{ flex: 1 }}>
            <FlatList
              data={assetData}
              extraData={asset}
              contentContainerStyle={{
                paddingVertical: 15,
              }}
              keyExtractor={(item, index) => item.title + index}
              renderItem={({ item }) => <InfoProps item={item} />}
            />
          </View>
        </>
      )}
      <ActivityIndicator
        visible={loading && asset && asset.type === "info"}
        style={styles.activity}
      />
    </View>
  );
};

export default function InstanceChallenger({ data, visible, setVisible }) {
  const [actions, setActions] = useState({ modal: "open" });
  const [asset, setAsset] = useState(null);

  const closeModal = () => {
    return actions.modal;
  };
  return (
    <PopDropDown
      visible={visible}
      disableCloseTouch
      setter={() => {
        setActions({ modal: "open" });
        setVisible(false);
      }}
      closer={closeModal}
      RenderComponent={() => (
        <Challenger
          setter={() => setActions({ ...actions, modal: "close" })}
          setAsset={setAsset}
          data={data}
        />
      )}
      TopperComponent={() => (
        <ChallengeMedia data={data} setAsset={setAsset} asset={asset} />
      )}
      headerTitle="Challenge By"
    />
  );
}

const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  btn: {
    marginHorizontal: 10,
    marginVertical: 15,
  },
  container: {
    minHeight: height * 0.1,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  info: {
    padding: 18,
    marginBottom: 15,
    marginHorizontal: 18,
    borderRadius: 10,
  },
  infoTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  links: {},
  link: {
    width: width * 0.8,
    alignSelf: "center",
  },
  linkShort: {
    width: width * 0.38,
    marginRight: 10,
  },
  media: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    marginVertical: 0,
  },
});
