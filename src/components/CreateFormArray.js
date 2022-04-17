import React from "react";
import { View } from "react-native";
import { FieldArray } from "formik";
import CreateFormAdd from "./CreateFormAdd";

const CreateFormArray = ({
  name,
  list,
  type1,
  type2,
  typeTagUpdate,
  handleChange,
  dropdown,
  ...otherProps
}) => {
  return (
    <FieldArray
      name={name}
      render={(filedArrayProps) => {
        const {
          form: { values },
          push,
          remove,
        } = filedArrayProps;
        return (
          <CreateFormAdd
            type1={type1}
            list={list}
            dropDownA={dropdown}
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
};

export default CreateFormArray;
