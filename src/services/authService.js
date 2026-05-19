import API from "../api";

const LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT || "/auth/login";
const REGISTER_ENDPOINT =
  import.meta.env.VITE_REGISTER_ENDPOINT || "/auth/register";

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong"
  );
};

const normalizeAuthResponse = (data) => {
  const token = data.token || data.accessToken || data.jwt;
  const user = data.user || data.data?.user || data.data;

  return {
    token,
    user,
    message: data.message,
  };
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await API.post(LOGIN_ENDPOINT, { email, password });
    const data = normalizeAuthResponse(response.data);

    if (!data.token) {
      throw new Error("Login response did not include a token");
    }

    return data;
  } catch (error) {
    throw getErrorMessage(error);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await API.post(REGISTER_ENDPOINT, userData);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error);
  }
};
