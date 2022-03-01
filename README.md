# Tic-tac-toe
A simple TypeScript implementation of the classic game Tic-tac-toe. This library handles the board state and the win conditions. You have to however handle the turn cycling yourself (this is on purpose). All the parameters such as the board size and the goal (how many in a row to win) are customizable. The board is also implemented in a way that allows it to be infinite in size.

## Basic Setup
```ts
const board = tictactoe(); // Create the board (3x3 with goal 3 by default)

board.on('win', winner => {
    // Do something when a player wins
    board.reset(); // Reset the board state
});

board.on('draw', () => {
    // Do something when the game ends in a draw
    board.reset(); // Reset the board state
});

board.move(0, 0, 'x'); // Place an x on coords 0 0
// Instead of 'x' or 'o' you can use any string to differentiate between players
// Just keep it consistent
// This way you can also add more than 2 players
```

## Custom sizes and bounds


#### .size with one argument
```ts
const board = tictactoe().size(7);
```
This will create a 7x7 board. The coords on this board will be between 0 and 6 (inclusive).

#### .size with two arguments
```ts
const board = tictactoe().size(7, 5);
```
This will create a 7x5 board.
#### .bounds
```ts
const board = tictactoe().bounds(-2, -2, 2, 2);
```
This will create a 5x5 board with coords spanning from -2 to 2.
#### .infinite
```ts
const board = tictactoe().infinite();
```
This will create an infinite board. Keep in mind that the coords can be negative as well.

## Change the goal
```ts
const board = tictactoe().goal(5);
```
This will set the game goal to 5 (how many in a row to win).

## Miscellaneous stuff

#### board.gameOver: boolean
Keeps track of whether the game is already over

#### board.boundingBox: { minX: number, minY: number, maxX: number, maxY: number }
The current bounding box (or maybe rather bounding rectangle?) of all moves played so far. This is especially useful with the infinite board.

