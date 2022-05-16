import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";

import AppText from "./AppText";
import Screen from "./Screen";
import colors from "../constants/colors";

// ========== FILES ===========
import narutoChibi from "../../assets/arts/naruto_2.png";
import leviChibi from "../../assets/arts/levi_1.png";
import luffyChibi from "../../assets/arts/luffy_1.png";
import togaChibi from "../../assets/arts/toga_1.png";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const HomeArr = [
  {
    id: "ifhdfoih",
    text: "spacer",
  },
  {
    id: "9686981",
    title: "Weebo welcomes You!",
    text: "Hello Weeb, Weebo welcomes you to the Manga and Anime community of degenerate weebs just like you \n Have fun and connect with your fellow weebs in this Beta version, a more stable version of the app will be released soon",
    bg: "#C45D33",
    image: narutoChibi,
  },
  {
    id: "2986",
    title: "Weebo Instances",
    text: "Weebo Instances represents existing Anime or Manga Series, Characters, Groups and even your own Channels \n These Weebo Instances will be managed by you when created, or won in Challenges. \n Please do not create existing instance as they will not be verified and consequently removed",
    bg: "#A40D4E",
    // bg: "#9E6B59",
    image: togaChibi,
  },
  {
    id: "986082",
    title: "Weebo on Android",
    text: "Yo weeb, Weebo is currently only available on the android platform. \n The team is working really hard for the iOS platform, please be patient and stay updated",
    bg: "#77472E",
    image: leviChibi,
  },
  {
    id: "276",
    title: "Support Weebo",
    text: "You can support the Weebo team to help improve this app. \n The Weebo developer team requires support for a better app management and user experience",
    bg: colors.facebook,
    image: luffyChibi,
  },
  {
    id: "sshsi",
    text: "spacer",
  },
];

const CONTENT_WIDTH = width;

const AppSlider = ({ visible, sliderData = HomeArr, goCallBackFunc }) => {
  if (!sliderData) return null;

  const flatRef = useRef(null);
  const modalTranslator = useRef(new Animated.Value(-height)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const theme = useContext(ThemeContext);

  const dotsTranslator = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: [-5, width * 0.07 + 11],
  });

  const handleCloseModal = () => {
    Animated.timing(modalTranslator, {
      toValue: height,
      useNativeDriver: true,
    }).start(() => {
      goCallBackFunc && goCallBackFunc();
    });
  };

  const RenderDots = () => {
    const closeOpaciter = scrollX.interpolate({
      inputRange: [0, width, width * 3 - 20, width * 3],
      outputRange: [width, width, width, 1],
      extrapolate: "clamp",
    });
    return (
      <>
        <View
          style={{
            ...styles.dotsContainer,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              ...styles.dotsContainer,
            }}
          >
            {HomeArr.slice(2).map((item, idx) => {
              return <View style={styles.dots} key={idx} />;
            })}
          </View>
          <Animated.View
            style={{
              ...styles.dots,
              backgroundColor: colors.primary,
              width: width * 0.08,
              position: "absolute",
              transform: [{ translateX: dotsTranslator }],
            }}
          />
          <Animated.View
            style={{
              position: "absolute",
              left: width / 2.1,
              transform: [{ translateX: closeOpaciter }],
            }}
          >
            <TouchableOpacity
              onPress={handleCloseModal}
              activeOpacity={0.8}
              style={styles.btn}
            >
              <AppText style={{ color: colors.white }} bold>
                CLOSE
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </>
    );
  };

  const RenderBoxContent = ({ item, index }) => {
    if (item.text == "spacer") return <View style={styles.spacer} />;
    const contentTranslator = scrollX.interpolate({
      inputRange: [
        (index - 2) * CONTENT_WIDTH,
        (index - 1) * CONTENT_WIDTH,
        index * CONTENT_WIDTH,
      ],
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });
    const imageTranslator = scrollX.interpolate({
      inputRange: [
        (index - 2) * CONTENT_WIDTH,
        (index - 1) * CONTENT_WIDTH,
        index * CONTENT_WIDTH,
      ],
      outputRange: [0.1, 1, 0.1],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          ...styles.box,
          backgroundColor: item.bg,
          transform: [{ scale: contentTranslator }],
        }}
      >
        <AppText
          style={{ color: colors.white, textAlign: "center" }}
          size="xxlarge"
          bold
        >
          {item.title}
        </AppText>
        <AppText style={styles.text} size="large">
          {item.text}
        </AppText>
        <Animated.Image
          source={item.image}
          resizeMode="contain"
          resizeMethod="scale"
          style={{
            ...styles.image,
            transform: [{ scale: imageTranslator }],
          }}
        />
      </Animated.View>
    );
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(modalTranslator, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Screen
        style={{
          marginTop: 10,
          opacity: modalTranslator.interpolate({
            inputRange: [-height, 0, height],
            outputRange: [0, 1, 0],
          }),
        }}
      >
        <Animated.View
          style={{
            ...styles.container,
            transform: [{ translateY: modalTranslator }],
            opacity: modalTranslator.interpolate({
              inputRange: [-height, 0],
              outputRange: [0, 1],
            }),
          }}
        >
          <Animated.FlatList
            data={HomeArr}
            keyExtractor={(item) => item.id}
            renderItem={RenderBoxContent}
            horizontal
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            snapToInterval={CONTENT_WIDTH}
            overScrollMode="never"
            bounces={false}
            ref={flatRef}
            decelerationRate={0.02}
            snapToAlignment="center"
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />
          <RenderDots />
        </Animated.View>
      </Screen>
    </Modal>
  );
};
const styles = StyleSheet.create({
  box: {
    width: width * 0.97,
    height: height * 0.89,
    backgroundColor: colors.primary,
    padding: 10,
    alignItems: "center",
    marginRight: width * 0.03,
    justifyContent: "space-around",
    borderRadius: width * 0.03,
    elevation: 1.5,
  },
  boxContainer: {
    width: width * 0.96,
    height: height * 0.85,
  },
  btn: {
    padding: 12,
    backgroundColor: colors.heart,
    borderRadius: 12,
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dots: {
    width: width * 0.07,
    height: width * 0.01,
    borderRadius: 21,
    backgroundColor: colors.light,
    margin: 8,
  },
  footer: {
    flexDirection: "row",
    width,
    justifyContent: "space-around",
    alignItems: "center",
  },
  headerContainer: {
    width,
    marginLeft: 30,
  },
  image: {
    width: width * 0.6,
    height: height * 0.32,
  },
  spacer: {
    width: width * 0.015,
    height: 200,
  },
  text: {
    color: colors.white,
    width: width * 0.72,
    textAlign: "center",
    lineHeight: 30,
  },
});

export default AppSlider;
