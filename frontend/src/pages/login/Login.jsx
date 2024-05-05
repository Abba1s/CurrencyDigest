import React from "react";
import Input from "../../components/globals/Input";
import Button from "../../components/globals/Button";
import { useFormik } from "formik";
import { loginSchema } from "../../schemas/signupSchema";
import { loginUser } from "../../api/internalApi";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const { values, errors, touched, handleChange, handleBlur } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  const handleLogin = async () => {
    const data = {
      username: values.username,
      password: values.password,
    };
    const response = await loginUser(data);
    if (response.status == 200) {
      navigate("/");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center bg-red-200">
        <p className="text-[2rem] font-semibold  ">Login</p>
        <label htmlFor="username">Username</label>
        <Input
          type="text"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.username}
          placeholder="Enter Username"
          name="username"
        />
        {touched.username && errors.username ? (
          <div>{errors.username}</div>
        ) : null}

        <label htmlFor="password">Password</label>
        <Input
          type="password"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          placeholder="Enter Password"
          name="password"
        />
        {touched.password && errors.password ? (
          <div>{errors.password}</div>
        ) : null}

        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
};

export default Login;
