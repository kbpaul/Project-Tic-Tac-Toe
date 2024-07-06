function Gameboard(){
    const rows = 3;
    const columns = 3;
    let board = [];

    // Create a 2d array that will represent the state of the game board
    const initBoard = () => {
        board = [];

        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++){
                board[i].push(Cell());
            }
        }
    };

    initBoard();

    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;

    const addToken = (row, col, player) => {
        if (board[row][col].getValue() === "") {
            board[row][col].addToken(player);
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        initBoard();
    }

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, addToken, resetBoard, printBoard };
}

/*
** A Cell represents one "square" on the board and can have one of
** "": no token is in the square,
** X: Player One's token,
** O: Player 2's token
*/

function Cell() {
    let value = ""; // Initialize as ""

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

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

    const players = [
        { name: playerOneName, token: "X" }, 
        { name: playerTwoName, token: "O" }
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
            if (firstCell !== "" && board.getBoard()[row].every(cell => cell.getValue() === firstCell)) {
                return firstCell;
            }
        }
        return "";
    };

    const checkColumns = () => {
        for (let col = 0; col < board.getBoard()[0].length; col++) {
            const firstCell = board.getBoard()[0][col].getValue();
            if (firstCell !== "") {
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
        return "";
    };

    const checkDiagonals = () => {
        const mainDiagonal = [];
        const antiDiagonal = [];
        const size = board.getBoard().length;

        for (let i = 0; i < size; i++) {
            mainDiagonal.push(board.getBoard()[i][i].getValue());
            antiDiagonal.push(board.getBoard()[i][size - 1 - i].getValue());
        }

        if (mainDiagonal.every(cell => cell === mainDiagonal[0]) && mainDiagonal[0] !== "") {
            return mainDiagonal[0];
        }

        if (antiDiagonal.every(cell => cell === antiDiagonal[0]) && antiDiagonal[0] !== "") {
            return antiDiagonal[0];
        }

        return "";
    };

    const checkWin = () => {
        const rowWin = checkRows();
        if (rowWin !== "") return rowWin;

        const columnWin = checkColumns();
        if (columnWin !== "") return columnWin;

        const diagonalWin = checkDiagonals();
        if (diagonalWin !== "") return diagonalWin;

        return "";
    };

    const checkGameOver = () => {
        const isBoardFull = board.getBoard().every(row => row.every(cell => cell.getValue() !== ""));
        const winner = checkWin();
        return isBoardFull || winner !== "";
    };

    const playRound = (row, col) => {
        // Drop a token for the current player
        if (board.addToken(row, col, getActivePlayer().token)) {
            const winner = checkWin();
            if (winner !== "") {
                console.log(`${players.find(player => player.token === winner).name} wins!`);
                return winner;
            }

            if (checkGameOver()) {
                console.log("Game over! It's a tie!");
                return "tie";
            }

            // Switch player turn
            switchPlayerTurn();
            printNewRound();
        } else {
            console.log("Cell is already occupied. Try again.");
        }
    };

    const resetGame = () => {
        board.resetBoard();
        activePlayer = players[0];
    };

    // Initial play game message
    printNewRound();

    return { playRound, getActivePlayer, getBoard: board.getBoard, resetGame };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const restartButton = document.querySelector('.start-game');

    const updateScreen = () => {
        // Clear the board
        boardDiv.textContent = "";

        // Get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                // Anything clickable should be a button!!
                const div = document.createElement("div");
                div.classList.add("cell");
                // Create a data attribute to identify the cell
                // This makes it easier to pass into our `playRound` function 
                div.dataset.row = rowIndex;
                div.dataset.col = colIndex;
                div.textContent = cell.getValue();
                boardDiv.appendChild(div);
            });
        });
    };

    const showRestartButton = () => {
        restartButton.style.display = "block";
    };

    const hideRestartButton = () => {
        restartButton.style.display = "none";
    };

    // Add event listener for the board
    boardDiv.addEventListener("click", (e) => {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.col;
        // Make sure I've clicked a cell and not the gaps in between
        if (selectedRow !== undefined && selectedCol !== undefined) {
            const result = game.playRound(Number(selectedRow), Number(selectedCol));
            updateScreen();

            if(result){
                showRestartButton();
            }
        }
    });

    restartButton.addEventListener("click", () => {
        game.resetGame();
        updateScreen();
        hideRestartButton();
    })

    // Initial render
    updateScreen();
    hideRestartButton();
}

ScreenController();
