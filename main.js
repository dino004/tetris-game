const playField_columns = 10;
const playField_rows = 20;

const tetromino_names = ["O", "L"];

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

  console.log(playField);
}

function generateTetromino() {
  const nameTetro = "O";
  const matrixTetro = tetrominoes[nameTetro];

  const columnTetro = 4;
  const rowTetro = 0;

  tetromino = {
    name: nameTetro,
    matrix: matrixTetro,
    row: rowTetro,
    column: columnTetro,
  };
}

generatePlayField();
generateTetromino();

const cells = document.querySelectorAll(".tetris div");

function drawPlayField() {
  for (let row = 0; row < playField_rows; row++) {
    for (let column = 0; column < playField_columns; column++) {
      const name = playField[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (tetromino.matrix[row][column] === 0) {
        continue;
      }

      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      cells[cellIndex].classList.add(name);
    }
  }
}

drawTetromino();

function draw() {
  cells.forEach(function (cell) {
    cell.removeAttribute("class");
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
