import React from "react";
import { useFormikContext } from "formik";

import AppButton from "./AppButton";

const SubmitButton = ({ setLoading, disabled, title, bared, style }) => {
  const { handleSubmit } = useFormikContext();

  return (
    <AppButton
      bare={bared}
      title={title}
      disabled={disabled}
      style={style}
      onPress={handleSubmit}
    />
  );
};

export default SubmitButton;
