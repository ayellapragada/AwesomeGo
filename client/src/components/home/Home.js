import React from 'react';
import { Link } from 'react-router-dom';

import Instructions from './Instructions';

const Home = (props) => {
  const randomId =  Math.floor(Math.random() * 100000);

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <Link style={linkStyle} to="/solo">
          <div style={linkContainerStyle}>
            <i className="fa fa-user" aria-hidden="true"></i>
            &nbsp;
            Play Against AI 
          </div>
        </Link>
        <Link style={linkStyle} to={`/multi/${randomId}`}>
          <div style={linkContainerStyle}>
            <i className="fa fa-users" aria-hidden="true"></i>
            &nbsp;
            Play Against Friends 
          </div>
        </Link>
      </div>
      <Instructions />
      <Link to={`/multi/9`}> 9 </Link>
      <div> 
        When the page first loads, the Node backend on Heroku may take some 
        time to spin up and start working.
      </div>
    </div>
  );
};


const containerStyle = {
  height: '60vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
};

const innerContainerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
};

const linkStyle = {
  textDecoration: 'none',
  color: 'white',
  fontSize: '22px',
};

const linkContainerStyle = {
  border: '1px solid black',
  borderRadius: '5px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '10px',
  padding: '40px 90px',
  backgroundColor: '#2480ff',
};

export default Home;

