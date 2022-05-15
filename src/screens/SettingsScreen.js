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

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import colors from "../constants/colors";
import PopDropDown from "../components/PopDropDown";
import AlertModal from "../components/AlertModal";
import ThemeContext from "../config/themeContext";

const { width, height } = Dimensions.get("window");

const settingsData = [
  {
    id: "1",
    title: "General",
    data: [
      {
        id: "1",
        name: "Auto video play",
        key: "vid",
        type: "toggle",
        default: false,
      },

      {
        id: "2",
        name: "Language",
        type: "dropdown",
        default: "english",
        options: ["english", "japanese", "french"],
      },
      {
        id: "3",
        name: "Turn on Notifications",
        type: "toggle",
        key: "noti",
        default: true,
      },
    ],
  },
  {
    id: "2",
    title: "Appearance",
    data: [
      {
        id: "1",
        name: "Dark theme mode",
        type: "toggle",
        default: false,
        options: [],
      },
    ],
  },
  {
    id: "3",
    title: "User",
    data: [
      {
        id: "1",
        name: "Delete account",
        type: "action",
        default: null,
        options: "delete",
      },

      {
        id: "2",
        name: "User agreement & App policy",
        type: "action",
        default: "null",
        options: "account",
      },
    ],
  },
];

const alertData = {
  visible: false,
  title: "Delete Account",
  message: "Oh no! , You really want to delete your account?",
  btn: "YES",
  type: "delete_account",
};

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
        {" "}
        {title}{" "}
      </AppText>
    </View>
  );
};

const SettingsScreen = () => {
  const [settings, setSettings] = useState([]);
  const theme = useContext(ThemeContext);

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
    return <RenderSections item={item} section={section} />;
  };

  const RenderSections = ({ item, section }) => {
    const [isEnabled, setIsEnabled] = useState(item.default);

    const handleToggle = () => {
      setIsEnabled((prevBool) => !prevBool);
      editSettings(section.title, item.name, !isEnabled);

      // code
      EventRegister.emit("changeTheme", !isEnabled);
    };

    return (
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

            {(item.type === "dropdown" || item.type === "action") && (
              <SettingDropDown
                data={item}
                section={section}
                handlers={{ editSettings }}
              />
            )}
          </View>
        </View>
      </View>
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
