import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  Easing,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppButton from "./AppButton";

import AppText from "./AppText";
import Screen from "./Screen";
import colors from "../constants/colors";

// ========== FILES ===========
import narutoChibi from "../../assets/arts/naruto_2.png";
import leviChibi from "../../assets/arts/levi_1.png";
import luffyChibi from "../../assets/arts/luffy_1.png";
import togaChibi from "../../assets/arts/toga_1.png";
import { FlatList } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const HomeArr = [
  // {
  //   id: "ifhdfoih",
  //   text: "spacer",
  // },
  {
    id: "9686981",
    title: "Welcome to Otaku Socials (Beta)",
    text: "Hello Weeb, Otaku Socials welcomes you to the Anime community where you get to create Otaku Instances and challenge others \n Have fun and connect with your fellow weebs in this Beta version, Official version of the app will be released very soon",
    bg: "#C45D33",
    image: narutoChibi,
  },
  {
    id: "2986",
    title: "Otaku Instances",
    text: "Otaku Instances represents existing Anime or Manga Series, Characters, Groups and even your own Channels \n These Otaku Instances will be managed by you when created, or won in Challenges. \n So please do not create already created instance as they will not be verified and removed",
    bg: "#A40D4E",
    // bg: "#9E6B59",
    image: togaChibi,
  },
  {
    id: "986082",
    title: "Otaku Socials on Android",
    text: "Yo weeb, Otaku Social is currently only available on the android platform. \n The team is working really hard for the iOS platform, please be patient and stay updated",
    bg: "#77472E",
    image: leviChibi,
  },
  {
    id: "276",
    title: "Support Otaku Social",
    text: "You can support the Otaku team to help improve this app. \n The Otaku developer team is in need of your support for a better app management and user experience",
    bg: colors.facebook,
    image: luffyChibi,
  },
  {
    id: "sshsi",
    text: "spacer",
  },
];

const AppSlider = ({ visible, sliderData = HomeArr, goCallBackFunc }) => {
  if (!sliderData) return null;
  const [slideIndex, setSlideIndex] = useState(0);
  // const [visibility, setVisibility] = useState(false);

  const slider = useRef(new Animated.Value(0)).current;
  const sliderBack = useRef(new Animated.Value(-width)).current;
  const imageTranslator = useRef(new Animated.Value(0.2)).current;
  const modalTranslator = useRef(new Animated.Value(-height)).current;

  const isLastSlide = slideIndex === sliderData.length - 1;
  const isFirstSlide = slideIndex === 0;

  const handleNextBtn = (type) => {
    const sliderLength = sliderData.length - 1;
    if (type === "next") {
      if (isLastSlide) {
        handleCloseModal();
      }
      if (slideIndex >= sliderLength) return;
      Animated.parallel([
        Animated.spring(imageTranslator, {
          toValue: 0.2,
          useNativeDriver: true,
        }),
        Animated.timing(slider, {
          toValue: -width,
          duration: 400,
          easing: Easing.circle,
          useNativeDriver: true,
        }),
      ]).start(() => {
        //
        setSlideIndex(slideIndex + 1);
        slider.setValue(0);
      });
    } else {
      if (slideIndex <= 0) return;
      Animated.parallel([
        Animated.spring(imageTranslator, {
          toValue: 0.2,
          useNativeDriver: true,
        }),
        Animated.timing(sliderBack, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSlideIndex(slideIndex - 1);
        sliderBack.setValue(-width);
      });
    }
  };

  const handleCloseModal = () => {
    Animated.timing(modalTranslator, {
      toValue: height,
      useNativeDriver: true,
    }).start(() => {
      goCallBackFunc && goCallBackFunc();
    });
  };

  const RenderDots = ({ data, index }) => {
    const bgColor = sliderData[index].bg;
    return (
      <View
        style={{
          ...styles.dots,
          backgroundColor: index == slideIndex ? bgColor : colors.light,
        }}
      />
    );
  };

  const RenderBoxContent = ({ item }) => {
    if (item.text == "spacer") return <View style={styles.spacer} />;

    return (
      <View
        style={{
          ...styles.box,
          backgroundColor: item.bg,
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
          style={{
            ...styles.image,
          }}
        />
      </View>
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

  useEffect(() => {
    Animated.spring(imageTranslator, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [slideIndex]);

  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <Screen
        style={{
          backgroundColor: colors.black,
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
          <FlatList
            data={HomeArr}
            keyExtractor={(item) => item.id}
            renderItem={RenderBoxContent}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />
        </Animated.View>
      </Screen>
    </Modal>
  );
};
const styles = StyleSheet.create({
  box: {
    width: width * 0.97,
    height: height * 0.9,
    backgroundColor: colors.primary,
    padding: 10,
    marginHorizontal: width * 0.08,
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: width * 0.03,
    elevation: 1.5,
  },
  boxContainer: {
    width: width * 0.96,
    height: height * 0.85,
  },
  btn: {
    // backgroundColor: "cyan",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
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
    height: width * 0.005,
    borderRadius: width * 0.9,
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
  headerText: {},
  image: {
    width: width * 0.6,
    height: height * 0.32,
  },
  spacer: {
    width: width * 0.1,
    height: 200,
    backgroundColor: colors.accent,
  },
  text: {
    color: colors.white,
    width: width * 0.72,
    textAlign: "center",
    lineHeight: 30,
  },
});

export default AppSlider;

/*
 <View style={styles.boxContainer}>
            {sliderData
              .map((item, idx) => {
                return (
                  <RenderBoxContent
                    item={item}
                    slideIndexer={slideIndex}
                    indexer={idx}
                    key={idx}
                  />
                );
              })
              .reverse()}
          </View>
          <View style={styles.footer}>
            {!isFirstSlide ? (
              <TouchableOpacity
                onPress={() => handleNextBtn("prev")}
                activeOpacity={0.8}
                style={styles.btn}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  color={sliderData[slideIndex].bg}
                  size={width * 0.07}
                />
                <AppText style={{ color: sliderData[slideIndex].bg }} bold>
                  PREV
                </AppText>
              </TouchableOpacity>
            ) : (
              <View style={{ width: width * 0.1 }} />
            )}
            <View style={styles.dotsContainer}>
              {sliderData.map((dot, idx) => {
                return <RenderDots data={dot} index={idx} key={idx} />;
              })}
            </View>
            <TouchableOpacity
              onPress={() => handleNextBtn("next")}
              activeOpacity={0.8}
              style={styles.btn}
            >
              <AppText style={{ color: sliderData[slideIndex]?.bg }} bold>
                {isLastSlide ? "GO" : "NEXT"}
              </AppText>
              {!isLastSlide && (
                <MaterialCommunityIcons
                  name="chevron-right"
                  color={sliderData[slideIndex].bg}
                  size={width * 0.07}
                />
              )}
            </TouchableOpacity>
          </View>

          ////////////////////////////////
            const RenderBoxContent = ({ indexer, item, slideIndexer }) => {
    let translator = 0;

    if (indexer == slideIndexer) {
      translator = slider;
    } else if (indexer == slideIndexer - 1) {
      translator = sliderBack;
    } else if (indexer < slideIndexer) {
      return null;
    }

    return (
      <Animated.View
        style={{
          ...styles.box,
          position: "absolute",
          transform: [{ translateX: translator }],

          backgroundColor: item.bg,
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
          style={{
            ...styles.image,
            opacity: imageTranslator.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            transform: [
              {
                scale: imageTranslator,
              },
            ],
          }}
        />
      </Animated.View>
      );
    }
*/
