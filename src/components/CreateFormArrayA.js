import React from "react";
import { View } from "react-native";
import { FieldArray } from "formik";
import CreateFormAdd from "./CreateFormAdd";

const CreateFormArray = ({ name, type1, type2, ...otherProps }) => {
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
            type2={type2}
            onRemove={(index) => remove(index)}
            onPush={(value) => push(value)}
            name={name}
            {...otherProps}
          />
        );
      }}
    />
  );
};

export default CreateFormArray;
