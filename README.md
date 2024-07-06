# Tic Tac Toe Game

## Description
This is a simple Tic Tac Toe game implemented using JavaScript, HTML, and CSS. The game allows two players to take turns marking cells in a 3x3 grid. The first player to align three of their tokens horizontally, vertically, or diagonally wins the game. If all cells are filled without a winner, the game ends in a tie. The game includes a restart button that appears after a win or tie, allowing players to start a new game.

## Features
- Two-player gameplay
- Dynamic game board rendering
- Automatic turn switching
- Win and tie detection
- Restart game functionality

## Installation
1. Clone this repository to your local machine:
   ```sh
   git clone https://github.com/your-username/tic-tac-toe.git
2. Navigate to the project directory:
   ```sh
   cd tic-tac-toe
3. Open the `index.html` file in your web browser.

## Usage
1. Open the game in your web browser.
2. The first player ("Player One") will start the game and place their token (X) by clicking on any empty cell on the board.
3. The second player ("Player Two") will then place their token (O) by clicking on an empty cell.
4. Players take turns until one player wins by aligning three of their tokens or the game ends in a tie.
5. After a win or tie, the restart button will appear. Click the button to start a new game.

## Code Overview
### HTML
The HTML file contains the structure of the game, including the board, player turn display, and restart button.
   ```sh
   <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Gluten:wght@100..900&display=swap" rel="stylesheet">
        <title>Project: Tic Tac Toe</title>
    </head>
    <body>
        <header>
            <div>
                <h1>-tic - tac - toe -</h1>
            </div>
            <div class="turn"></div>
        </header>
        <div class="container">
            <div class="board"></div>
            <button class="start-game">Restart Game</button>
        </div>
        <script src="script.js"></script>
    </body>
  </html>
