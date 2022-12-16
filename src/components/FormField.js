import React from "react";
import { useFormikContext } from "formik";

import Input from "./Input";
import AppText from "./AppText";

const FormField = ({ icon, pass, onPress, name, ...otherProps }) => {
  const { setFieldTouched, handleChange, touched, errors } = useFormikContext();
  return (
    <>
      <Input
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        onChange={() => setFieldTouched(name, false, true)}
        autoCompleteType="off"
        {...otherProps}
        icon={icon}
        pass={pass}
        onPress={onPress}
      />
      {touched[name] && errors[name] && (
        <AppText style={{ color: "red" }}>{errors[name]}</AppText>
      )}
    </>
  );
};

export default FormField;
// {touched[name] ? (
//   <AppText style={{ color: "red" }}> {errors[name]} </AppText>
// ) : null}
