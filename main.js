const playField_columns = 10;
const playField_rows = 20;

const tetromino_names = ["O", "L", "J", "S", "Z", "T", "I"];

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
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
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
  const column = Math.floor((playField_columns - tetrominoes[name].length) / 2);
  const row = 0;

  tetromino = {
    name,
    matrix,
    row,
    column,
    color,
  };
}

generatePlayField();
generateTetromino();

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

function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;

      playField[tetromino.row + row][tetromino.column + column] =
        tetromino.name;
    }
  }
  const filledRows = findFilledRows();
  removeFillRows(filledRows);
  generateTetromino();
}

function removeFillRows(filledRows) {
  filledRows.forEach((row) => {
    dropRowsAbove(row);
  });
}
function dropRowsAbove(rowDelete) {
  for (let row = rowDelete; row > 0; row--) {
    playField[row] = playField[row - 1];
  }

  playField[0] = new Array(playField_columns).fill(0);
}

function findFilledRows() {
  const filledRows = [];
  for (let row = 0; row < playField_rows; row++) {
    let filledColumns = 0;
    for (let column = 0; column < playField_columns; column++) {
      if (playField[row][column] != 0) {
        filledColumns++;
      }
    }
    if (playField_columns === filledColumns) {
      filledRows.push(row);
    }
  }
  return filledRows;
}

function rotateTetromino() {
  const oldMatrix = tetromino.matrix;
  const rotatedMatrix = rotateMatrix(tetromino.matrix);
  tetromino.matrix = rotatedMatrix;
  if (isValid()) {
    tetromino.matrix = oldMatrix;
  }
}

function rotateMatrix(matrixTetromino) {
  const N = matrixTetromino.length;
  const rotateMatrix = [];
  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
    }
  }
  return rotateMatrix;
}

document.addEventListener("keydown", onKeyControl);

function onKeyControl(evt) {
  switch (evt.key) {
    case " ":
      rotateTetromino();
      break;
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
  if (isValid()) {
    tetromino.row -= 1;
    placeTetromino();
  }
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (isValid()) {
    tetromino.column += 1;
  }
}

function moveTetrominoRight() {
  tetromino.column += 1;
  if (isValid()) {
    tetromino.column -= 1;
  }
}

function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) {
        continue;
      }
      if (isOutsideOfGameBoard(row, column)) {
        return true;
      }
      if (hasCollisions(row, column)) {
        return true;
      }
    }
  }
  return false;
}

function isOutsideOfGameBoard(row, column) {
  return (
    tetromino.column + column < 0 ||
    tetromino.column + column >= playField_columns ||
    tetromino.row + row >= playField.length
  );
}

function hasCollisions(row, column) {
  return playField[tetromino.row + row][tetromino.column + column];
}
