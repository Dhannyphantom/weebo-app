import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  FlatList,
  Switch,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventRegister } from "react-native-event-listeners";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import * as Device from "expo-device";
import { Context as AuthContext } from "../config/AuthContext";
import * as Linking from "expo-linking";

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import colors from "../constants/colors";
import PopDropDown from "../components/PopDropDown";
import AlertModal from "../components/AlertModal";
import ThemeContext from "../config/ThemeContext";
import {
  ads_keywords,
  buymeacoffeeLink,
  paydayLink,
  settingsData,
} from "../constants/data_store";
import { ADS_ID } from "./ChallengePointScreen";
import PopMessage from "../components/PopMessage";
import AppFadeIn from "../components/AppFadeIn";
import { app_policy } from "../constants/data_store";
import AppButton from "../components/AppButton";

//
import buymeacoffeeImage from "../../assets/arts/bmac_button.png";
import paydayLogo from "../../assets/arts/payday.webp";

const { width, height } = Dimensions.get("window");

const alertData = {
  visible: false,
  title: "Delete Account",
  message: "Crap!. Type in your username to delete account, but think twice!",
  btn: "YES",
  type: "delete_account",
};

const rewarded = RewardedAd.createForAdRequest(
  Device.isDevice ? ADS_ID : TestIds.REWARDED,
  {
    requestNonPersonalizedAdsOnly: false,
    keywords: ads_keywords,
  }
);

const getAdsAlert = (count, visible = false) => ({
  visible: visible,
  title: "Dark Theme",
  message: `Watch few ads to unlock the smooth dark theme\n${count} ads left`,
  btn: "YES",
  type: "ads_watched",
});

const RenderTermItem = ({ title, detail }) => {
  const theme = useContext(ThemeContext);
  return (
    <View>
      <AppText bold size="large" style={styles.termTitle}>
        {title}
      </AppText>
      <View style={[styles.termDetail, { backgroundColor: theme.extralight }]}>
        <AppText>{detail}</AppText>
      </View>
    </View>
  );
};

const RenderTerms = ({ setter }) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={[styles.terms, { backgroundColor: theme.background }]}>
      <FlatList
        data={app_policy}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RenderTermItem title={item.name} detail={item.detail} />
        )}
        ListFooterComponent={() => (
          <AppButton
            style={styles.termBtn}
            title="I Accept"
            onPress={setter}
            bare
          />
        )}
      />
    </View>
  );
};

