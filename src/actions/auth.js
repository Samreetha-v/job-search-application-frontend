import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT,
} from "./types";

import { loginUser, registerUser } from "../services/authService";
import setAuthToken from "../utils/setAuthToken";

export const login = (formData) => async (dispatch) => {
  try {
    const data = await loginUser(formData);
    setAuthToken(data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });

    return true;
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });

    alert(err);
    return false;
  }
};

export const register = (formData,navigate) => async (dispatch) => {
  try {
    await registerUser(formData);

    dispatch({
      type: REGISTER_SUCCESS,
    });

    alert("Registration Successful");
    navigate("/login");
    return true;
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
    });

    alert(err);
    return false;
  }
};

export const logout = () => (dispatch) => {
  setAuthToken(null);

  dispatch({
    type: LOGOUT,
  });
};
