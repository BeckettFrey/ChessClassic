const Options = ({ onClick, options, parameter, header }) => {
  return (
    <div className="option-selection">
      <p>{header}</p>
      {options.map((option, index) => (
        <button key={index} onClick={() => onClick(parameter, option)}>
          {option}
        </button>
      ))}
    </div>
  );
};
export default Options;
