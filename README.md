# Awesome Go

> "While the Baroque rules of chess could only have been created by humans, the rules of go are so elegant, organic, and rigorously logical that if intelligent life forms exist elsewhere in the universe, they almost certainly play Go."
>
> \-- Edward Lasker, chess grandmaster

## Background

Awesome Go [(Live)](https://awesome-go.herokuapp.com) is a single page
isomorphic JavaScript Web Application that allows you to play Go against a
computer, or against a friend.

- Back end: Node.js and Express to transmit moves between players and create lobbies.
- Front end: A combination of vanilla JavaScript for game logic, and React to render the board and lobby.

Go itself is an abstract strategy game for two players, in which the aim is to
surround more territory than the opponent. The game was invented in ancient
China over 2500 years ago, believed to be the oldest board game still played
today.

Even though it has a set of simple rules, it's incredibly complex, even more so
than Chess due to the increased board size, more scope for play, and vastly
higher choices of available moves per turn. Due to this complexity, building an
AI for it is very tricky, being orders of complexity larger than similar games like Chess.

### Quick Rules

Two players, Black and White, take turns placing a stone (game piece) of
their own color on a vacant point (intersection) of the grid on a Go board.

Once placed a stone can not be moved to a different position, only removed when
captured.

Vertically and horizontally adjacent stones of the same color form a chain that,
in effect, becomes a single larger stone.

A vacant point adjacent to a stone is called a liberty for that stone. A chain 
of stones must have at least one liberty to remain on the board. When a chain
has 0 liberties, it is captured, therefore removed from the board.

The game ends when both players have passed, their is no other ending criteria.

### Complex Rules and Implementation

#### Ko Rule

Players are not allowed to make moves that return the game to the previous
position, this rule prevents unending repetition. To avoid this we need to keep
track of the board state for at least 2 turns, and make sure that a move does
not replicated a previous board. 

I handled this in a slightly different way, instead of tracking the entire board
state, we can just track changes in the state, allowing us to view history of
the game, while also letting us check for komi of at least 2 moves prior very
easily and efficiently.

#### Suicide

A player may not place a stone such that it or its group immediately has no 
liberties, unless doing so immediately deprives an enemy group of its final liberty. 

In cases like this, we remove the enemy group immediately, then place our stone
giving it some liberties.

#### Komi

Black has an advantage by playing the first move, so we give White a 6.5 point
compensation at the end of the game while scoring.

### Scoring

There are two separate methods of scoring that get used, accounting for regional
differences. Both almost always give the exact same end result, so I decided to
use Area scoring.

A players score is the number of stones they have on the board, plus the number
of empty intersections surrounded by that players stones.


## Design

### Technologies Utilized

Awesome Go is built using an Isomorphic JavaScript design.
It uses a Node.js and Express Back end, with a vanilla JS and React front end.

#### Back end

The reason for picking Node.js and Express was due to a need for easy web socket
implementation. I knew I didn't want to use an extra layer of over, or more
specifically Socket.io, and wanted to working with the native Web Socket
protocol.

The scope of this project involved the back end to be just used as a way for two 
clients to communicate, allowing them to make moves and talk to each other.

The WebSocket server itself is only responsible for a few things, it creates a
lookup for all currently connected clients, using an Object for constant lookup,
and then sends an ID back for each player. With that ID they're able to connect
into a Lobby, which then starts a game, and sends the ID to each players client.

Once their client has the ID, it makes it very easy to send messages between
players, no longer needing that Lobby. The server will get the ID from a
message, then use that ID to send a move to the player.


#### Front end

The front end has 2 separate parts to it. 

- First, the vanilla JavaScript game logic:

  - Each player starts a copy of the game on their own machine, and the server 
synchronizes who is player 1 and player 2.

  - Beyond that, every time they make a move on their computer, it gets validated
and checked, and then the client sends a very small light weight message to the
other person, who receieves the move and makes it on their end as well.

- Second, the React UI display logic:

  - There's a single source of truth for the game, the grid.
  - React just creates a grid, and then renders each part of the grid as an
    intersection, using some complex logic handling to figure out if the
    intersection is at the end of a row / col, to figure out if it needs to
    display the entire section or not.
