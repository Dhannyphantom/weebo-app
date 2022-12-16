import React from "react";
import { useFormikContext } from "formik";

import AppButton from "./AppButton";

const SubmitButton = ({
  setLoading,
  disabled,
  title,
  bared,
  style,
  extraData,
  ...otherProps
}) => {
  const { handleSubmit } = useFormikContext();

  return (
    <AppButton
      bare={bared}
      title={title}
      disabled={disabled}
      style={style}
      onPress={(formValue) => handleSubmit(formValue, extraData)}
      {...otherProps}
    />
  );
};

export default SubmitButton;
