import { startGame } from "./components/minesweeper"
function start(rows = 8, col = 8, mines = 10) {
    startGame(rows, col, mines)
}
start()
document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault()
    const rows = document.getElementById('rows').value
    const columns = document.getElementById('columns').value
    const mines = document.getElementById('mines').value
    start(rows, columns, mines)
})
document.querySelectorAll('.boardSize').forEach(el => {
    el.addEventListener('change', function () {
        const rows = document.getElementById('rows').value
        const columns = document.getElementById('columns').value
        document.getElementById('mines').value = Math.round(rows * columns * 0.15625)
    })
})
