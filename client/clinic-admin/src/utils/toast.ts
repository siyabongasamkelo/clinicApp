import { toast } from "react-toastify";

export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message || "Something went wrong!"),
  info: (message: string) => toast.info(message),
  // Use toast.promise for your login/API calls to handle loading->success automatically
  promise: (apiCall, messages: string) => toast.promise(apiCall, messages),
};
