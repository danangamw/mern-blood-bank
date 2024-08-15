import { axiosInstance } from ".";

export const AddInventory = (data) => {
  return axiosInstance("post", "inventory/add", data);
};

export const GetInventory = () => {
  return axiosInstance("get", "inventory/get");
};
