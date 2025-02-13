document.addEventListener("DOMContentLoaded", () => {
    let currentPlayer: "X" | "O" = "X"; // Default starting player
    let gameActive: boolean = true;
    const tiles: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".sizing");
    const playerDisplay: HTMLElement | null = document.querySelector("h3");
    const resetButton: HTMLButtonElement = document.createElement("button");

    // Create and style the reset button
    resetButton.textContent = "Reset Game";
    resetButton.style.marginTop = "20px";
    resetButton.style.padding = "10px";
    resetButton.style.fontSize = "16px";
    document.body.appendChild(resetButton);

    const winPatterns: number[][] = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // Load saved game from local storage
    loadGame();

    // Event listeners for tiles
    tiles.forEach((tile, index) => {
        tile.addEventListener("mouseover", function () {
            if (!this.textContent && gameActive) {
                this.style.opacity = "0.5";
                this.textContent = currentPlayer;
            }
        });

        tile.addEventListener("mouseout", function () {
            if (this.style.opacity === "0.5") {
                this.textContent = "";
                this.style.opacity = "1";
            }
        });

        tile.addEventListener("click", function () {
            if (!this.textContent || this.style.opacity === "0.5") {
                if (!gameActive) return; // Stop input if game is over

                this.style.opacity = "1";
                this.textContent = currentPlayer;
                this.classList.add(currentPlayer);

                // Save the game state to localStorage after each move
                saveGame();

                if (checkWin(currentPlayer)) {
                    gameActive = false;
                    setTimeout(() => showModal(`${currentPlayer} Wins! 🎉`), 200);
                    return;
                }

                if (checkDraw()) {
                    gameActive = false;
                    setTimeout(() => showModal("It's a Draw! 🤝"), 200);
                    return;
                }

                switchPlayer();
            }
        });
    });

    function switchPlayer(): void {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if (playerDisplay) playerDisplay.textContent = `Current player: ${currentPlayer}`;
        saveGame(); // Save new player turn
    }

    function checkWin(player: "X" | "O"): boolean {
        return winPatterns.some(pattern =>
            pattern.every(index => tiles[index].textContent === player)
        );
    }

    function checkDraw(): boolean {
        return [...tiles].every(tile => tile.textContent !== "");
    }

    // Show custom modal popup for win/draw
    function showModal(message: string) {
        const modal = document.getElementById("gameModal")!;
        const modalMessage = document.getElementById("modalMessage")!;
        const closeModal = document.getElementById("closeModal")!;

        modalMessage.textContent = message; // Set the win/draw message
        modal.style.display = "flex"; // Show modal

        closeModal.onclick = () => {
            modal.style.display = "none"; // Hide modal
            resetGame(); // Restart game
        };
    }

    // Function to reset the game
    function resetGame() {
        gameActive = true;
        currentPlayer = "X"; // Reset to "X"
        if (playerDisplay) playerDisplay.textContent = "Current player: X";

        tiles.forEach(tile => {
            tile.textContent = "";
            tile.style.opacity = "1";
            tile.classList.remove("X", "O");
        });

        // Reset the game in localStorage
        localStorage.removeItem('ticTacToeGame');
    }

    // Event listener for reset button
    resetButton.addEventListener("click", resetGame);

    // Save game state to localStorage
    function saveGame(): void {
        const gameState = {
            board: Array.from(tiles).map(tile => tile.textContent), // Save board state
            currentPlayer,
            gameActive
        };
        localStorage.setItem('ticTacToeGame', JSON.stringify(gameState));
    }

    // Load game state from localStorage
    function loadGame(): void {
        const savedGame = localStorage.getItem('ticTacToeGame');
        if (savedGame) {
            const gameState = JSON.parse(savedGame);
            const { board, currentPlayer: savedPlayer, gameActive: isActive } = gameState;

            // Apply saved state
            board.forEach((mark: string, index: number) => {
                if (mark) {
                    tiles[index].textContent = mark;
                }
            });
            gameActive = isActive !== undefined ? isActive : true; // Use saved game status

            // Set correct currentPlayer without switching
            if (gameActive) {
                currentPlayer = savedPlayer || "X"; // Use saved player or default to "X"
            }

            if (playerDisplay) playerDisplay.textContent = `Current player: ${currentPlayer}`;
        }
    }
});
