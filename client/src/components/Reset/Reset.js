import { isEmpty, isLength, isMatch } from "../helper/validate";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../Input/Input";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { useState } from "react";

const initialState = {
  password: "",
  cf_password: "",
};

const Reset = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(initialState);
  const { password, cf_password } = data;
  const { token } = useParams();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    setVisible(!visible);
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setData({ ...data, password: "", cf_password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check fields
    if (isEmpty(password) || isEmpty(cf_password))
      return toast("Please fill in all fields.", {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    //check password length
    if (isLength(password))
      return toast("Password must be at least 6 characters.", {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    // password match
    if (!isMatch(password, cf_password))
      return toast("Password did not match", {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    try {
      await axios.post(
        "/api/auth/reset_pass",
        { password },
        {
          headers: { Authorization: token },
        }
      );
      handleReset();
      return toast("Password was successfully changed 🤗", {
        className: "toast-success",
        bodyClassName: "toast-success",
      });
    } catch (err) {
      toast(err.response.data.msg, {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <Input
          name="password"
          type={visible ? "text" : "password"}
          icon={visible ? <MdVisibility /> : <MdVisibilityOff />}
          text="Password"
          handleClick={handleClick}
          handleChange={handleChange}
        />
        <Input
          handleChange={handleChange}
          name="cf_password"
          type={visible ? "text" : "password"}
          icon={visible ? <MdVisibility /> : <MdVisibilityOff />}
          text="Confirm Password"
          handleClick={handleClick}
        />
        <div className="login_btn">
          <button type="submit">reset</button>
        </div>
      </form>
    </>
  );
};

export default Reset;
