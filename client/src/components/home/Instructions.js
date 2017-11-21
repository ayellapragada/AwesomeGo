import React from 'react';

const Instructions = (props) => {
  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <p> Instructions for Go </p>
      </div>

      <div style={innerContainerStyle}> 
        <p> About This Project </p>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
};

const innerContainerStyle = {

};

export default Instructions;

