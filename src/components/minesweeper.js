const Fields = [];
let winConditionTimeout = null;
let canNextMoveBeMade = true;
let flags = null;
let Timer = null;
let Seconds = 0;
class Field {
  constructor(id) {
    this.id = id;
    this.isMine = false;
    this.value = 0;
    this.revealed = false;
    this.isFlag = false;
    this.div = document.createElement("div");
    this.div.className = "field";
    this.div.innerText = "";
    this.div.addEventListener("mousedown", this.clickHandler);
  }
  updateValue() {
    this.value = this.value + 1;
  }

  clickHandler = (e) => {
    if (Timer == null) {
      Timer = setInterval(() => {
        Seconds += 1;
        const min = Math.floor(Seconds / 60) || "0";
        const sec = Seconds % 60 || 0;
        const seconds = sec < 10 ? `0${sec}` : sec;
        document.getElementById("time").innerHTML = `${min}:${seconds}`;
      }, 1000);
    }
    if (e.button === 0 && !this.isFlag && canNextMoveBeMade) {
      canNextMoveBeMade = false;
      if (this.isMine) {
        showAllMines("&#128163");
        const x = Fields.length;
        const y = Fields[0].length;
        disableAllEvents(x, y);
        endGame(-1);
      } else if (this.value > 0) {
        this.div.classList.add("close");
        this.div.innerHTML = this.value;
        this.revealed = true;
        this.disableClick();
        setWinConditionTimeout();
      } else {
        this.div.classList.add("empty");
        this.disableClick();
        revealOthers(this.id);
      }
    } else if (e.button === 2) {
      if (flags > 0 || this.isFlag) {
        this.isFlag
          ? (this.div.innerHTML = "")
          : (this.div.innerHTML = "&#128681");
        this.isFlag ? (flags += 1) : (flags -= 1);
        document.getElementById("remainingFlags").innerText = flags;
        this.isFlag = !this.isFlag;
      }
    }
  };
  disableClick() {
    this.div.removeEventListener("mousedown", this.clickHandler);
  }
}
export function startGame(ri, ci, minesAmmount) {
  let c = Math.max(ri, ci);
  let r = Math.min(ri, ci);
  clearBeforeGame();
  Fields.length = 0;
  for (let i = 0; i < r; i++) {
    const row = [];
    for (let j = 0; j < c; j++) {
      const field = new Field(i * c + j);
      row.push(field);
    }
    Fields.push(row);
  }
  const minesArray = getMines(minesAmmount, r, c);
  const mines = [];
  minesArray.forEach((mineNumber) => {
    const row = parseInt(mineNumber / c);
    const column = mineNumber % c;
    const mine = {
      row,
      column,
    };
    mines.push(mine);
    Fields[row][column].isMine = true;
  });
  flags = minesAmmount;
  updateFieldsValue(mines, r, c);
  updateInfo(minesAmmount);
}
function revealOthers(id) {
  const x = Fields.length;
  const y = Fields[0].length;
  const row = parseInt(id / y);
  const column = id % y;
  const rowsToUpdate = [row - 1, row, row + 1];
  const columnsToUpdate = [column - 1, column, column + 1];
  rowsToUpdate.forEach((row) => {
    if (row >= 0 && row < x) {
      columnsToUpdate.forEach((column) => {
        if (column >= 0 && column < y) {
          const field = Fields[row][column];
          if (field.isMine == false && field.revealed == false) {
            reveal(field);
          }
        }
      });
    }
  });
  setWinConditionTimeout();
}
function disableAllEvents(x, y) {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      const field = Fields[i][j];
      field.disableClick();
    }
  }
}
function reveal(field) {
  field.revealed = true;
  if (field.value > 0) {
    field.div.classList.add("close");
    field.div.innerHTML = field.value;
  } else {
    field.div.classList.add("empty");
    field.div.innerHTML = "";
    revealOthers(field.id);
  }
  field.disableClick();
  field.isFlag = false;
}
function getMines(minesAmmount, r, c) {
  const minesArray = [];
  while (minesArray.length < minesAmmount) {
    let randomNumber = Math.floor(Math.random() * r * c);
    if (!minesArray.includes(randomNumber)) {
      minesArray.push(randomNumber);
    }
  }
  return minesArray;
}
function generateBoard(r, c) {
  const board = document.createElement("div");
  const main = document.querySelector("main").prepend(board);
  board.classList.add("board");
  board.style.setProperty("--columns", c);
  // board.style.gridTemplateColumns = `repeat(${c}, minmax(0,var(--cell-size)))`;
  // board.style.gridAutoRows = `minmax(0,100px))`;
  // board.style.gridTemplateRows = `repeat(${c}, minmax(0,60px))`;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      const field = Fields[i][j];
      board.append(field.div);
    }
  }
  document.getElementById("time").innerHTML = `0:00`;
  addClassesToFields();
}
function updateFieldsValue(minesArray, r, c) {
  minesArray.forEach((mine) => {
    const row = mine.row;
    const column = mine.column;
    const rowsToUpdate = [row - 1, row, row + 1];
    const columnsToUpdate = [column - 1, column, column + 1];
    rowsToUpdate.forEach((row) => {
      if (row >= 0 && row < r) {
        columnsToUpdate.forEach((column) => {
          if (column >= 0 && column < c) {
            if (Fields[row][column].isMine == false) {
              Fields[row][column].updateValue();
            }
          }
        });
      }
    });
  });
  flags = minesArray.length;
  generateBoard(r, c);
}
function setWinConditionTimeout() {
  clearTimeout(winConditionTimeout);
  winConditionTimeout = setTimeout(() => {
    checkIfTheGameIsOver();
  }, 0);
}
function checkIfTheGameIsOver() {
  const fieldsLength = Fields.length * Fields[0].length;
  let mineCounter = 0;
  let revealedCounter = 0;
  Fields.forEach((row) => {
    row.forEach((field) => {
      field.isMine
        ? (mineCounter += 1)
        : field.revealed
        ? (revealedCounter += 1)
        : false;
    });
  });
  countFlags(mineCounter);
  if (revealedCounter + mineCounter == fieldsLength) {
    showAllMines("&#128681");
    disableAllEvents(Fields.length, Fields[0].length);
    endGame(1);
  } else {
    canNextMoveBeMade = true;
  }
}
function countFlags(minesCounter) {
  let tempFlags = minesCounter;
  Fields.forEach((row) => {
    row.forEach((field) => {
      if (field.isFlag) {
        tempFlags -= 1;
      }
    });
  });
  flags = tempFlags;
  document.getElementById("remainingFlags").innerHTML = tempFlags;
}
function addClassesToFields() {
  const rows = Fields.length;
  const columns = Fields[0].length;
  for (let i = 0; i < columns; i++) {
    Fields[0][i].div.classList.add("top");
    Fields[rows - 1][i].div.classList.add("bottom");
  }
  for (let i = 0; i < rows; i++) {
    Fields[i][0].div.classList.add("left");
    Fields[i][columns - 1].div.classList.add("right");
  }
  Fields[0][0].div.style.borderRadius = "8px 0 0 0";
  Fields[0][columns - 1].div.style.borderRadius = "0 8px 0 0";
  Fields[rows - 1][columns - 1].div.style.borderRadius = "0 0 8px 0";
  Fields[rows - 1][0].div.style.borderRadius = "0 0 0 8px";
}
function updateInfo(mines) {
  document.getElementById("minesNumber").innerText = mines;
  document.getElementById("remainingFlags").innerText = mines;
}
function showAllMines(clickResult) {
  const rows = Fields.length;
  const columns = Fields[0].length;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const field = Fields[i][j];
      if (field.isMine) {
        field.div.innerHTML = clickResult;
      } else if (field.isMine == false && field.isFlag) {
        field.div.innerHTML = "&#10060;";
      }
    }
  }
  document.getElementById("remainingFlags").innerText = 0;
}
function endGame(result) {
  if (result < 0) {
    confetti({
      particleCount: 200,
      spread: 1000,
      scalar: 2,
      origin: { y: 0.5 },
      shapes: ["emoji"],
      shapeOptions: {
        emoji: {
          value: ["💣"],
        },
      },
    });
  } else {
    confetti({
      particleCount: 300,
      spread: 1000,
      origin: { y: 0.5 },
    });
  }
  clearInterval(Timer);
  Timer = null;
}
function clearBeforeGame() {
  if (document.querySelector(".board")) {
    document.querySelector(".board").remove();
  }
  winConditionTimeout = null;
  canNextMoveBeMade = true;
  flags = null;
  clearInterval(Timer);
  Timer = null;
  Seconds = 0;
}
document.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});
