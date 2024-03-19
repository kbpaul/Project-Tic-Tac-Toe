function Gameboard(){
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create a 2d array that will represent the state of the game board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }

    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;


    const dropToken = (player) => {
        // Get a flat list of available cells with their coordinates (row and column)
        const availableCells = [];
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col].getValue() === 0) {
                    availableCells.push({ row, col });
                }
            }
        }
    
        if (!availableCells.length) return; // No available cells
    
        // Choose a random available cell
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const { row, col } = availableCells[randomIndex];
    
        // Add token to the chosen cell
        board[row][col].addToken(player);
    };

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, dropToken, printBoard };
}


/*
** A Cell represents one "square" on the board and can have one of
** 0: no token is in the square,
** 1: Player One's token,
** 2: Player 2's token
*/

function Cell() {
    let value = 0;
  
    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
      value = player;
    };
  
    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;
  
    return {
      addToken,
      getValue
    };
}



function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ){
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 1
        }, 
        {
            name: playerTwoName,
            token: 2
        }
    ];

    let activePlayer = players[0];
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0]? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkRows = () => {
        for (let row = 0; row < board.getBoard().length; row++) {
            const firstCell = board.getBoard()[row][0].getValue();
            if (firstCell !== 0 && board.getBoard()[row].every(cell => cell.getValue() === firstCell)) {
                return firstCell;
            }
        }
        return 0;
    };

    const checkColumns = () => {
        for (let col = 0; col < board.getBoard()[0].length; col++) {
            const firstCell = board.getBoard()[0][col].getValue();
            if (firstCell !== 0) {
                let isWin = true;
                for (let row = 1; row < board.getBoard().length; row++) {
                    if (board.getBoard()[row][col].getValue() !== firstCell) {
                        isWin = false;
                        break;
                    }
                }
                if (isWin) return firstCell;
            }
        }
        return 0;
    };

    const checkDiagonals = () => {
        const mainDiagonal = [];
        const antiDiagonal = [];
        const size = board.getBoard().length;

        for (let i = 0; i < size; i++) {
            mainDiagonal.push(board.getBoard()[i][i].getValue());
            antiDiagonal.push(board.getBoard()[i][size - 1 - i].getValue());
        }

        if (mainDiagonal.every(cell => cell === mainDiagonal[0]) && mainDiagonal[0] !== 0) {
            return mainDiagonal[0];
        }

        if (antiDiagonal.every(cell => cell === antiDiagonal[0]) && antiDiagonal[0] !== 0) {
            return antiDiagonal[0];
        }

        return 0;
    };

    const checkWin = () => {
        const rowWin = checkRows();
        if (rowWin !== 0) return rowWin;

        const columnWin = checkColumns();
        if (columnWin !== 0) return columnWin;

        const diagonalWin = checkDiagonals();
        if (diagonalWin !== 0) return diagonalWin;

        return 0;
    };

    const checkGameOver = () => {
        const isBoardFull = board.getBoard().every(row => row.every(cell => cell.getValue() !== 0));
        const winner = checkWin();
        return isBoardFull || winner !== 0;
    };

    const playRound = () => {
        // Drop a token for the current player
        console.log(`Dropping ${getActivePlayer().name}'s token...`);
        board.dropToken(getActivePlayer().token);

        const winner = checkWin();
        if(winner !== 0) {
            console.log(`${players[winner-1].name } wins!`);
            return;
        }

        if (checkGameOver()) {
            console.log("Game over! It's a tie!");
            return;
        }

        //Switch player turn
        switchPlayerTurn();
        printNewRound();
    };

    // Initial play game message
    printNewRound();


    return { playRound, getActivePlayer, getBoard:board.getBoard};
}

const game = GameController();

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const playGame = document.querySelector('.play-game');
  
    const updateScreen = () => {
      // clear the board
      boardDiv.textContent = "";
  
      // get the newest version of the board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
  
      // Display player's turn
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
  
      // Render board squares
      board.forEach(row => {
        row.forEach((cell, index) => {
          // Anything clickable should be a button!!
          const div = document.createElement("div");
          div.classList.add("cell");
          // Create a data attribute to identify the column
          // This makes it easier to pass into our `playRound` function 
          div.dataset.column = index;
          div.textContent = cell.getValue();
          boardDiv.appendChild(div);
        })
      })
    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
        // const selectedColumn = e.target.dataset.column;
        // console.log(e.target.dataset);
        // // Make sure I've clicked a column and not the gaps in between
        // if (!selectedColumn) return;
        
        game.playRound();
        updateScreen();
    }
    playGame.addEventListener("click", clickHandlerBoard);

    // Initial render
    updateScreen();

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController();
