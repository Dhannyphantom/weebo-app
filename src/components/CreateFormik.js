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
      validationSchema={validationSchema}
    >
      {() => <>{children}</>}
    </Formik>
  );
};

export default CreateFormik;
