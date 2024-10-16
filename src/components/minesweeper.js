const Fields = []
class Field {
    constructor(id, size) {
        this.id = id
        this.row = Math.floor(this.id / size)
        this.column = this.id % size
        this.isMine = false
        this.value = null
        this.div = document.createElement('div')
        this.div.innerHTML = `${this.row} ${this.column}`
        this.div.className = 'field'
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
        if (field.row == 0) {

        }
        else if (field.row == size - 1) {

        } else {

        }
    })
}

function checkIfFieldIsProper(field, id) {

}