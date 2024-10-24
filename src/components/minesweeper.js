const Fields = []
class Field {
    constructor(id, size) {
        this.id = id
        this.row = Math.floor(this.id / size)
        this.column = this.id % size
        this.isMine = false
        this.value = 0
        this.div = document.createElement('div')
        this.div.innerHTML = `${this.row} ${this.column}`
        this.div.className = 'field'
    }
    changeValue() {
        this.value += 1
    }
}
export function createBoard(size, mines) {
    const board = document.createElement('div')
    document.querySelector('main').append(board);
    board.classList.add('board')
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)` // do usunięcia
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`
    for (let i = 0; i < size * size; i++) {
        const field = new Field(i, size)
        Fields.push(field)
        board.append(field.div)
    }
    const minesArray = getMines(mines)
    console.log(minesArray)
    minesArray.forEach(mineNumber => {
        Fields[mineNumber].isMine = true
    })
    updateFieldsValue(minesArray, size)

}
function getMines(minesAmmount) {
    const minesArray = []
    for (let i = 0; i < minesAmmount; i++) {
        let randomNumber = Math.floor(Math.random() * 100);
        while (!minesArray.includes(randomNumber)) {
            minesArray.push(randomNumber)
        }
    }
    return minesArray
}
function updateFieldsValue(minesArray, size) {
    minesArray.forEach(mine => {
        const field = Fields[mine]
        const { row, column } = field
        const rowsToUpdate = []
        const columnsToUpdate = []
        row == 0 ? rowsToUpdate.push(row, row + 1) : row == size - 1 ? rowsToUpdate.push(row, row - 1) : rowsToUpdate.push(row - 1, row, row + 1)
        column == 0 ? columnsToUpdate.push(column, column + 1) : column == size - 1 ? columnsToUpdate.push(column, column - 1) : columnsToUpdate.push(column - 1, column, column + 1)
        rowsToUpdate.forEach(row => {
            columnsToUpdate.forEach(column => {
                const field = Fields.find(field => field.row == 1 && field.column == column && field.isMine == false)
                console.log(field)
                field.changeValue()
            })
        })
    })
}
