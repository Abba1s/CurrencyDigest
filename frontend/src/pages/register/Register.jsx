import React from "react";
import Input from "../../components/globals/Input";
// import Button from "../../components/globals/Button";
import { useFormik } from "formik";
import { signupSchema } from "../../schemas/signupSchema";
import { registerUser } from "../../api/internalApi";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const { values, errors, touched, handleChange, handleBlur } = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
  });

  const handleRegister = async () => {
    const data = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
    };
    const response = await registerUser(data);
    if (response) {
      navigate("/");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center bg-red-200">
        <p className="text-[2rem] font-semibold ">Register</p>
        <Input
          type="text"
          name="name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.name}
          placeholder="Enter Name"
        />
        {touched.name && errors.name ? <div>{errors.name}</div> : null}
        <Input
          type="text"
          name="username"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.username}
          placeholder="Enter Username"
        />
        {touched.username && errors.username ? (
          <div>{errors.username}</div>
        ) : null}

        <Input
          type="email"
          name="email"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          placeholder="Enter email"
        />
        {touched.email && errors.email ? <div>{errors.email}</div> : null}

        <Input
          type="password"
          name="password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          placeholder="Enter Password"
        />
        {touched.password && errors.password ? (
          <div>{errors.password}</div>
        ) : null}

        <Input
          type="password"
          name="confirmPassword"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.confirmPassword}
          placeholder="Confirm Password"
        />
        {touched.confirmPassword && errors.confirmPassword ? (
          <div>{errors.confirmPassword}</div>
        ) : null}

        <button onClick={handleRegister}>Register</button>
      </div>
    </>
  );
};

export default Register;
