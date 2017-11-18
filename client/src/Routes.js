import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import Solo from './components/game/Solo';
import Lobby from './components/multi/Lobby.js';
import Home from './components/home/Home';

const Routes = (props) => {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/solo" component={Solo} />
        <Route exact path="/multi/:id" component={Lobby} />
      </Switch>
    </div>
  );
};
export default Routes;

