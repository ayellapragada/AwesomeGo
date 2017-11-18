import React from 'react';

export const TILE_SIZE = 30;
// const CLICK_SIZE = 5;

const Intersection = ({ row, col, value, lastRow, lastCol, handleClick }) => {
  const intersectionStyle = {
    width: `${TILE_SIZE / 2}px`,
    height: `${TILE_SIZE / 2}px`,
    marginTop: `-${TILE_SIZE / 4}px`,
    marginLeft: `-${TILE_SIZE / 4}px`,
    boxSizing: 'border-box',
    cursor: 'pointer',
  };

  const containerStyle = {
    width: `${lastCol ? 0 : TILE_SIZE}px`,
    height: `${lastRow ? 0 : TILE_SIZE + (TILE_SIZE / 8)}px`,
    borderTop: `${!lastCol && '1px solid black'}`,
    borderLeft: `${!lastRow && '1px solid black'}`,
    boxSizing: 'border-box',
  };

  const blackStoneStyle = {
    width: `${TILE_SIZE / 2}px`,
    height: `${TILE_SIZE / 2}px`,
    border: '1px solid black',
    backgroundColor: 'black',
    borderRadius: '20px',
  }; 
  const whiteStoneStyle = {
    width: `${TILE_SIZE / 2}px`,
    height: `${TILE_SIZE / 2}px`,
    border: '1px solid black',
    backgroundColor: 'white',
    borderRadius: '20px',
  };

  const emptyStyle = {
  };

  const styleLinks = {
    0: emptyStyle,
    1: whiteStoneStyle,
    2: blackStoneStyle,
  };

  const handleClickOnIntersection = () => {
    handleClick(row, col);
  };

  return (
    <div style={containerStyle}>
      <div 
        onClick={handleClickOnIntersection}
        style={{ ...intersectionStyle, ...styleLinks[value] }} 
      />
    </div>
  );
};


export default Intersection;

