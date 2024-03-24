import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { FieldArray, useFormikContext } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import uuid from "react-native-uuid";

import CreateFormAdd from "./CreateFormAdd";
import AppText from "./AppText";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";
import AppButton from "./AppButton";
import { capFirstLetter } from "../constants/helpers";

const PropInfoField = ({
  data,
  handleInfoFieldAction,
  handleCheckValueChange,
}) => {
  // data = {title, name}
  const [fieldInfo, setFieldInfo] = useState({
    title: data.title,
    name: data.name,
    id: data.id,
  });

  const [bools, setBools] = useState({
    isAdded: false,
    shouldShowEditBtn: false,
  });

  const theme = useContext(ThemeContext);

  const onValueChange = (newVal, type) => {
    setFieldInfo({ ...fieldInfo, [type]: newVal });
    !bools.shouldShowEditBtn && setBools({ ...bools, shouldShowEditBtn: true });
  };

  const handleFieldActions = (type) => {
    switch (type) {
      case "save":
      case "edit":
        if (fieldInfo.title.length < 1 && fieldInfo.name.length < 1) return;
        // GO ahead and add these fields to forms
        setBools({ ...bools, isAdded: true, shouldShowEditBtn: false });
        handleInfoFieldAction(fieldInfo, type);
        break;

      case "remove":
        handleInfoFieldAction(fieldInfo.id, "remove");
        break;
    }
  };

  useEffect(() => {
    if (handleCheckValueChange(fieldInfo)) {
      setBools({ ...bools, shouldShowEditBtn: false });
    }
  }, [fieldInfo]);

  return (
    <View style={styles.fieldInputWrapper}>
      <View style={styles.fieldContainer}>
        <TextInput
          placeholder="New field title"
          style={[
            styles.inputTitle,
            { color: theme.color, backgroundColor: theme.extralight },
          ]}
          onChangeText={(newVal) => onValueChange(newVal, "title")}
          value={fieldInfo.title}
        />
        <TextInput
          placeholder="New field name"
          style={[
            styles.inputName,
            { color: theme.color, backgroundColor: theme.extralight },
          ]}
          onChangeText={(newVal) => onValueChange(newVal, "name")}
          value={fieldInfo.name}
        />
      </View>
      <View style={styles.fieldActionBtns}>
        {bools.shouldShowEditBtn && (
          <AppButton
            title={bools.isAdded ? "EDIT" : "SAVE"}
            LIcon={bools.isAdded ? "book-edit-outline" : "plus"}
            btnColor={bools.isAdded ? colors.warningLight : colors.primary}
            onPress={() => handleFieldActions(bools.isAdded ? "edit" : "save")}
            naked
          />
        )}
        <AppButton
          title="REMOVE"
          btnColor={colors.heartLight}
          LIcon="minus"
          onPress={() => handleFieldActions("remove")}
          naked
        />
      </View>
    </View>
  );
};

