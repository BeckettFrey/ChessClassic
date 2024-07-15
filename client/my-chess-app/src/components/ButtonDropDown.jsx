const ButtonDropDown = ({ text, dropdown, onClick }) => {
  return (
    <div className="buttons-container">
      <div className="dropdown">
        <button className="dropbtn">{text}</button>
        <div className="dropdown-content">
          {dropdown.map((option, index) => (
            <button key={index} onClick={() => onClick(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ButtonDropDown;
