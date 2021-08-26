import Input from "../Input/Input";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { useState } from "react";
import { isEmpty, isEmail, isLength, isMatch } from "../helper/validate";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  name: "",
  email: "",
  password: "",
  cf_password: "",
};

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(initialState);
  const { name, email, password, cf_password } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    setVisible(!visible);
  };

  const register = async (e) => {
    e.preventDefault();
    // check fields
    if (isEmpty(name) || isEmpty(password))
      return toast("Please fill in all fields.", {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    // check email
    if (!isEmail(email))
      return toast("Please enter a valid email address.", {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    // check password
    if (isLength(password))
      return toast("Password must be at least 6 characters.", {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    // check match
    if (!isMatch(password, cf_password))
      return toast("Password did not match.", {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      toast(res.data.msg, {
        className: "toast-success",
        bodyClassName: "toast-success",
      });
    } catch (err) {
      toast(err.response.data.msg, {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    }
    handleReset();
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setData({ ...data, name: "", email: "", password: "", cf_password: "" });
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={register}>
        <Input
          type="text"
          text="Name"
          name="name"
          handleChange={handleChange}
        />
        <Input
          type="text"
          text="Email"
          name="email"
          handleChange={handleChange}
        />
        <Input
          name="password"
          type={visible ? "text" : "password"}
          icon={visible ? <MdVisibility /> : <MdVisibilityOff />}
          text="Password"
          handleClick={handleClick}
          handleChange={handleChange}
        />
        <Input
          name="cf_password"
          type={visible ? "text" : "password"}
          icon={visible ? <MdVisibility /> : <MdVisibilityOff />}
          text="Confirm Password"
          handleClick={handleClick}
          handleChange={handleChange}
        />
        <div className="login_btn">
          <button type="submit">register</button>
        </div>
      </form>
    </>
  );
};

export default Register;
