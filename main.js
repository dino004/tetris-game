const playField_columns = 10;
const playField_rows = 20;

const tetromino_names = ["O", "L", "J", "S", "Z", "T"];

const tetrominoes = {
  O: [
    [1, 1],
    [1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
};

let playField;
let tetromino;

const convertPositionToIndex = (row, column) =>
  row * playField_columns + column;

function generatePlayField() {
  for (let i = 0; i < playField_rows * playField_columns; i++) {
    const div = document.createElement("div");
    document.querySelector(".tetris").append(div);
  }

  playField = new Array(playField_rows)
    .fill()
    .map(() => new Array(playField_columns).fill(0));
}

function generateTetromino() {
  const randomIndex = Math.floor(Math.random() * tetromino_names.length);

  const name = tetromino_names[randomIndex];
  const matrix = tetrominoes[name];
  const color = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
  const column = 4;
  const row = 0;

  tetromino = {
    name,
    matrix,
    row,
    column,
    color,
  };
}

generateTetromino();
generatePlayField();

const cells = document.querySelectorAll(".tetris div");

function drawPlayField() {
  playField.forEach((row, rowIndex) => {
    row.forEach((name, columnIndex) => {
      const cellIndex = convertPositionToIndex(rowIndex, columnIndex);
      cells[cellIndex].classList.add(name);
    });
  });
}

function drawTetromino() {
  const { name, color, matrix, row, column } = tetromino;
  matrix.forEach((matrixRow, rowIndex) => {
    matrixRow.forEach((value, columnIndex) => {
      if (value === 0) return;
      const cellIndex = convertPositionToIndex(
        row + rowIndex,
        column + columnIndex
      );
      cells[cellIndex].classList.toggle(name, true);
      cells[cellIndex].style.backgroundColor = color;
    });
  });
}

drawTetromino();

function draw() {
  cells.forEach(function (cell) {
    cell.removeAttribute("class");
    cell.style.backgroundColor = "";
  });
  drawTetromino();
  drawPlayField();
}

document.addEventListener("keydown", onKeyDown);

function onKeyDown(evt) {
  switch (evt.key) {
    case "ArrowDown":
      moveTetrominoDown();
      break;
    case "ArrowLeft":
      moveTetrominoLeft();
      break;
    case "ArrowRight":
      moveTetrominoRight();
      break;
  }
  draw();
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (isOutsideOfGameBoard()) {
    tetromino.row -= 1;
    placeTetromino();
  }
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (isOutsideOfGameBoard()) {
    tetromino.column += 1;
  }
}

function moveTetrominoRight() {
  tetromino.column += 1;
  if (isOutsideOfGameBoard()) {
    tetromino.column -= 1;
  }
}

function isOutsideOfGameBoard() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (
        tetromino.column + column < 0 ||
        tetromino.column + column >= playField_columns ||
        tetromino.row + row >= playField.length
      ) {
        return true;
      }
    }
  }
  return false;
}

function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;

      playField[tetromino.row + row][tetromino.column + column] =
        tetromino_names[0];
    }
  }
  generateTetromino();
}
