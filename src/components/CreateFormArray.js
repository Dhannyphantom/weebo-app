import React, { useContext, useState } from "react";
import { View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { FieldArray, useFormikContext } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import uuid from "react-native-uuid";

import CreateFormAdd from "./CreateFormAdd";
import AppText from "./AppText";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";
import AppButton from "./AppButton";

const PropInfoField = ({ data, fieldName, handleInfoFieldAction }) => {
  // data = {title, name}
  const [fieldInfo, setFieldInfo] = useState({
    title: data.title,
    name: data.name,
    id: data.id,
  });

  const [bools, setBools] = useState({ isAdded: false });

  const { setFieldValue } = useFormikContext();

  const theme = useContext(ThemeContext);

  const onValueChange = (newVal, type) => {
    setFieldInfo({ ...fieldInfo, [type]: newVal });
  };

  const handleFieldActions = (type) => {
    switch (type) {
      case "save":
      case "edit":
        // Check if field values are not empty
        if (fieldInfo.title.length < 1 && fieldInfo.name.length < 1) return;
        // GO ahead and add these fields to forms
        setBools({ ...bools, isAdded: true });
        type === "save" && handleInfoFieldAction(fieldInfo, "save");
        setFieldValue(fieldName, fieldInfo);
        break;

      case "remove":
        handleInfoFieldAction(fieldInfo.id, "remove");
        break;
    }
  };

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
        <AppButton
          title={bools.isAdded ? "EDIT" : "SAVE"}
          LIcon="plus"
          onPress={() => handleFieldActions(bools.isAdded ? "edit" : "save")}
          naked
        />
        <AppButton
          title="REMOVE"
          LIcon="minus"
          onPress={() => handleFieldActions("remove")}
          naked
        />
      </View>
    </View>
  );
};

const AddPropInfoField = ({ name }) => {
  const [fields, setFields] = useState([]);

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
        setFields((prevFields) =>
          prevFields.filter((fieldItem) => fieldItem.id === fieldData)
        );

        break;
      case "save":
        setFields((prevFields) =>
          prevFields.map((fieldItem) => {
            if (fieldItem.id == fieldData.id) {
              return fieldData;
            } else {
              return fieldItem;
            }
          })
        );

        break;
      case "add":
        setFields([...fields, fieldData]);
        break;
    }
  };

  const renderFields = fields.map((fieldObj) => {
    return (
      <PropInfoField
        data={fieldObj}
        key={fieldObj.id}
        fieldName={name}
        handleInfoFieldAction={handleInfoFieldAction}
      />
    );
  });

  return (
    <View>
      <View style={styles.fieldHeader}>
        <AppText bold style={{ marginLeft: 10 }}>
          Add fields or props
        </AppText>
        <TouchableOpacity
          style={{ padding: 10 }}
          activeOpacity={0.1}
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
  typeTagUpdate,
  handleChange,
  dropdown,
  ...otherProps
}) => {
  return (
    <FieldArray
      name={name}
      render={(filedArrayProps) => {
        const { push, remove } = filedArrayProps;
        if (formType == "addInput") {
          return <AddPropInfoField name={name} {...otherProps} />;
        } else {
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
        }
      }}
    />
  );
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
    marginRight: "30%",
  },
  fieldActionBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
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
    borderColor: "#ddd",
    borderRadius: 9,
    overflow: "hidden",
  },
  inputName: {
    flex: 0.65,
    marginLeft: 12,
    fontFamily: "sans-regular",
    width: "80%",
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
