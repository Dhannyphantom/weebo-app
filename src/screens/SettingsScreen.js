import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  FlatList,
  Switch,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventRegister } from "react-native-event-listeners";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import colors from "../constants/colors";
import PopDropDown from "../components/PopDropDown";
import AlertModal from "../components/AlertModal";
import ThemeContext from "../config/ThemeContext";
import { ads_keywords, settingsData } from "../constants/data_store";
import { ADS_ID } from "./ChallengePointScreen";
import PopMessage from "../components/PopMessage";

const { width, height } = Dimensions.get("window");

const alertData = {
  visible: false,
  title: "Delete Account",
  message: "Oh no! , You really want to delete your account?",
  btn: "YES",
  type: "delete_account",
};

const rewarded = RewardedAd.createForAdRequest(ADS_ID, {
  requestNonPersonalizedAdsOnly: false,
  keywords: ads_keywords,
});

const getAdsAlert = (count, visible = false) => ({
  visible: visible,
  title: "Unlock Dark Theme",
  message: `Watch a few ads and unlock the amazing dark theme \n\n ${count} times left`,
  btn: "YES",
  type: "ads_watched",
});

const SettingDropDown = ({ data, section, handlers }) => {
  const [popData, setPopData] = useState({
    vis: false,
    data: data.options,
    default: data.default,
  });
  const [alertModal, setAlertModal] = useState(alertData);

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
          case "book":
            console.log("HOW TO USE");
            break;

          case "account":
            console.log("Account");
            break;
        }
        break;
    }
  };
  const handleOkAlert = () => {
    console.log("Deleted");
  };

  const RenderDropDowns = () => {
    //
    const handleChooseOption = (item) => {
      setPopData({ ...popData, default: item });
      handlers.editSettings(section.title, "Language", item);
    };

    const renderLists = ({ item }) => {
      const isDefault = item === popData.default;
      return (
        <TouchableOpacity
          onPress={() => handleChooseOption(item)}
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
      activeOpactity={0.98}
      onPress={handleAction}
      style={{ padding: 12 }}
    >
      {data.type === "dropdown" && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText size="large" style={{ textTransform: "capitalize" }}>
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
          <MaterialCommunityIcons
            name={data.options}
            size={width * 0.04}
            color={colors.primary}
          />
        </View>
      )}
      <PopDropDown
        visible={popData.vis}
        RenderComponent={RenderDropDowns}
        setter={() => setPopData({ vis: false, data: data.options })}
        headerTitle="Languages"
      />
      <AlertModal
        obj={alertModal}
        setVisible={setAlertModal}
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

const RenderSections = ({ item, section, editSettings }) => {
  const theme = useContext(ThemeContext);
  const [isEnabled, setIsEnabled] = useState(item.default);
  const [popper, setPopper] = useState({ vis: false });
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
    if (alert.type === "ads_watched") {
      if (adsManager.count > 0) {
        if (adsManager.loaded) {
          rewarded.show();
        } else {
          setPopper({
            vis: true,
            type: "failed",
            msg: "Ad is stll loading...",
          });
          rewarded.load();
        }
      }
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
    <View style={[styles.itemContainer, { backgroundColor: theme.background }]}>
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

          {(item.type === "dropdown" || item.type === "action") && (
            <SettingDropDown
              data={item}
              section={section}
              handlers={{ editSettings }}
            />
          )}
        </View>
      </View>
      <AlertModal obj={alert} setVisible={setAlert} onPress={handleAlert} />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
    </View>
  );
};

const SettingsScreen = () => {
  const [settings, setSettings] = useState([]);

  const readyScreen = async () => {
    const getSettings = await AsyncStorage.getItem("settings");
    if (getSettings) {
      setSettings(JSON.parse(getSettings));
      // await AsyncStorage.setItem("settings", JSON.stringify(settingsData));
    } else {
      setSettings(settingsData);
      await AsyncStorage.setItem("settings", JSON.stringify(settingsData));
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
    borderWidth: 0.8,
    borderColor: colors.primary,
    elevation: 1.8,
    borderRadius: width * 0.025,
    marginVertical: width * 0.01,
    minHeight: width * 0.2,
    alignSelf: "center",
  },
});
export default SettingsScreen;
