import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useFormikContext } from "formik";

import AppText from "./AppText";
import AppPickerItem from "./AppPickerItem";
import Separator from "./Separator";
import colors from "../constants/colors";
import grabApi from "../api/grabApi";
import ThemeContext from "../config/ThemeContext";
import PopDropDown from "./PopDropDown";
const screen = Dimensions.get("window");

const CreateFormAdd = ({
  headerA,
  headerB,
  headerC,
  name,
  headerD,
  typeTagUpdate,
  list,
  dropDownA = [],
  numColumns = 3,
  headerE,
  type1,
  handleChange,
  type2,
  onPush,
  onRemove,
}) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  const [dropDown, setDropDown] = useState({ modal: false, close: false });
  const [selectedList, setSelectedList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [tagList, setTagList] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);
  const [searchRes, setSearchRes] = useState([]);
  const [picked, setPicked] = useState({});

  const searchShows = async (term) => {
    if (list === "shows") {
      try {
        const response = await grabApi.post(
          "/shows",
          { q: term },
          {
            headers: {
              "Cache-Control": "no-cache,no-store,must-revalidate",
              Pragma: "no-cache",
              Expires: 0,
            },
          }
        );
        setSearchRes(response.data);
      } catch (err) {
        setSearchRes(err.response.data);
      }
    } else if (list === "groups") {
      try {
        const response = await grabApi.post(
          "/group",
          { q: term, show: values.show },
          {
            headers: {
              "Cache-Control": "no-cache,no-store,must-revalidate",
              Pragma: "no-cache",
              Expires: 0,
            },
          }
        );
        setSearchRes(response.data);
      } catch (err) {
        setSearchRes(err.response.data);
      }
    }
  };

  const named = picked.name_j || picked.name || picked.name_e;
  const tagListName = [...selectedTag].join(" ");
  const theme = useContext(ThemeContext);

  const onChangeSearch = (text) => {
    setUserInput(text);
    if (userInput.length > 2) {
      searchShows(userInput);
    }
  };

  const pickShow = (item) => {
    if (list === "shows") {
      setFieldValue(name, item._id);
      setPicked(item);
      setSearchRes([]);
      setUserInput("");
    } else if (list === "groups") {
      const search = groupList.find((obj) => obj.name === item.name);
      if (!search) {
        setGroupList([...groupList, item]);
        onPush(item.name);
        setSearchRes([]);
        setUserInput("");
      }
    }
  };

  const handleNavigation = () => {
    if (list === "shows") {
      handleChange({ character: false, show: true, group: false }, userInput);
    } else if (list === "groups") {
      handleChange({ character: false, show: false, group: true }, userInput);
    }
  };

  const handleDropdown = (title) => {
    if (title.length < 2) {
      return;
    }

    const search = selectedList.find((obj) => obj.tag === title);
    if (!search && selectedList.length < 3) {
      setSelectedList([
        ...selectedList,
        { id: Math.random() * 100000, tag: title },
      ]);
      onPush(title);
    }
  };

  const resetSearch = () => {
    setPicked({});
    setFieldValue(name, null);
  };

  const handleFormAdd = () => {
    if (userInput.length < 2) {
      return;
    }

    setSelectedList([
      ...selectedList,
      { id: Math.random() * 100000, tag: userInput },
    ]);
    onPush(userInput);
    setUserInput("");
  };

  const handleDelete = (id, index) => {
    const filtered = selectedList.filter((eachObj) => eachObj.id !== id);
    setSelectedList(filtered);
    onRemove(index);
  };

  const handleSelectedTag = (name) => {
    const copyArr = [...selectedTag];
    const listArr = [...tagList];
    const ind = copyArr.findIndex((tag) => tag === name);
    const indList = listArr.findIndex((obj) => obj.name === name);
    if (ind > -1) {
      /// THERE'S A MATCH
      listArr[indList] = {
        name,
        selected: false,
      };
      copyArr.splice(ind, 1);
      setTagList(listArr);
      setSelectedTag(copyArr);
    } else {
      /// NO MATCH
      if (selectedTag.length > 1) return;
      listArr[indList] = {
        name,
        selected: true,
      };
      setTagList(listArr);
      copyArr.push(name);
      setSelectedTag(copyArr);
    }
  };

  const renderTagLists = ({ item }) => {
    if (item.name === "") return null;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.tag}
        onPress={() => handleSelectedTag(item.name)}
      >
        {!item.selected ? (
          <MaterialCommunityIcons
            name="close-circle"
            size={17}
            color={colors.medium}
          />
        ) : (
          <MaterialCommunityIcons
            name="check-circle"
            size={17}
            color={colors.primary}
          />
        )}
        <AppText bold style={{ marginLeft: 3 }}>
          {item.name}
        </AppText>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (typeTagUpdate) {
      const tagsArr = [...values.name.split(" "), ...values.other_names];
      const newTagArr = [];
      for (let i = 0; i < tagsArr.length; i++) {
        const e = tagsArr[i];
        if (selectedTag.includes(e)) {
          newTagArr.push({ selected: true, name: e });
        } else {
          newTagArr.push({ selected: false, name: e });
        }
      }
      setTagList(newTagArr);
    }
  }, [values]);

  useEffect(() => {
    if (typeTagUpdate) {
      setFieldValue("dpName", tagListName);
    }
  }, [selectedTag]);

  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <AppText bold>
          {" "}
          {headerA
            ? "Character's " + headerA + ":"
            : headerB
            ? "Character " + headerB + ":"
            : headerC
            ? "Show's " + headerC + ":"
            : headerD
            ? "Show " + headerD + ":"
            : headerE
            ? "Group's " + headerE + ":"
            : "Group " + headerD + ":"}
        </AppText>
      </View>
      {typeTagUpdate && (
        <View style={styles.tagTextCont}>
          <FlatList
            data={tagList}
            keyExtractor={(item, index) => item + index}
            renderItem={renderTagLists}
            horizontal
          />
        </View>
      )}
      <View
        style={{
          ...styles.inputContainer,
          backgroundColor: theme.extralight,
          alignItems: "center",
        }}
      >
        {typeTagUpdate && <AppText bold>{tagListName}</AppText>}
        {!selectedTag[0] && typeTagUpdate && (
          <AppText style={{ color: colors.medium }}>
            Please select at least a tag
          </AppText>
        )}
        {type1 && (
          <TextInput
            placeholder={headerA || headerB || headerC || headerD || headerE}
            style={[styles.input, { color: theme.color }]}
            onChangeText={(text) => setUserInput(text)}
            value={userInput}
          />
        )}
        {type1 && (
          <TouchableOpacity style={styles.plusIcon} onPress={handleFormAdd}>
            <MaterialCommunityIcons
              name="plus-circle"
              color={colors.primary}
              size={19}
            />
          </TouchableOpacity>
        )}
        {/*   CHANGES - Try to make type 2 logic into a different componenet */}
        {type2 && (
          <TouchableOpacity
            style={styles.dropDownCont}
            onPress={() => setDropDown({ modal: true, close: false })}
          >
            <AppText style={styles.dropDownText}>Pick genres</AppText>
            <View style={styles.chevron}>
              <MaterialCommunityIcons
                name="chevron-down"
                color={colors.medium}
                size={16}
              />
            </View>
          </TouchableOpacity>
        )}
        {type2 && (
          <>
            <PopDropDown
              setter={() => setDropDown({ modal: false, close: false })}
              visible={dropDown.modal}
              close={dropDown.close}
              headerTitle={headerA || headerB || headerC || headerD || headerE}
              RenderComponent={() => (
                <View style={styles.modalContainer}>
                  <FlatList
                    data={dropDownA}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 15 }}
                    renderItem={({ item }) => (
                      <AppPickerItem
                        text={item.title}
                        desc={item.discription}
                        example={item.example}
                        onPress={() => {
                          setDropDown({ modal: false, close: true });
                          handleDropdown(item.title);
                        }}
                      />
                    )}
                    numColumns={numColumns}
                    listKey="dropDown"
                  />
                </View>
              )}
            />
          </>
        )}
        {list && (
          <TextInput
            placeholder={headerA || headerB || headerC || headerD || headerE}
            style={[styles.input, { color: theme.color }]}
            onChangeText={onChangeSearch}
            value={userInput}
          />
        )}
      </View>

      {errors[name] && touched[name] && (
        <AppText style={{ color: "red" }}> {errors[name]} </AppText>
      )}

      <View style={styles.tags}>
        <FlatList
          data={selectedList}
          style={{ flexDirection: "row", flexWrap: "wrap" }}
          listKey={({ i }) => i.toString()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  ...styles.tagTextCont,
                  backgroundColor: theme.light,
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => handleDelete(item.id, index)}
                >
                  <View style={styles.closeIcon}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={19}
                      color={colors.medium}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <AppText numberOfLines={3} bold>
                  {item.tag}{" "}
                </AppText>
              </View>
            );
          }}
        />

        <FlatList
          data={groupList}
          listKey={({ i }) => i.toString()}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View
              style={[styles.searchList, { backgroundColor: theme.unchange }]}
            >
              <TouchableWithoutFeedback
                onPress={() => handleDelete(item.id, index)}
              >
                <View style={styles.closeIcon}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={19}
                    color={colors.medium}
                  />
                </View>
              </TouchableWithoutFeedback>
              <AppText style={styles.searchText}> {item.name} </AppText>
            </View>
          )}
        />
        {list && named && (
          <View
            style={[styles.searchList, { backgroundColor: theme.unchange }]}
          >
            <TouchableWithoutFeedback onPress={resetSearch}>
              <View style={styles.closeIcon}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={19}
                  color={colors.medium}
                />
              </View>
            </TouchableWithoutFeedback>
            <AppText style={styles.searchText}>{picked.name_j}</AppText>
          </View>
        )}
      </View>
      {list && (
        <View style={[styles.searchRes, { backgroundColor: theme.extralight }]}>
          {Array.isArray(searchRes) && (
            <FlatList
              data={searchRes}
              ListHeaderComponent={
                <View>
                  {searchRes.length > 0 ? (
                    <View style={styles.searchHeader}>
                      <AppText
                        bold
                        style={{
                          textAlign: "center",
                          textTransform: "capitalize",
                          marginLeft: 20,
                        }}
                      >
                        Select {list.slice(-list.length, -1)}
                      </AppText>
                      <TouchableWithoutFeedback
                        style={styles.exitSearchCont}
                        onPress={() => setSearchRes("gone")}
                      >
                        <View style={styles.exitSearch}>
                          <MaterialCommunityIcons
                            name="close-circle"
                            size={19}
                            color={colors.medium}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  ) : searchRes.length < 1 && typeof searchRes !== "string" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginRight: 12,
                      }}
                    >
                      {userInput.length > 3 ? (
                        <View
                          style={{
                            padding: 10,
                            justifyContent: "center",
                          }}
                        >
                          <AppText style={styles.errText}>
                            <AppText style={styles.errTextb}>
                              {list.slice(-list.length, -1)}
                            </AppText>{" "}
                            not found, please create {userInput}{" "}
                            {list.slice(-list.length, -1)} before proceeding
                          </AppText>
                        </View>
                      ) : null}
                      {userInput.length > 3 ? (
                        <TouchableOpacity
                          onPress={handleNavigation}
                          style={styles.searchAdd}
                        >
                          <MaterialCommunityIcons
                            name="arrow-right-bold-circle"
                            size={17}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              }
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      disabled={!item.verified}
                      onPress={() => pickShow(item)}
                    >
                      <Separator m={5} />
                      <View
                        style={[styles.tagTextCont, { paddingVertical: 20 }]}
                      >
                        <View style={styles.selectIcon}>
                          <FontAwesome5
                            name="dot-circle"
                            color={colors.primary}
                            size={12}
                          />
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <AppText
                            numberOfLines={3}
                            style={styles.searchText}
                            bold
                          >
                            {item.name_j && item.name_e !== "none"
                              ? `${item.name_j} ( ${item.name_e} )`
                              : item.name_j
                              ? item.name_j
                              : item.name_e
                              ? item.name_e
                              : item.name}
                          </AppText>
                          {!item.verified && (
                            <AppText
                              bold
                              style={{
                                color: colors.heartLight,
                                marginLeft: 10,
                              }}
                            >
                              {" "}
                              unverified{" "}
                            </AppText>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </>
                );
              }}
              listKey={({ i }) => i.toString()}
            />
          )}
        </View>
      )}
      {typeof searchRes === "string" && searchRes !== "gone" ? (
        <AppText style={styles.errText}> {searchRes} </AppText>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 11,
  },

  closeIcon: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  exitSearch: {
    alignItems: "flex-end",
    padding: 8,
    borderRadius: 50,
  },

  errText: {
    color: "red",
    marginLeft: 10,
    fontSize: 10,
  },
  errTextb: {
    fontSize: 10,
    textTransform: "capitalize",
  },
  headerTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropDownCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  chevron: {
    paddingHorizontal: 10,
  },
  dropDownText: {
    padding: 13,
    color: colors.medium,
    fontSize: 10,
    textTransform: "capitalize",
  },
  plusIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    borderRadius: 100,
  },
  inputContainer: {
    width: "80%",
    minHeight: 55,
    maxHeight: 100,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    marginLeft: 14,
    justifyContent: "center",
    borderRadius: 9,
    overflow: "hidden",
  },
  modalContainer: {
    height: screen.height * 0.75,
  },

  modalBtn: {
    width: "40%",
    marginTop: 10,
    alignSelf: "center",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.09)",
  },
  modalWrapper: {
    flex: 1,
  },
  modalOuter: {
    flex: 0.43,
    // top: screen.height * 0.25,
    backgroundColor: "rgba(0,0,0,0.09)",
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 12,
    fontFamily: "sans-regular",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginRight: 6,
    paddingVertical: 20,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  tagTextCont: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    paddingVertical: 10,
    paddingRight: 13,
    borderRadius: 6,
  },
  searchList: {
    flexDirection: "row",
    backgroundColor: colors.unChange,
    height: 40,
    alignItems: "center",
    borderRadius: 8,
    paddingRight: 20,
    margin: 5,
  },
  selectIcon: {
    marginLeft: 14,
  },
  searchAdd: {
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  searchRes: {
    backgroundColor: colors.extraLight,
    borderRadius: 10,
    marginTop: 5,
  },
  searchText: {
    textTransform: "capitalize",
    marginLeft: 8,
  },
  searchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default CreateFormAdd;
