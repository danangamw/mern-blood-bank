import axios from "axios";

export const axiosInstance = async (method, endpoint, payload) => {
  try {
    const response = await axios({
      method,
      url: `http://localhost:5000/api/${endpoint}`,
      data: payload,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    return error;
  }
};

export const axiosAuthInstance = async (method, endpoint, payload) => {
  try {
    const response = await axios({
      method,
      url: `http://localhost:5000/api/${endpoint}`,
      data: payload,
    });

    return response.data;
  } catch (error) {
    return error;
  }
};
