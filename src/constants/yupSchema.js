import * as Yup from "yup";

//    BELOW WILL CREATE A NEW METHOD FOR YOU
Yup.addMethod(Yup.string, "oneWord", function () {
  return this.test(
    "one-word",
    `Field should not contain whitespace`,
    function (value) {
      const whitespaceIndex = value?.indexOf(" ");
      if (
        value &&
        whitespaceIndex > -1 &&
        whitespaceIndex != value.length - 1
      ) {
        return false;
      } else {
        return true;
      }
    }
  );
});

// Yup.addMethod(Yup.string, "strengthen", function () {
//   return this.test(
//     "strengthen-pass",
//     `Password should contain an uppercase, lowercase and a number`,
//     function (value) {
//       const tests = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
//     }
//   );
// });

const editValidationSchema = Yup.object().shape({
  oldPass: Yup.string().min(4).trim().label("Password"),
  newPass: Yup.string()
    .min(4)
    .trim()
    .lowercase()
    .label("Password")
    .when("oldPass", {
      is: (val) => val && val.length > 3,
      then: Yup.string().required(),
    }),
  confirmPass: Yup.string()
    .when("newPass", {
      is: (val) => val && val.length > 3,
      then: Yup.string().required(),
    })
    .oneOf([Yup.ref("newPass"), null], "New passwords do not match")
    .label("Password"),
});

const validationSchemaLogin = Yup.object().shape({
  username: Yup.string().oneWord().required().label("Email or username").min(4),
  password: Yup.string().min(4).required().label("Password"),
});
const validationSchemaRegister = Yup.object().shape({
  username: Yup.string().oneWord().required().min(4).max(15).label("Username"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().min(4).required().label("Password"),
  gender: Yup.string()
    .min(4)
    .required()
    .matches(/^male$|^female$/i, "Gender should either be a male or female")
    .label("Gender"),
});

const characterValidationSchema = Yup.object().shape({
  name: Yup.string().required().lowercase().trim().min(2).label("First name"),
  dpName: Yup.string().required().lowercase().trim().label("Display name"),
  second_name: Yup.string()
    .optional()
    .lowercase()
    .trim()
    .min(3)
    .label("Last name"),
  show: Yup.string()
    .required()
    .lowercase()
    .trim()
    .min(3)
    .nullable()
    .label("Show"),
  role: Yup.string().required().lowercase().trim().min(3).label("Role"),
  type: Yup.string().required().lowercase().trim().min(3).label("Type"),
  height: Yup.string()
    .required()
    .lowercase()
    .trim()
    .min(3)
    .matches(/[0-9]+.+[0-9]cm/, "Height should be in cm e.g 182.0cm")
    .label("Height"),
  birthday: Yup.string().required().lowercase().trim().min(3).label("Birthday"),
  voiceActor: Yup.array()
    .label("Sister")
    .of(Yup.string().min(2).lowercase().trim()),
  father: Yup.string().min(3).lowercase().trim().label("Father"),
  mother: Yup.string().min(3).lowercase().trim().label("Mother"),
  gender: Yup.string()
    .lowercase()
    .trim()
    .required()
    .min(3)
    .matches(/male|female/i, "Gender should either be a male or female")
    .label("Gender"),
  sisters: Yup.array()
    .label("Sister")
    .of(Yup.string().min(2).lowercase().trim()),
  brothers: Yup.array()
    .label("Brother")
    .of(Yup.string().min(2).lowercase().trim()),
  lover: Yup.string().min(3).label("Lover").lowercase().trim(),
  rival: Yup.string().min(3).label("Rival").lowercase().trim(),
  cover_photo: Yup.object()
    .shape({
      uri: Yup.string().max(255),
      width: Yup.number(),
      height: Yup.number(),
    })
    .required("Please upload a cover image")
    .label("Cover image"),
  groups: Yup.array().label("Group").of(Yup.string().min(2).lowercase().trim()),
});

/// SHOULD MAKE NAME_J REQUIRED IF NAME_E IS EMPTY AND VICE VERSA
const showValidationschema = Yup.object().shape({
  name_j: Yup.string().min(3).trim().lowercase().optional(),
  name_e: Yup.string().min(3).trim().lowercase().optional(),
  other_names: Yup.array()
    .of(Yup.string().min(3).lowercase().trim())
    .notRequired(),
  app_creator: Yup.string().notRequired(),
  spinoffs: Yup.array().of(Yup.string().min(3).lowercase().trim()),
  creator: Yup.string().required().min(3).trim().lowercase(),
  releaseDate: Yup.string().required(),
  endDate: Yup.string().required(),
  genres: Yup.array().of(Yup.string().min(3).lowercase().trim()),
  subGenres: Yup.array().of(Yup.string().min(3).lowercase().trim()),
  episodes: Yup.number().min(1),
  cover_photo: Yup.object()
    .shape({
      uri: Yup.string().max(255),
      width: Yup.number(),
      height: Yup.number(),
    })
    .required("Please upload a cover image")
    .label("Cover image"),
});

const groupValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required()
    .min(3)
    .max(255)
    .trim()
    .lowercase()
    .label("Name"),
  show: Yup.string()
    .required()
    .min(3)
    .max(255)
    .trim()
    .lowercase()
    .label("Show"),
  leader: Yup.string()
    .required()
    .min(3)
    .max(255)
    .trim()
    .lowercase()
    .label("Leader"),

  cover_photo: Yup.object()
    .shape({
      uri: Yup.string().max(255),
      width: Yup.number(),
      height: Yup.number(),
    })
    .required("Please upload a cover image")
    .label("Cover image"),
});

const channelValidation = Yup.object().shape({
  name: Yup.string().required().oneWord().min(3).max(25).trim().label("Name"),
  description: Yup.string()
    .required()
    .min(3)
    .max(255)
    .trim()
    .label("Description"),
  cover_photo: Yup.object()
    .shape({
      uri: Yup.string().max(255),
      width: Yup.number(),
      height: Yup.number(),
    })
    .required("Please upload a cover image")
    .label("Cover image"),
});

export default {
  showValidationschema,
  characterValidationSchema,
  validationSchemaLogin,
  validationSchemaRegister,
  editValidationSchema,
  channelValidation,
  groupValidationSchema,
};
