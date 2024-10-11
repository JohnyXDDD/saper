const Fields = []
class Field {
    constructor(id) {
        this.id = id
        this.isMine = false
        this.value = null
        this.div = document.createElement('div')
        this.div.className = 'field'
    }
}
export function createBoard(size, mines) {
    const board = document.createElement('div')
    document.querySelector('main').append(board);
    board.classList.add('board')
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)` // to usunięcia
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`
    for (let i = 0; i < size * size; i++) {
        const field = new Field(i)
        Fields.push(field)
    }
    const minesArray = getMines(mines)
    minesArray.forEach(mineNumber => {
        Fields[mineNumber].isMine = true
    })
    updateFieldsValue(size)

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
function updateFieldsValue() {
    Fields.forEach(field => {
        if (field.isMine) {
            const id = field.id
        }
    })
}