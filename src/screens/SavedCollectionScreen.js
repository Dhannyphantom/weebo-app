import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "../constants/colors";
import colors from "../constants/colors";
import AppButton from "../components/AppButton";
import Separator from "../components/Separator";
import GrowInput from "../components/GrowInput";
import ActivityIndicator from "../components/ActivityIndicator";
import AppFadeIn from "../components/AppFadeIn";
import ThemeContext from "../config/ThemeContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const CreateNewCollection = ({ setModalVis, modalVis, callBack }) => {
  const { addNewCollection } = useContext(FeedContext);
  const theme = useContext(ThemeContext);

  const [text, setText] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const textInputRef = useRef(null);

  const handleCollBtnPress = () => {
    // POOR VALIDATION;
    if (text.length > 1) {
      const data = {
        name: text,
      };
      setLoading(true);
      addNewCollection(
        data,
        (resData) => {
          setText("");
          setLoading(false);
          callBack(resData);
        },
        (err) => {
          console.log(err);
          setLoading(false);
          setErrMsg(err);
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
    <View style={[styles.content, { backgroundColor: theme.background }]}>
      <AppText style={styles.headerText} size="large" bold>
        New Collection
      </AppText>
      <Separator h={2} />
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
        style={{ alignSelf: "center", marginTop: 20 }}
      />

      <ActivityIndicator
        visible={loading}
        wTransparent
        type="spin"
        style={styles.activityNew}
      />
    </View>
  );
};

export const CollectionCard = ({ index, onPress, item }) => {
  const navigation = useNavigation();
  let colNum;
  index % 2 == 0 ? (colNum = 1) : (colNum = 2);

  const onCardPress = () => {
    onPress ? onPress(item) : navigation.navigate("Collection", { item });
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onCardPress}>
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

export const RenderCollections = ({
  collections,
  onPress,
  noPadding = false,
}) => {
  return (
    <FlatList
      data={collections}
      contentContainerStyle={{
        paddingBottom: height * (noPadding ? 0 : 0.11),
      }}
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
      renderItem={({ item, index }) => (
        <CollectionCard onPress={onPress} item={item} index={index} />
      )}
    />
  );
};

const SavedCollectionScreen = () => {
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const { updateMe } = useContext(AuthContext);

  const [myCollections, setMyCollections] = useState(userInfo.my_collections);
  const [modalVis, setModalVis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createdNewCollection = (collections) => {
    setMyCollections(collections);
    setModalVis(false);
    updateMe(collections, "my_collections");
  };

  useEffect(() => {
    setMyCollections(userInfo.my_collections);
  }, [userInfo]);

  return (
    <Screen style={styles.container}>
      <AppHeader
        title="Saved Collection"
        RightComponent={() => (
          <TouchableOpacity
            style={styles.newCollBtn}
            onPress={() => setModalVis(true)}
          >
            <Feather name="plus" color={colors.primary} size={20} />
          </TouchableOpacity>
        )}
      />

      <AppText style={styles.textInfo}>
        You have &nbsp;
        <AppText bold size="large">
          {myCollections.length}
        </AppText>
        &nbsp; collections
      </AppText>
      <RenderCollections collections={myCollections} />
      <AppFadeIn
        visible={modalVis}
        setVisible={setModalVis}
        RenderComponent={() => (
          <CreateNewCollection
            setIsLoading={setIsLoading}
            setModalVis={setModalVis}
            callBack={createdNewCollection}
            modalVis={modalVis}
            setMyCollections={setMyCollections}
          />
        )}
      />

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
    width: "100%",
    height: height * 0.8,
    borderRadius: 20,
  },
  activityNew: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
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
    marginBottom: 15,
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
    padding: 10,
    paddingRight: 0,
  },
});
export default SavedCollectionScreen;
