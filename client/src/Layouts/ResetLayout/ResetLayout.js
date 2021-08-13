import Reset from "../../components/Reset/Reset";
import "./resetlayout.css";

const ResetLayout = ({ history }) => {
  const handleClick = () => {
    history.push("/");
  };

  return (
    <div className="authlayout">
      {/* logo */}
      <div className="authlayout_logo">
        <img src="../../assets/img/shuttle.svg" alt="logo" />
      </div>
      {/* form */}
      <Reset />
      {/* actions */}
      <p className="reset_p" onClick={handleClick}>
        login ?
      </p>
    </div>
  );
};

export default ResetLayout;
