import axiosInstance from "../axiosInstance";
import ENDPOINTS from "../endpoints";


export const Getpaymenthistoryapi = () => {
  return axiosInstance.get(ENDPOINTS.Getpaymenthistoryapi.Payment);
};
