import Input from "../Input/Input";
import Avatar from "../Avatar/Avatar";
import { AiFillCamera } from "react-icons/ai";
import { useRef } from "react";
import "./profile.css";

const Profile = () => {
  const inputFile = useRef(null);

  const handleInput = () => {
    inputFile.current.click();
  };

  return (
    <div className="profile">
      {/* avatar */}
      <div className="profile_avatar">
        <div className="profile_avatar-wrapper" onClick={handleInput}>
          <Avatar />
          <AiFillCamera />
        </div>
        <input
          type="file"
          name="avatar"
          ref={inputFile}
          className="profile_avatar-input"
        />
      </div>
      {/* form */}
      <form className="profile_input">
        <div className="profile_input-form">
          <Input type="text" text="Name" />
          <Input type="text" text="Email" />
          <Input type="password" text="Password" />
          <Input type="password" text="Confirm Password" />
          <div className="login_btn">
            <button>update</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
