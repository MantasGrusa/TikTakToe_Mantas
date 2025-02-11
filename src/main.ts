document.addEventListener("DOMContentLoaded", () => {
    let currentPlayer: "X" | "O" = "X";
    let gameActive: boolean = true;
    const tiles: NodeListOf<HTMLDivElement> = document.querySelectorAll(".tile");
    const winPatterns: number[][] = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    tiles.forEach((tile: HTMLDivElement, index: number) => {
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

                if (checkWin(currentPlayer)) {
                    gameActive = false;
                    setTimeout(() => alert(`${currentPlayer} wins!`), 100);
                    return;
                }

                if (checkDraw()) {
                    gameActive = false;
                    setTimeout(() => alert("It's a draw!"), 100);
                    return;
                }

                switchPlayer();
            }
        });
    });

    function switchPlayer(): void {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }

    function checkWin(player: "X" | "O"): boolean {
        return winPatterns.some(pattern =>
            pattern.every(index => tiles[index].textContent === player)
        );
    }

    function checkDraw(): boolean {
        return [...tiles].every(tile => tile.textContent !== "");
    }
});
