import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  View,
} from "react-native";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import gradients from "../constants/gradients";
import colors from "../constants/colors";
import AppButton from "../components/AppButton";
import Separator from "../components/Separator";
import GrowInput from "../components/GrowInput";
import ActivityIndicator from "../components/ActivityIndicator";

const { width, height } = Dimensions.get("window");

const SavedCollectionScreen = ({ navigation }) => {
  const {
    updateMe,
    state: { userInfo },
  } = useContext(AuthContext);
  const { addNewCollection } = useContext(FeedContext);

  const [myCollections, setMyCollections] = useState(userInfo.my_collections);
  const [modalVis, setModalVis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  const textInputRef = useRef(null);

  const renderCollections = ({ item, index }) => {
    let colNum;
    index % 2 == 0 ? (colNum = 1) : (colNum = 2);
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("Collection", { item })}
      >
        <LinearGradient
          colors={[gradients[colNum].bg, gradients[colNum].bg1]}
          style={styles.collBox}
        >
          <AppText style={styles.collText} bold>
            {item.name}
          </AppText>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const handleCollBtnPress = () => {
    if (text.length > 1) {
      const data = {
        name: text,
      };
      setModalVis(false);
      setIsLoading(true);
      addNewCollection(
        data,
        (resData) => {
          setMyCollections(resData);
          updateMe(resData, "my_collections");
          setText("");
          setIsLoading(false);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      setModalVis(false);
    }
  };

  useEffect(() => {
    if (modalVis) {
      textInputRef?.current?.focus();
    }
  }, [modalVis]);

  return (
    <Screen style={styles.container}>
      <AppHeader
        title="Saved Collection"
        RightComponent={() => (
          <AppButton
            title="New"
            onPress={() => setModalVis(true)}
            naked
            style={styles.newCollBtn}
          />
        )}
      />

      <AppText style={styles.textInfo}>
        You have{" "}
        <AppText bold size="large">
          {myCollections.length}
        </AppText>{" "}
        collections
      </AppText>
      <FlatList
        data={myCollections}
        ListEmptyComponent={
          <ActivityIndicator
            type="isEmpty"
            style={styles.activityEmpty}
            text="No collections..."
            visible={true}
          />
        }
        numColumns={3}
        keyExtractor={(item) => item._id}
        renderItem={renderCollections}
      />
      <Modal
        visible={modalVis}
        statusBarTranslucent
        transparent
        onRequestClose={() => setModalVis(false)}
      >
        <View style={styles.modalCont}>
          <View style={styles.content}>
            <AppText style={styles.headerText} bold>
              Add New Collection
            </AppText>
            <Separator h={1} />
            <GrowInput
              text={text}
              setText={setText}
              mLine={false}
              ref={textInputRef}
              placeholder="New collection's name"
            />
            <AppButton
              title={text.length > 1 ? "Save Collection" : "Cancel"}
              onPress={handleCollBtnPress}
              bare
              style={styles.newCollBtn}
            />
          </View>
        </View>
      </Modal>
      <ActivityIndicator
        visible={isLoading}
        wTransparent
        type="spin"
        style={styles.activity}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width,
    height,
  },
  activityEmpty: {
    width,
    height: height * 0.8,
  },
  container: {
    padding: 10,
  },
  content: {
    width: width * 0.92,
    paddingBottom: 50,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  collBox: {
    height: width * 0.28,
    width: width * 0.31,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: width * 0.005,
    marginTop: 8,
  },
  collText: {
    textAlign: "center",
    color: colors.white,
  },
  textInfo: {
    textAlign: "center",
    marginTop: 11,
  },
  headerText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 8,
  },
  modalCont: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
  },

  newCollBtn: {
    alignSelf: "center",
    marginTop: 8,
  },
});
export default SavedCollectionScreen;
