import moment from "moment";

export const getLoggedinUsername = (user) => {
  if (user.userType === "donar") {
    return user.name;
  }
  if (user.userType === "hospital") {
    return user.hospitalName;
  }
  if (user.userType === "organization") {
    return user.organizationName;
  }
};

export const getAntdInputValidation = (message = "required") => {
  return [{ required: true, message: message }];
};

export const getDateFormat = (date) => {
  return moment(date).format("D MMM YYYY hh:mm A");
};