const RenderSupportWeebo = ({ setter }) => {
  const theme = useContext(ThemeContext);

  const onLinkPress = (link) => {
    Linking.openURL(link);
    setter && setter();
  };

  return (
    <View
      style={{
        width: width * 0.8,
        backgroundColor: theme.background,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 30,
      }}
    >
      <AppText
        size="xlarge"
        style={{ marginTop: 15, textTransform: "uppercase", marginBottom: 15 }}
        bold
      >
        Support Weebo!
      </AppText>
      <AppText
        style={{
          textAlign: "center",
          width: "80%",
          marginBottom: 30,
        }}
      >
        Please support the weebo team for a better app experience and the
        release of the iOS version
      </AppText>
      <TouchableOpacity
        onPress={() => onLinkPress(buymeacoffeeLink)}
        activeOpacity={1}
      >
        <Image
          source={buymeacoffeeImage}
          resizeMode="contain"
          style={{ width: 300, height: 60 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onLinkPress(paydayLink)}
        style={{
          backgroundColor: "#14171C",
          paddingVertical: 20,
          borderRadius: 15,
          marginTop: 8,
        }}
      >
        <Image
          source={paydayLogo}
          resizeMode="contain"
          style={{ width: 300, height: 25 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const SettingDropDown = ({ data, section, handlers }) => {
  const [popData, setPopData] = useState({
    vis: false,
    data: data.options,
    default: data.default,
  });
  const [alertModal, setAlertModal] = useState(alertData);
  const [termsModal, setTermsModal] = useState({ vis: false, close: false });
  const [supportModal, setSupportModal] = useState({
    vis: false,
    close: false,
  });

  const {
    state: { userInfo },
    signOut,
    deleteUserAccount,
  } = useContext(AuthContext);

  const handleAction = () => {
    switch (data.type) {
      case "dropdown":
        setPopData({ data: data.options, default: data.default, vis: true });
        break;

      case "action":
        switch (data.options) {
          case "delete":
            setAlertModal({ ...alertData, visible: true });
            break;
          case "account":
            setTermsModal({ vis: true, close: false });
            break;
          case "thumb-up":
            setSupportModal({ vis: true, close: false });
            break;
        }
        break;
    }
  };
  const handleOkAlert = () => {
    deleteUserAccount(
      (resData) => {
        signOut();
      },
      (errData) => {}
    );
  };

  const RenderDropDowns = () => {
    //
    const handleChooseOption = (item) => {
      setPopData({ ...popData, default: item });
      handlers.editSettings(section.title, data.name, item);
    };

    const renderLists = ({ item }) => {
      const isDefault = item === popData.default;

      return (
        <TouchableOpacity
          onPress={() => handleChooseOption(item)}
          disabled={item === "japanese"}
          style={styles.dropdown}
        >
          <AppText style={styles.dropdownText}>{item}</AppText>
          {isDefault && (
            <MaterialCommunityIcons
              name="check-bold"
              size={width * 0.02}
              color={colors.primary}
            />
          )}
          {item === "japanese" && (
            <AppText style={{ color: colors.heartDark }}>
              Not available yet
            </AppText>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <View>
        <FlatList
          data={popData.data}
          keyExtractor={(item, index) => item + index}
          renderItem={renderLists}
          contentContainerStyle={{ padding: 20 }}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.98}
      onPress={handleAction}
      style={{ padding: 12 }}
    >
      {data.type === "dropdown" && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText size="small" style={{ textTransform: "capitalize" }}>
            {data.default}
          </AppText>
          <MaterialCommunityIcons
            name="chevron-down"
            size={width * 0.028}
            color={colors.medium}
          />
        </View>
      )}
      {data.type === "action" && (
        <View>
          <Feather name={data.icon} size={30} color={colors.primary} />
        </View>
      )}
      <PopDropDown
        visible={popData.vis}
        RenderComponent={RenderDropDowns}
        setter={() => setPopData({ vis: false, data: data.options })}
        headerTitle={data.name}
      />
      <AppFadeIn
        visible={termsModal.vis}
        setter={() => setTermsModal({ vis: false, close: false })}
        RenderComponent={() => (
          <RenderTerms
            setter={() => setTermsModal({ ...termsModal, close: true })}
          />
        )}
        disableCloseModal
        closeModal={termsModal}
        disableTouchModal
      />
      <AppFadeIn
        visible={supportModal.vis}
        setter={() => setSupportModal({ vis: false, close: false })}
        RenderComponent={() => (
          <RenderSupportWeebo
            setter={() => setSupportModal({ ...supportModal, close: true })}
          />
        )}
        closeModal={supportModal}
        disableTouchModal
      />
      <AlertModal
        obj={alertModal}
        setVisible={setAlertModal}
        verifyPrompt={userInfo.username}
        onPress={handleOkAlert}
      />
    </TouchableOpacity>
  );
};

const RenderHeader = ({ section: { title } }) => {
  return (
    <View style={styles.headerContainer}>
      <AppText size="xlarge" style={styles.headerText} bold>
        {title}
      </AppText>
    </View>
  );
};

const RenderSections = ({ item, section, setPopper, editSettings }) => {
  const theme = useContext(ThemeContext);
  const [isEnabled, setIsEnabled] = useState(item.default);
  const [adsManager, setAdsManager] = useState({
    count: 3,
    loaded: false,
    loadedOnce: false,
  });
  const [alert, setAlert] = useState(getAdsAlert(adsManager.count));
  // count,
  const isTheme = item.name.includes("theme");

  const handleToggle = async () => {
    // code
    if (isTheme) {
      if (adsManager.count > 0) {
        setAlert(getAdsAlert(adsManager.count, true));
        // EventRegister.emit("changeTheme", !isEnabled);
        return;
      } else {
        EventRegister.emit("changeTheme", !isEnabled);
      }
    }

    setIsEnabled((prevBool) => !prevBool);
    editSettings(section.title, item.name, !isEnabled);
  };

  const handleAlert = async () => {
    switch (alert.type) {
      case "ads_watched":
        if (adsManager.count > 0) {
          if (adsManager.loaded) {
            rewarded.show();
          } else {
            setPopper({
              vis: true,
              type: "success",
              msg: "Loading ads... Try again",
            });
            rewarded.load();
          }
        }
        break;
      case "delete_account":
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (isTheme) {
      async function prepare() {
        const adsStorageStr = await AsyncStorage.getItem("ads_watched");
        if (adsStorageStr) {
          const adsCount = Number(JSON.parse(adsStorageStr));
          setAdsManager({
            ...adsManager,
            count: adsCount,
          });
          if (adsCount > 0) {
            rewarded.load();
          }
        } else {
          rewarded.load();
        }
      }

      prepare();
    }
  }, []);

  useEffect(() => {
    if (!isTheme) return () => {};
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      async () => {
        if (adsManager.loadedOnce) {
          setPopper({
            vis: true,
            type: "success",
            msg: "Ad loaded!",
          });
        }
        const adsStorageStr = await AsyncStorage.getItem("ads_watched");
        let adsCount = 3;
        if (adsStorageStr) {
          adsCount = Number(JSON.parse(adsStorageStr));
        }
        setAdsManager({ count: adsCount, loaded: true, loadedOnce: true });
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        const adsStorageStr = await AsyncStorage.getItem("ads_watched");
        let newCount;
        if (adsStorageStr) {
          newCount = Number(JSON.parse(adsStorageStr)) - 1;
        } else {
          newCount = adsManager.count - 1;
        }
        setAdsManager({
          ...adsManager,
          loaded: false,
          count: newCount,
        });
        await AsyncStorage.setItem("ads_watched", `${newCount}`);
      }
    );

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  return (
    <>
      <View
        style={[styles.itemContainer, { backgroundColor: theme.background }]}
      >
        <View style={styles.eachItem}>
          <AppText> {item.name} </AppText>
          <View>
            {item.type === "toggle" && (
              <Switch
                trackColor={{ false: colors.unChange, true: colors.light }}
                thumbColor={isEnabled ? colors.primary : colors.light}
                ios_backgroundColor={colors.google}
                onValueChange={handleToggle}
                value={isEnabled}
              />
            )}

            {["dropdown", "action"].includes(item.type) && (
              <SettingDropDown
                data={item}
                section={section}
                handlers={{ editSettings }}
              />
            )}
          </View>
        </View>
        <AlertModal obj={alert} setVisible={setAlert} onPress={handleAlert} />
      </View>
    </>
  );
};

const SettingsScreen = () => {
  const [settings, setSettings] = useState([]);
  const [popper, setPopper] = useState({ vis: false });

  const { updateSettings } = useContext(AuthContext);

  const readyScreen = async () => {
    const getSettings = await AsyncStorage.getItem("settings");
    if (getSettings) {
      setSettings(JSON.parse(getSettings));
      // UNCOMMENT LINE BELOW TO REFRESH SETTINGS
      // await AsyncStorage.setItem("settings", JSON.stringify(settingsData));
    } else {
      // There are no previous settings so set to default settings
      setSettings(settingsData);
      await AsyncStorage.setItem("settings", JSON.stringify(settingsData));
      // updateSettings(settingsData);
    }
  };

  const editSettings = async (category, key, value) => {
    const preSettings = [...settings];
    const firstIndex = preSettings.findIndex((item) => item.title === category);

    const preSettingsData = preSettings[firstIndex].data; //an array
    const secondIndex = preSettingsData?.findIndex((item) => item.name === key);
    // EDIT THE OBJECT

    preSettingsData[secondIndex] = {
      ...preSettingsData[secondIndex],
      default: value,
    };

    preSettings[firstIndex].data = preSettingsData;

    await AsyncStorage.setItem("settings", JSON.stringify(preSettings));
    setSettings(preSettings);
  };

  const renderSections = ({ item, section }) => {
    return (
      <RenderSections
        editSettings={editSettings}
        item={item}
        setPopper={setPopper}
        section={section}
      />
    );
  };

  useEffect(() => {
    readyScreen();
  }, []);

  return (
    <Screen style={{ ...styles.container }}>
      <AppHeader title="App Settings" />

      <SectionList
        sections={settings}
        renderSectionHeader={RenderHeader}
        contentContainerStyle={{ paddingBottom: height * 0.1 }}
        keyExtractor={(item) => item.id}
        renderItem={renderSections}
      />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdown: {
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownText: {
    textTransform: "capitalize",
    marginRight: 10,
    padding: 15,
  },
  eachItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "4%",
  },
  headerContainer: {
    marginVertical: 10,
    marginLeft: 10,
  },
  headerText: {
    color: colors.primary,
  },
  itemContainer: {
    width: width * 0.95,
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#ddd",
    elevation: 1.8,
    borderRadius: width * 0.025,
    marginVertical: width * 0.01,
    minHeight: width * 0.2,
    alignSelf: "center",
  },
  terms: {
    width: width * 0.96,
    maxHeight: height * 0.8,
    borderRadius: 15,
    padding: 20,
  },
  termBtn: {
    marginTop: 20,
    marginBottom: 25,
    alignSelf: "center",
  },
  termTitle: {
    textAlign: "center",
    textTransform: "capitalize",
    marginVertical: 15,
  },
  termDetail: {
    width: "98%",
    borderRadius: 15,
    padding: 20,
    alignSelf: "center",
  },
});
export default SettingsScreen;
