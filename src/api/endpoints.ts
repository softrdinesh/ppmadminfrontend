const ENDPOINTS = {
  AUTH: {
    LOGIN: "/Account/Login",
  },
   Getfeedback: {
    Feedback: "/Feedback/GetFeedbacklist",
  },
   Feedback: {
    ReplyFeedback: (type: string, id: number | string) =>
      `/Feedback/ReplyFeedback/${type}/${id}`,
  },
  Getfeedbackhistory: {
    Feedback: "/Feedback/GetFeedbacklist",
  },

//payment
 Getpaymenthistoryapi: {
    Payment: "/Payment/GetPaymentlist",
  },








};

export default ENDPOINTS;