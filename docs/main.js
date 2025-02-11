document.addEventListener("DOMContentLoaded", () => {
  let currentPlayer = "X";
  let gameActive = true;
  const tiles = document.querySelectorAll(".sizing");
  const playerDisplay = document.querySelector("h3");
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset Game";
  resetButton.style.marginTop = "20px";
  resetButton.style.padding = "10px";
  resetButton.style.fontSize = "16px";
  document.body.appendChild(resetButton);
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Columns
    [0, 4, 8],
    [2, 4, 6]
    // Diagonals
  ];
  tiles.forEach((tile, index) => {
    tile.addEventListener("mouseover", function() {
      if (!this.textContent && gameActive) {
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
        if (!gameActive) return;
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
  function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (playerDisplay) playerDisplay.textContent = `Current player: ${currentPlayer}`;
  }
  function checkWin(player) {
    return winPatterns.some(
      (pattern) => pattern.every((index) => tiles[index].textContent === player)
    );
  }
  function checkDraw() {
    return [...tiles].every((tile) => tile.textContent !== "");
  }
  resetButton.addEventListener("click", () => {
    gameActive = true;
    currentPlayer = "X";
    if (playerDisplay) playerDisplay.textContent = "Current player: X";
    tiles.forEach((tile) => {
      tile.textContent = "";
      tile.style.opacity = "1";
      tile.classList.remove("X", "O");
    });
  });
});
//# sourceMappingURL=main.js.map
