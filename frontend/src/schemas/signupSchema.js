import * as yup from "yup";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const signupSchema = yup.object({
  name: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().matches(emailRegex, "Give a proper email").required(),
  password: yup
    .string()
    .matches(passwordRegex, "Give a proper Password")
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
});

export const loginSchema = yup.object({
  username: yup.string().required(),
  password: yup
    .string()
    .matches(passwordRegex, "Give a proper Password")
    .required(),
});
