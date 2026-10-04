import toast from "react-hot-toast";
import ToastCard from "./ToastCard";

const show = (type) => (message) => toast.custom((t) => <ToastCard t={t} type={type} message={message} />);

const showToast = {
  success: show("success"),
  error: show("error"),
  info: show("info"),
  match: show("match"),
};

export default showToast;
