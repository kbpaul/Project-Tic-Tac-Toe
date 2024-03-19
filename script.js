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

    const playRound = () => {
        // Drop a token for the current player
        console.log(
            `Dropping ${getActivePlayer().name}'s token...`
        );
        board.dropToken(getActivePlayer().token);


        //Switch player turn
        switchPlayerTurn();
        printNewRound();
    };

    // Initial play game message
    printNewRound();


    return { playRound, getActivePlayer, getBoard:board.getBoard};
  }

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
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          // Create a data attribute to identify the column
          // This makes it easier to pass into our `playRound` function 
          cellButton.dataset.column = index
          cellButton.textContent = cell.getValue();
          boardDiv.appendChild(cellButton);
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
