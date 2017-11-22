import React from 'react';

const Instructions = (props) => {
  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <p> Instructions for Go </p>
        <ol>
          <li>Go is usually played on a 19x19 grid, or board.</li>
          <li>
            The pieces used are black and white disks, called stones.
          </li>
          <li>
            Players take turns placing stones on the board on intersections.
          </li>
          <li>
            Stones do not move unless they're captured.
          </li>
          <li>
            Stones are captured by being surrounded on orthogonal directions.
          </li>
          <li>
            The objective is to control territory and surround the opponent.
          </li>
          <li>
            At the end of the game the player with more territory wins.
          </li>
          <li>
            <ul>
              <li>
                <a href="http://www.kiseido.com/ff.htm">Click Here For More</a>
              </li>
            </ul>
          </li>
        </ol>
      </div>

      <div style={innerContainerStyle}> 
        <p> About This Project </p>
        <p>This is an isomorphic JavaScript web app designed to recreate Go.</p>
        <p>It allows you to play against friends by giving them a link.</p>
        <p>You can also play against an AI!</p>
        <p>It uses React for board rendering, and a  POJO for game logic.</p>
        <p>On the back end it uses Node.js and Express, with the ws library.</p>
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
  textAlign: 'center',
};

export default Instructions;

