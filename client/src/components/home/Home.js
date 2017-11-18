import React from 'react';
import { Link } from 'react-router-dom';

import Instructions from './Instructions';

const Home = (props) => {
  const randomId =  Math.floor(Math.random() * 100);

  return (
    <div>
      <div>
        <Link to="/solo"> Solo </Link>
        <Link to={`/multi/9`}> 9 </Link>
        <Link to={`/multi/${randomId}`}> Multi </Link>
      </div>
      <Instructions />
    </div>
  );
};

export default Home;

