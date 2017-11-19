import React from 'react';

import GameStart from './GameStart';

const Solo = (props) => {
  sessionStorage.setItem('id', 0);

  return (
    <div>
      <GameStart solo one={0} two={'HAL'} />
    </div>
  );
};
export default Solo;

