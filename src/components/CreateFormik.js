import React from "react";
import { Formik } from "formik";

const CreateFormik = ({
  children,
  validationSchema,
  initialValues,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
      {() => <>{children}</>}
    </Formik>
  );
};

export default CreateFormik;
