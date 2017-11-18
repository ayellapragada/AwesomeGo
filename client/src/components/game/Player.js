import Human from './Human';
import Computer from './Computer';

class Player {
  constructor(name, type) {
    return type === "Human" ? new Human(name) : new Computer(name);
  }
}

export default Player;