const AddPropInfoField = ({ name, placeHolderTitle }) => {
  const [fields, setFields] = useState([]);

  const { setFieldValue } = useFormikContext();
  const theme = useContext(ThemeContext);

  const onAddNewField = () => {
    // Check if there is an object with no details
    if (fields[0]) {
      // an item is present
      const checker = fields.find(
        (obj) => obj.title.length < 1 && obj.name.length < 1
      );
      if (!checker) {
        // then add new fields
        setFields([...fields, { title: "", name: "", id: uuid.v4() }]);
      }
    } else {
      // add new fields
      setFields([...fields, { title: "", name: "", id: uuid.v4() }]);
    }
  };

  const handleInfoFieldAction = (fieldData, type) => {
    switch (type) {
      case "remove":
        // Remove field also from FormData
        const newFields = fields.filter(
          (fieldItem) => fieldItem.id !== fieldData
        );
        setFields(newFields);
        setFieldValue(
          name,
          newFields.map((fieldItm) => ({
            title: fieldItm.title,
            name: fieldItm.name,
          }))
        );
        break;
      case "save":
        const newFieldsArr = fields.map((fieldItem) => {
          if (fieldItem.id == fieldData.id) {
            return fieldData;
          } else {
            return fieldItem;
          }
        });
        setFields(newFieldsArr);
        // return console.log(newFieldsArr);
        setFieldValue(
          name,
          newFieldsArr.map((fieldItm) => ({
            title: fieldItm.title,
            name: fieldItm.name,
          }))
        );
        break;
      case "edit":
        const editedFieldsArr = fields.map((fieldItem) => {
          if (fieldItem.id == fieldData.id) {
            return fieldData;
          } else {
            return fieldItem;
          }
        });
        setFields(editedFieldsArr);

        return console.log(
          editedFieldsArr.map((fieldItm) => ({
            title: fieldItm.title,
            name: fieldItm.name,
          }))
        );
        setFieldValue(
          name,
          editedFieldsArr.map((fieldItm) => ({
            title: fieldItm.title,
            name: fieldItm.name,
          }))
        );
        break;
      case "add":
        setFields([...fields, fieldData]);
        break;
    }
  };

  const handleCheckValueChange = (fieldData) => {
    const checker = [...fields].some(
      (fieldObj) =>
        fieldObj.title.toLowerCase() === fieldData.title.toLowerCase() &&
        fieldObj.name.toLowerCase() === fieldData.name.toLowerCase()
    );
    return Boolean(checker);
  };

  const renderFields = fields.map((fieldObj) => {
    return (
      <PropInfoField
        data={fieldObj}
        key={fieldObj.id}
        fieldName={name}
        handleCheckValueChange={handleCheckValueChange}
        handleInfoFieldAction={handleInfoFieldAction}
      />
    );
  });

  return (
    <View>
      <View style={styles.fieldHeader}>
        <AppText
          bold
          style={{ ...styles.fieldTitle, backgroundColor: theme.extralight }}
        >
          {capFirstLetter(placeHolderTitle)}
        </AppText>
        <TouchableOpacity
          style={{ padding: 10 }}
          activeOpacity={1}
          onPress={onAddNewField}
        >
          <MaterialCommunityIcons
            name="plus-box-multiple"
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
      <View>{renderFields}</View>
    </View>
  );
};

const CreateFormArray = ({
  name,
  list,
  type1,
  type2,
  formType,
  placeHolderTitle,
  typeTagUpdate,
  handleChange,
  dropdown,
  ...otherProps
}) => {
  if (formType == "addInput") {
    return (
      <AddPropInfoField
        name={name}
        {...otherProps}
        placeHolderTitle={placeHolderTitle}
      />
    );
  } else {
    return (
      <FieldArray
        name={name}
        render={(filedArrayProps) => {
          const { push, remove } = filedArrayProps;
          return (
            <CreateFormAdd
              type1={type1}
              list={list}
              dropDownA={dropdown}
              formType={formType}
              type2={type2}
              typeTagUpdate={typeTagUpdate}
              onRemove={(index) => remove(index)}
              onPush={(value) => push(value)}
              handleChange={handleChange}
              name={name}
              {...otherProps}
            />
          );
        }}
      />
    );
  }
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    marginRight: "5%",
  },
  fieldActionBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  fieldTitle: {
    marginLeft: 10,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 18,
    maxWidth: "85%",
  },
  fieldInputWrapper: {
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 12,
    paddingBottom: 10,
  },
  inputTitle: {
    flex: 0.35,
    fontFamily: "sans-bold",
    paddingLeft: 16,
    width: "80%",
    minHeight: 55,
    maxHeight: 100,
    padding: 8,
    borderWidth: 1,
    textTransform: "capitalize",
    borderColor: "#ddd",
    borderRadius: 9,
    overflow: "hidden",
  },
  inputName: {
    flex: 0.65,
    marginLeft: 12,
    fontFamily: "sans-regular",
    width: "80%",
    textTransform: "capitalize",
    minHeight: 55,
    maxHeight: 100,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 9,
    overflow: "hidden",
  },
});

export default CreateFormArray;
