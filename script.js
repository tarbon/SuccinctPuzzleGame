
const levels = [
    { size: 3, moves: 5 },
    { size: 3, moves: 4 },
    { size: 4, moves: 6 },
    { size: 4, moves: 5 },
    { size: 5, moves: 7 }
];

let currentLevel = 0;
let succinctGems = 0;
let puzzleGrid = [];
let emptyTile = { row: -1, col: -1 };

const puzzleElement = document.getElementById("puzzle");
const levelElement = document.getElementById("level");
const gemsElement = document.getElementById("gems");
const nextLevelButton = document.getElementById("next-level");

function initGame() {
    loadLevel(currentLevel);
    updateUI();
}

function loadLevel(levelIndex) {
    const level = levels[levelIndex];
    puzzleGrid = createPuzzleGrid(level.size);
    shufflePuzzle(level.moves);
    renderPuzzle();
}

function createPuzzleGrid(size) {
    const grid = [];
    let counter = 1;
    for (let row = 0; row < size; row++) {
        const currentRow = [];
        for (let col = 0; col < size; col++) {
            currentRow.push(counter);
            counter++;
        }
        grid.push(currentRow);
    }
    grid[size - 1][size - 1] = 0;
    emptyTile = { row: size - 1, col: size - 1 };
    return grid;
}

function shufflePuzzle(moves) {
    for (let i = 0; i < moves; i++) {
        const possibleMoves = getPossibleMoves();
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        moveTile(randomMove.row, randomMove.col);
    }
}

function getPossibleMoves() {
    const moves = [];
    const { row, col } = emptyTile;
    if (row > 0) moves.push({ row: row - 1, col });
    if (row < puzzleGrid.length - 1) moves.push({ row: row + 1, col });
    if (col > 0) moves.push({ row, col: col - 1 });
    if (col < puzzleGrid[0].length - 1) moves.push({ row, col: col + 1 });
    return moves;
}

function moveTile(row, col) {
    const temp = puzzleGrid[row][col];
    puzzleGrid[row][col] = 0;
    puzzleGrid[emptyTile.row][emptyTile.col] = temp;
    emptyTile = { row, col };
}

function renderPuzzle() {
    puzzleElement.innerHTML = "";
    puzzleElement.style.gridTemplateColumns = `repeat(${puzzleGrid.length}, 100px)`;
    puzzleGrid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            const tileElement = document.createElement("div");
            tileElement.classList.add("tile");
            if (tile === 0) {
                tileElement.classList.add("empty");
            } else {
                tileElement.textContent = tile;
                tileElement.addEventListener("click", () => handleTileClick(rowIndex, colIndex));
            }
            puzzleElement.appendChild(tileElement);
        });
    });
}

function handleTileClick(row, col) {
    if (isAdjacent(row, col, emptyTile.row, emptyTile.col)) {
        moveTile(row, col);
        renderPuzzle();
        if (isPuzzleSolved()) {
            succinctGems += calculateReward(currentLevel);
            nextLevelButton.disabled = false;
            updateUI();
        }
    }
}

function calculateReward(level) {
    const baseReward = 100;
    return Math.round(baseReward * Math.pow(1.2, level));
}

function isPuzzleSolved() {
    let counter = 1;
    for (let row = 0; row < puzzleGrid.length; row++) {
        for (let col = 0; col < puzzleGrid[row].length; col++) {
            if (row === puzzleGrid.length - 1 && col === puzzleGrid[row].length - 1) {
                if (puzzleGrid[row][col] !== 0) return false;
            } else {
                if (puzzleGrid[row][col] !== counter) return false;
                counter++;
            }
        }
    }
    return true;
}

function isAdjacent(row1, col1, row2, col2) {
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

function updateUI() {
    levelElement.textContent = currentLevel + 1;
    gemsElement.textContent = succinctGems;
}

initGame();
