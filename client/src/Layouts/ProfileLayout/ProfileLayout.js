import Sidebar from "../../components/Sidebar/Sidebar";
import Appbar from "../../components/Appbar/Appbar";
import "./profilelayout.css";

const ProfileLayout = () => {
  return (
    <div className="profilelayout">
      {/* appbar */}
      <Appbar />
      {/* sidebar */}
      <Sidebar />
      {/* content */}
      <div className="profilelayout_content">
        {/* feed */}
        {/* profile */}
      </div>
    </div>
  );
};

export default ProfileLayout;
