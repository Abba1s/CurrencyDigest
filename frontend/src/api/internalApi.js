import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const registerUser = async (data) => {
  try {
    const response = await api.post("/register", data);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await api.post("/login", data);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
