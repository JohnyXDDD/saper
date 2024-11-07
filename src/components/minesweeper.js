const Fields = []
class Field {
    constructor(id) {
        this.id = id
        this.isMine = false
        this.value = null
        this.div = document.createElement('div')
        this.div.className = 'field'
        this.div.innerText = ""
        this.div.addEventListener('click', () => this.reveal())
    }
    updateValue() {
        this.value = this.value + 1
    }

    reveal() {
        if (this.isMine) {
            console.log("You lost")
            this.div.style.backgroundColor = 'red'
        }
        else if (this.value != null) {
            this.div.style.backgroundColor = 'green'
        }
        else {
            this.div.style.backgroundColor = 'blue'
        }

        console.log(this.div.innerText)
    }
}
export function createBoard(size, mines) {
    for (let i = 0; i < size; i++) {
        const row = []
        for (let j = 0; j < size; j++) {
            const field = new Field(i * size + j)
            row.push(field)
        }
        Fields.push(row)
    }
    const minesArray = getMines(mines, size)
    mines = []
    minesArray.forEach(mineNumber => {
        row = parseInt(mineNumber / size)
        column = mineNumber % size
        mine = {
            row,
            column
        }
        mines.push(mine)
        Fields[row][column].isMine = true
    })
    updateFieldsValue(mines, size)

}
function getMines(minesAmmount, size) {
    const minesArray = []
    for (let i = 0; i < minesAmmount; i++) {
        let randomNumber = Math.floor(Math.random() * size * size);
        while (!minesArray.includes(randomNumber)) {
            minesArray.push(randomNumber)
        }
    }
    return minesArray
}
function generateBoard(size) {
    const board = document.createElement('div')
    document.querySelector('main').append(board);
    board.classList.add('board')
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)` // Jednak nie bo może być prostokątna plansza
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const field = Fields[i][j]
            field.div.innerText = field.isMine ? "M" : field.value ? field.value : '0'
            board.append(field.div)
        }
    }
}
function updateFieldsValue(minesArray, size) {
    minesArray.forEach(mine => {
        const row = mine.row
        const column = mine.column
        const rowsToUpdate = [row - 1, row, row + 1]
        const columnsToUpdate = [column - 1, column, column + 1]
        rowsToUpdate.forEach(row => {
            if (row >= 0 && row < size) {
                columnsToUpdate.forEach(column => {
                    if (column >= 0 && column < size) {
                        if (Fields[row][column].isMine == false) {
                            Fields[row][column].updateValue()
                        }
                    }
                })
            }
        })
    })
    generateBoard(size)
}
