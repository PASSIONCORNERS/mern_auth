import Avatar from "../Avatar/Avatar";
import "./appbar.css";

const Appbar = () => {
  return (
    <div className="appbar">
      <div className="appbar_wrapper">
        {/* logo */}
        <div className="appbar_logo">
          <img src="./assets/img/shuttle.svg" alt="logo" />
          <p>mernauth</p>
        </div>
        {/* avatar */}
        <div className="appbar_avatar">
          <Avatar />
        </div>
      </div>
    </div>
  );
};

export default Appbar;
