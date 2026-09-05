import axiosInstance from "../axiosInstance";
import ENDPOINTS from "../endpoints";

export const getfeedbackapi = () => {
  return axiosInstance.get(ENDPOINTS.Getfeedback.Feedback);
};
