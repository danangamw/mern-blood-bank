import { axiosAuthInstance, axiosInstance } from ".";

export const LoginUser = async (payload) => {
  const response = await axiosAuthInstance("post", "users/login", payload);
  return response;
};

export const RegisterUser = async (payload) => {
  const response = await axiosAuthInstance("post", "users/register", payload);
  return response;
};

export const GetCurrentUser = async () => {
  const response = await axiosInstance("get", "users/getCurrentUser");
  return response;
};

export const GetAllDonarsOfAnOrganization = () => {
  return axiosInstance("get", `users/get-all-donars`);
};

export const GetAllHospitalOfAnOrganization = () => {
  return axiosInstance("get", `users/get-all-hospitals`);
};

export const GetAllOrganizationsOfDonar = () => {
  return axiosInstance("get", `users/get-all-organizations-donar`);
};
