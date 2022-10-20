import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
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

const InfoProps = ({ item, state }) => {
  const theme = useContext(ThemeContext);
  const [selected, setSelected] = useState(item.selected);
  const [info, setInfo] = useState(String(item.value));

  const shouldShowBtn = info !== String(item.value);

  const updateAssetArr = (arr) => {
    return arr.map((obj) => {
      if (obj.key === item.key) {
        return {
          ...obj,
          value: info,
          selected: true,
        };
      } else {
        return obj;
      }
    });
  };

  const saveChanges = () => {
    state.setAsset((prev) => {
      return {
        ...prev,
        data: prev?.data
          ? updateAssetArr(prev.data)
          : updateAssetArr(state.assetData),
      };
    });
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelected(!selected)}
        style={[styles.info, { backgroundColor: theme.extralight }]}
      >
        <View style={styles.infoTitle}>
          <AppText size="large" bold>
            {item.title[0].toUpperCase() + item.title.slice(1)}
          </AppText>
          <MaterialCommunityIcons
            name={selected ? "circle" : "circle-outline"}
            color={selected ? colors.primary : colors.medium}
            size={22}
          />
        </View>
      </TouchableOpacity>
      {selected && (
        <View>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.extralight },
            ]}
          >
            <TextInput
              placeholder={`Enter ${item.title}`}
              placeholderTextColor={theme.background}
              onChangeText={(val) => setInfo(val)}
              value={info}
              style={[styles.input, { color: theme.color }]}
            />
          </View>
          {shouldShowBtn && (
            <AppButton
              title="Save Changes"
              onPress={saveChanges}
              bare
              style={styles.infoSaveBtn}
            />
          )}
        </View>
      )}
    </View>
  );
};

const ChallengeMedia = ({ asset, data, setAsset }) => {
  const [loading, setLoading] = useState(false);
  const [assetData, setAssetData] = useState(asset?.data ?? []);
  const theme = useContext(ThemeContext);
  const { fetchInfoProperties } = useContext(CharContext);
  const topper = useSafeAreaInsets().top;

  const fetchInstanceInfo = async () => {
    if (asset && asset.type === "info") {
      if (Boolean(asset?.data)) {
        setAssetData(asset?.data);
        return;
      }

      setLoading(true);
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
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingVertical: 15,
              }}
              keyExtractor={(item, index) => item.title + index}
              renderItem={({ item }) => (
                <InfoProps item={item} state={{ asset, setAsset, assetData }} />
              )}
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
  inputContainer: {
    // width,
    minHeight: 55,
    marginHorizontal: 40,
    marginBottom: 10,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    textTransform: "capitalize",
    paddingLeft: 15,
  },
  infoSaveBtn: {
    marginBottom: 40,
    alignSelf: "center",
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
