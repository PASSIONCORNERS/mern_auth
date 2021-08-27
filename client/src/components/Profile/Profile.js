import { isLength, isMatch } from "../helper/validate";
import Input from "../Input/Input";
import Avatar from "../Avatar/Avatar";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { AiFillCamera } from "react-icons/ai";
import { useContext, useRef, useState } from "react";
import "./profile.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  name: "",
  password: "",
  cf_password: "",
};

const Profile = () => {
  const inputFile = useRef(null);
  const [visible, setVisible] = useState(false);
  const { user, token, dispatch } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(false);
  const [data, setData] = useState(initialState);
  const { name, password, cf_password } = data;

  const handleInput = () => {
    inputFile.current.click();
  };

  const handleClick = () => {
    setVisible(!visible);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      // get file
      const file = e.target.files[0];
      let formData = new FormData();
      formData.append("avatar", file);

      // upload to cloudinary
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
        onUploadProgress: (x) => {
          if (x.total < 1024000)
            return toast("Uploading", {
              className: "bg-upload",
              bodyClassName: "bg-upload",
              autoClose: 7000,
            });
        },
      });
      setAvatar(res.data.url);
    } catch (err) {
      toast(err.response.data.msg, {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    }
  };

  const updateInfo = async () => {
    try {
      const res = await axios.patch(
        "/api/auth/user_update",
        {
          name: name ? name : user.name,
          avatar: avatar ? avatar : user.avatar,
        },
        {
          headers: { Authorization: token },
        }
      );
      const updatedUser = await axios.get("/api/auth/user", {
        headers: { Authorization: token },
      });
      dispatch({ type: "GET_USER", payload: updatedUser.data });
      return toast(res.data.msg, {
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

  const updatePassword = async () => {
    // check password length
    if (isLength(password))
      return toast("Password must be at least 6 characters.", {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    // check password match
    if (!isMatch(password, cf_password))
      return toast("Password did not match.", {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    try {
      const res = await axios.post(
        "/api/auth/reset_pass",
        { password },
        {
          headers: { Authorization: token },
        }
      );
      return toast(res.data.msg, {
        className: "toast-success",
        bodyClassName: "toast-success",
      });
    } catch (err) {
      return toast(err.response.data.msg, {
        className: "toast-failed",
        bodyClassName: "toast-failed",
      });
    }
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setData({ ...data, name: "", password: "", cf_password: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name || avatar) {
      updateInfo();
    }
    if (password) {
      updatePassword();
      handleReset();
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="profile">
        {/* avatar */}
        <div className="profile_avatar">
          <div className="profile_avatar-wrapper" onClick={handleInput}>
            <Avatar avatar={avatar} />
            <AiFillCamera />
          </div>
          <input
            type="file"
            name="avatar"
            ref={inputFile}
            className="profile_avatar-input"
            onChange={changeAvatar}
          />
        </div>
        {/* form */}
        <form className="profile_input" onSubmit={handleSubmit}>
          <div className="profile_input-form">
            <Input
              type="text"
              text="Name"
              defaultValue={user.name}
              name="name"
              handleChange={handleChange}
            />
            <Input
              name="email"
              type="text"
              text="Email"
              defaultValue={user.email}
              disabled
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
              <button type="submit">update</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
