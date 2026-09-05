import axiosInstance from "../axiosInstance";
import ENDPOINTS from "../endpoints";

export const loginApi = (accountID: string, password: string) => {
  return axiosInstance.post(ENDPOINTS.AUTH.LOGIN, {
    accountID,
    password,
  });
};