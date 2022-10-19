import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThemeContext from "../config/ThemeContext";
import ActivityIndicator from "./ActivityIndicator";
import AppButton from "./AppButton";
import AppText from "./AppText";
import Link from "./Link";
import PopDropDown from "./PopDropDown";

const { width, height } = Dimensions.get("screen");

const Challenger = ({ data, setter }) => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useContext(ThemeContext);
  //   console.log(data);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppText style={styles.title}>
        A chance to be a Weebo Instance Manager by challenging this instance
      </AppText>
      <View style={styles.links}>
        <View style={styles.row}>
          <Link
            style={styles.linkShort}
            name="Image"
            iconName="image-multiple"
            onPress={null}
          />
          <Link
            style={styles.linkShort}
            name="Video"
            iconName="image-multiple"
            onPress={null}
          />
        </View>
        <Link
          style={styles.link}
          name="Invalid information"
          iconName="image-multiple"
          onPress={null}
        />
      </View>
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
      <ActivityIndicator visible={isLoading} style={styles.activity} />
    </View>
  );
};

const ChallengeMedia = () => {
  const theme = useContext(ThemeContext);
  const topper = useSafeAreaInsets().top;

  return (
    <View
      style={[
        styles.media,
        { backgroundColor: theme.background, marginTop: topper },
      ]}
    >
      <AppText>media</AppText>
    </View>
  );
};

export default function InstanceChallenger({ data, visible, setVisible }) {
  const [actions, setActions] = useState({ modal: "open" });
  const closeModal = () => {
    return actions.modal;
  };
  return (
    <PopDropDown
      visible={visible}
      setter={() => {
        setActions({ modal: "open" });
        setVisible(false);
      }}
      closer={closeModal}
      RenderComponent={() => (
        <Challenger
          setter={() => setActions({ ...actions, modal: "close" })}
          data={data}
        />
      )}
      TopperComponent={() => <ChallengeMedia />}
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
  },
  row: {
    flexDirection: "row",
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
  },
});
