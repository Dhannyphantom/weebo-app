import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFormikContext } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";

import colors from "../constants/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";
import AppPickerItem from "./AppPickerItem";
import ThemeContext from "../config/ThemeContext";
import { calender } from "../constants/data_store";
import PopDropDown from "./PopDropDown";

const screen = Dimensions.get("window");

const months = calender.months.map((obj) => obj.full);
const CreateForm = ({
  headerA,
  headerB,
  headerC,
  headerD,
  headerE,
  headerF,
  headerZ,
  header,
  numColumns = 3,
  dateTime,
  dateTime2,
  grow,
  add = "",
  place = "",
  close,
  placeholder,
  dropdownA,
  curr,
  selectedItem,
  mutable,
  pass,
  name,
  onSelectItem,
}) => {
  const [dropDown, setDropDown] = useState(false);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(
    dateTime2 ? new Date("January 1, 2000") : new Date()
  );
  const [height, setHeight] = useState("");
  const [myDate, setMydate] = useState("Currently airing");
  const [modalStatus, setModalStatus] = useState("open");

  const { handleChange, errors, setFieldTouched, setFieldValue, touched } =
    useFormikContext();

  let addition = headerA
    ? headerA + place
    : headerB
    ? headerB + place
    : headerC
    ? headerC + place
    : headerD
    ? headerD + place
    : headerE
    ? headerE + place
    : headerF
    ? headerF + place
    : headerZ
    ? headerZ + place
    : place;

  const theme = useContext(ThemeContext);

  const today = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  const tY = today.getFullYear();
  const tM = today.getMonth();
  const tD = today.getDate();

  let dateDisplay = dateTime2 ? `${months[m]} ${d}` : `${months[m]} ${y}`;

  useEffect(() => {
    if (curr && y == tY && m == tM) {
      setFieldValue(name, myDate);
    } else {
      setMydate(dateDisplay);
    }
  }, []);

  const handleDate = (e, selectedDate) => {
    const datePick = selectedDate || date;
    setShow(false);

    if (e.type !== "dismissed") {
      const y = datePick.getFullYear();
      const m = datePick.getMonth();
      const d = datePick.getDate();
      const milli = today.getTime();
      const newMilli = e.nativeEvent.timestamp;
      let dateDisplay;
      if (dateTime && !dateTime2 && newMilli >= milli) {
        dateDisplay = "Currently airing";
      } else if (dateTime && dateTime2 && newMilli < milli) {
        // birthdays
        dateDisplay = `${months[m]} ${d} `;
      } else if (dateTime2 && dateTime && newMilli >= milli) {
        dateDisplay = `${months[tM]} ${tD}`;
      } else if (!dateTime2 && dateTime && newMilli < milli) {
        // show dates
        dateDisplay = `${months[m]} ${y}`;
      }
      setDate(datePick);
      setMydate(dateDisplay);
      setFieldValue(name, datePick);
    }
  };

  return (
    <View style={styles.container}>
      <AppText style={{ marginBottom: 5 }} bold>
        {headerA
          ? "Character's " + headerA + add + ":"
          : headerB
          ? "Character " + headerB + add + ":"
          : headerC
          ? "Show's " + headerC + add + ":"
          : headerD
          ? "Show " + headerD + add + ":"
          : headerE
          ? "Group's " + headerE + add + ":"
          : headerF
          ? "Group " + headerF + add + ":"
          : headerZ
          ? "Your " + headerZ + add + ":"
          : header}
      </AppText>
      <View
        style={{
          ...styles.inputContainer,
          height: Math.max(40, height),
          backgroundColor:
            placeholder && !grow ? theme.unchange : theme.extralight,
        }}
      >
        {!placeholder &&
          !dropdownA &&
          !grow &&
          !mutable &&
          !pass &&
          !(dateTime || dateTime2) && (
            <TextInput
              placeholder={addition}
              placeholderTextColor={colors.medium}
              onBlur={() => setFieldTouched(name)}
              style={[styles.input, { color: theme.color }]}
              onChangeText={handleChange(name)}
            />
          )}
        {placeholder && !grow && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 10,
            }}
          >
            <TextInput
              placeholder={placeholder + place}
              onBlur={() => setFieldTouched(name)}
              style={[styles.inputTwo, { color: theme.color }]}
              placeholderTextColor={theme.color}
              editable={false}
            />
            {close && (
              <TouchableOpacity onPress={close} activeOpacity={0.7}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={18}
                  color={colors.heart}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        {mutable && (
          <TextInput
            placeholder={mutable + place}
            onBlur={() => setFieldTouched(name)}
            style={[styles.input, { color: theme.color }]}
            placeholderTextColor={colors.medium}
            onChangeText={handleChange(name)}
          />
        )}
        {pass && (
          <TextInput
            placeholder={headerZ ? headerZ + place : place}
            onBlur={() => setFieldTouched(name)}
            style={[styles.input, { color: theme.color }]}
            placeholderTextColor={colors.medium}
            onChangeText={handleChange(name)}
            secureTextEntry
          />
        )}
        {grow && (
          <TextInput
            style={[styles.inputGrow, { color: theme.color }]}
            placeholder={placeholder}
            maxLength={80}
            numberOfLines={4}
            multiline
            onChangeText={handleChange(name)}
            onContentSizeChange={({ nativeEvent }) =>
              setHeight(nativeEvent.contentSize.height)
            }
          />
        )}
        {dropdownA ? (
          <TouchableOpacity
            style={styles.dropDownCont}
            onPress={() => setDropDown(true)}
          >
            <AppText style={styles.dropDownText}>
              {selectedItem ? selectedItem.title : headerB || headerA}
            </AppText>
            <View style={styles.chevron}>
              <MaterialCommunityIcons
                name="chevron-down"
                color={colors.medium}
                size={16}
              />
            </View>
          </TouchableOpacity>
        ) : null}
        {dateTime ? (
          <TouchableOpacity
            style={styles.dropDownCont}
            onPress={() => setShow(true)}
          >
            <AppText style={styles.dropDownText}>{myDate}</AppText>
            <View style={styles.chevron}>
              <MaterialCommunityIcons
                name="chevron-down"
                color={colors.medium}
                size={16}
              />
            </View>
            {show && (
              <DateTimePicker
                value={date}
                textColor={colors.primary}
                display="default"
                mode="date"
                onChange={handleDate}
              />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      {errors[name] && touched[name] && (
        <AppText style={styles.error}> {errors[name]} </AppText>
      )}
      {dropdownA && (
        <PopDropDown
          visible={dropDown}
          setter={() => setDropDown(false)}
          closer={() => modalStatus}
          closeCallback={setModalStatus}
          RenderComponent={() => (
            <>
              <AppButton
                title="Close"
                style={styles.modalBtn}
                bare
                onPress={() => setModalStatus("close")}
              />
              <FlatList
                data={dropdownA}
                keyExtractor={(item) => item.id}
                listKey="selectDrop"
                renderItem={({ item }) => (
                  <AppPickerItem
                    text={item.title}
                    desc={item.description}
                    example={item.example}
                    onPress={() => {
                      setModalStatus("close");
                      // return console.log("Help");
                      onSelectItem(item);
                      setFieldValue(name, item.title);
                    }}
                  />
                )}
                numColumns={numColumns}
              />
            </>
          )}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  chevron: {
    paddingHorizontal: 10,
  },
  dropDownCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropDownText: {
    paddingLeft: 15,
    color: colors.medium,
    textTransform: "capitalize",
  },
  error: {
    color: colors.heartDark,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
  },

  inputContainer: {
    width: "80%",
    marginLeft: 15,
    minHeight: 55,
    maxHeight: 100,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  inputGrow: {
    flex: 1,
    marginLeft: 10,
    padding: 5,
    fontFamily: "sans-regular",
    lineHeight: 25,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 15,
    fontFamily: "sans-regular",
    marginLeft: 12,
  },
  inputTwo: {
    flex: 1,
    paddingVertical: 15,
    fontFamily: "sans-regular",
    height: "100%",
    marginLeft: 12,
  },
  modalContainer: {
    backgroundColor: colors.white,
    top: screen.height * 0.25,
    elevation: 4,
    flex: 1,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },
  modalComp: {
    // flex: 1,
  },

  modalBtn: {
    width: "40%",
    marginTop: 10,
    alignSelf: "center",
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.09)",
  },
});
export default CreateForm;
