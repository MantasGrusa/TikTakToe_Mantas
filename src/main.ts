
document.addEventListener("DOMContentLoaded", () => {
    let currentPlayer = "X"; // Default starting player
    const tiles = document.querySelectorAll(".tile");

    tiles.forEach(tile => {
        tile.addEventListener("mouseover", function() {
            if (!this.textContent) {
                this.style.opacity = "0.5";
                this.textContent = currentPlayer;
            }
        });

        tile.addEventListener("mouseout", function() {
            if (this.style.opacity === "0.5") {
                this.textContent = "";
                this.style.opacity = "1";
            }
        });

        tile.addEventListener("click", function() {
            if (!this.textContent || this.style.opacity === "0.5") {
                this.style.opacity = "1";
                this.textContent = currentPlayer;
                this.classList.add(currentPlayer);
                switchPlayer();
            }
        });
    });

    function switchPlayer() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
});
const tiles = document.querySelectorAll('.sizing') as NodeListOf<HTMLButtonElement>;
const currentPlayerText = document.querySelector('h3') as HTMLElement;
const resetButton = document.querySelector('#reset-btn') as HTMLButtonElement;

// Initial state
let currentPlayer: string = 'x'; // 'x' starts
let board: string[] = ['', '', '', '', '', '', '', '', '']; // 3x3 empty board

// Function to update the display of the current player
function updateCurrentPlayerDisplay() {
    currentPlayerText.textContent = `Current player: ${currentPlayer}`;
}

// Save game state to local storage
function saveGameState() {
    localStorage.setItem('ticTacToeBoard', JSON.stringify(board));
    localStorage.setItem('currentPlayer', currentPlayer);
}

// Load game state from local storage
function loadGameState() {
    const savedBoard = localStorage.getItem('ticTacToeBoard');
    const savedPlayer = localStorage.getItem('currentPlayer');

    if (savedBoard) {
        board = JSON.parse(savedBoard);
        board.forEach((value, index) => {
            if (value) {
                tiles[index].textContent = value;
                tiles[index].disabled = true; // Disable already marked tiles
            }
        });
    }

    if (savedPlayer) {
        currentPlayer = savedPlayer;
    }

    updateCurrentPlayerDisplay();
}

// Initialize game
function initializeGame() {
    board = ['', '', '', '', '', '', '', '', '']; // Reset board
    tiles.forEach(tile => {
        tile.textContent = ''; // Clear each tile
        tile.disabled = false; // Enable buttons
    });

    currentPlayer = 'x'; // Reset to 'x' starts
    updateCurrentPlayerDisplay();
    saveGameState(); // Save reset state
}

// Event handler for tile clicks
tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => {
        handleTileClick(tile, index);
    });
});

// Reset button listener
resetButton.addEventListener('click', initializeGame);

// Load saved game state when page loads
loadGameState();

function handleTileClick(tile: HTMLButtonElement, index: number) {
    if (board[index] !== '') return; // Prevent marking a taken tile

    board[index] = currentPlayer; // Mark the board
    tile.textContent = currentPlayer; // Show 'X' or 'O' on the tile
    tile.disabled = true; // Disable the button after it's clicked

    if (checkForWinner()) {
        alert(`${currentPlayer.toUpperCase()} wins!`);
        disableAllTiles(); // Disable all tiles after game ends
    } else {
        switchPlayer();
    }

    saveGameState(); // Save after every move
}

// Switch player
function switchPlayer() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    updateCurrentPlayerDisplay();
}

// Check for winner
function checkForWinner(): boolean {
    // Winning combinations (3 horizontal, 3 vertical, 2 diagonals)
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6], // diagonals
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// Disable all tiles when the game ends
function disableAllTiles() {
    tiles.forEach(tile => {
        tile.disabled = true;
    });
}
