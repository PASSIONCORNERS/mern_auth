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

const Profile = () => {
  const inputFile = useRef(null);
  const [visible, setVisible] = useState(false);
  const { user, token } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(false);

  const handleInput = () => {
    inputFile.current.click();
  };

  const handleClick = () => {
    setVisible(!visible);
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
        <form className="profile_input">
          <div className="profile_input-form">
            <Input type="text" text="Name" defaultValue={user.name} />
            <Input
              type="text"
              text="Email"
              defaultValue={user.email}
              disabled
            />
            <Input
              type={visible ? "text" : "password"}
              icon={visible ? <MdVisibility /> : <MdVisibilityOff />}
              text="Password"
              handleClick={handleClick}
            />
            <Input
              type={visible ? "text" : "password"}
              icon={visible ? <MdVisibility /> : <MdVisibilityOff />}
              text="Confirm Password"
              handleClick={handleClick}
            />
            <div className="login_btn">
              <button>update</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
