import React from 'react';

const Inputs = (props) => {
  const { handleChange, handleSubmit, state } = props;
  const { 
    playerOneName, 
    playerOneType,  
    playerTwoName, 
    playerTwoType, 
    // size, 
    // handicap 
  } = state;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label> Name
          <input type="text" 
            onChange={handleChange("playerOneName")}
            value={playerOneName}
            placeholder="Name"
          />
        </label>
        <select 
          value={playerOneType} 
          onChange={handleChange("playerOneType")}>
          <option value="Human"> Human </option>
          <option value="Computer"> Computer </option>
        </select>
      </div>

      <div>
        <label> Name
          <input type="text" 
            onChange={handleChange("playerTwoName")}
            value={playerTwoName}
            placeholder="Name"
          />
        </label>
        <select 
          value={playerTwoType} 
          onChange={handleChange("playerTwoType")}>
          <option value="Human"> Human </option>
          <option value="Computer"> Computer </option>
        </select>
      </div>

      <button type="submit">Start</button>
    </form>
  );
};
export default Inputs;

