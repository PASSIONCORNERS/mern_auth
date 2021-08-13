import "./activatelayout.css";

const ActivateLayout = ({ history }) => {
  const handleClick = () => {
    history.push("/");
  };

  return (
    <div className="activate">
      <p>
        ready to login ? 👉🏻 <span onClick={handleClick}>Here</span>
      </p>
    </div>
  );
};

export default ActivateLayout;
