import { BiBookContent } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar_menu">
        <ul>
          <li>
            <BiBookContent />
            <p>feed</p>
          </li>
          <li>
            <BiUserCircle />
            <p>profile</p>
          </li>
          <li>
            <BiLogOut />
            <p>logout</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
