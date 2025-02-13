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
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  loadGame();
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
        saveGame();
        if (checkWin(currentPlayer)) {
          gameActive = false;
          setTimeout(() => showModal(`${currentPlayer} Wins! \u{1F389}`), 200);
          return;
        }
        if (checkDraw()) {
          gameActive = false;
          setTimeout(() => showModal("It's a Draw! \u{1F91D}"), 200);
          return;
        }
        switchPlayer();
      }
    });
  });
  function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (playerDisplay) playerDisplay.textContent = `Current player: ${currentPlayer}`;
    saveGame();
  }
  function checkWin(player) {
    return winPatterns.some(
      (pattern) => pattern.every((index) => tiles[index].textContent === player)
    );
  }
  function checkDraw() {
    return [...tiles].every((tile) => tile.textContent !== "");
  }
  function showModal(message) {
    const modal = document.getElementById("gameModal");
    const modalMessage = document.getElementById("modalMessage");
    const closeModal = document.getElementById("closeModal");
    modalMessage.textContent = message;
    modal.style.display = "flex";
    closeModal.onclick = () => {
      modal.style.display = "none";
      resetGame();
    };
  }
  function resetGame() {
    gameActive = true;
    currentPlayer = "X";
    if (playerDisplay) playerDisplay.textContent = "Current player: X";
    tiles.forEach((tile) => {
      tile.textContent = "";
      tile.style.opacity = "1";
      tile.classList.remove("X", "O");
    });
    localStorage.removeItem("ticTacToeGame");
  }
  resetButton.addEventListener("click", resetGame);
  function saveGame() {
    const gameState = {
      board: Array.from(tiles).map((tile) => tile.textContent),
      currentPlayer,
      gameActive
    };
    localStorage.setItem("ticTacToeGame", JSON.stringify(gameState));
  }
  function loadGame() {
    const savedGame = localStorage.getItem("ticTacToeGame");
    if (savedGame) {
      const gameState = JSON.parse(savedGame);
      const { board, currentPlayer: savedPlayer, gameActive: isActive } = gameState;
      board.forEach((mark, index) => {
        if (mark) {
          tiles[index].textContent = mark;
        }
      });
      gameActive = isActive !== void 0 ? isActive : true;
      if (gameActive) {
        currentPlayer = savedPlayer || "X";
      }
      if (playerDisplay) playerDisplay.textContent = `Current player: ${currentPlayer}`;
    }
  }
});
//# sourceMappingURL=main.js.map
