const boardEl = document.getElementById('board');
const modalEl = document.getElementById('modal');
const resetButtons = document.getElementsByClassName('reset');

const players = ['x', 'o'];
let activePlayer = 0;
let board: string[][] = []

const startGame = () => {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  activePlayer = 0;
  renderBoard(board);
}

window.addEventListener('load', startGame);

const click = (row: string, col: string) => {
  board[(Number(row))][(Number(col))] = players[activePlayer];
  renderBoard(board);
  if (checkWinner(activePlayer)) {
    showWinner(activePlayer);
  }
  activePlayer = activePlayer === 0 ? 1 : 0;
}

const checkWinner = (activePlayer: number) => {
  let player = players[activePlayer];
  return checkLines(player) || checkDiagonales(player);
}

const checkDiagonales = (player: string) => {
  let lr = true;
  let rl = true;
  for (let i = 0; i < board.length; i++) {
    lr = lr && board[i][i] === player;
    rl = rl && board[i][(board.length - 1) - i] === player;
  }
  return rl || lr;
}

const checkLines = (player: string) => {
  for (let i = 0; i < board.length; i++) {
    let lv = true;
    let lh = true;
    for (let j = 0; j < board.length; j++) {
      lh = lh && board[i][j] === player;
      lv = lv && board[j][i] === player;
    }
    if (lh || lv) {
      return true;
    }
  }
  return false;
}

for (let btn of resetButtons) {
  btn.addEventListener('click', () => {
    if (!modalEl.classList.contains('hidden')) {
      modalEl.classList.add('hidden');
    }
    startGame();
  });
}

boardEl.addEventListener('click', (event) => {
  if (!(event.target instanceof HTMLDivElement)) {
    return;
  }
  let targetClasses = event.target.classList;
  let targetData = event.target.dataset;
  if (targetClasses.contains('field') && !targetClasses.contains('busy')) {
    click(targetData.row, targetData.col);
  }
});

const showWinner = (winner: number) => {
  let header = modalEl.getElementsByTagName('h2')[0];
  header.textContent = `🍾 Won player №${winner + 1}! 🍾`;
  modalEl.classList.remove('hidden');
}

const renderBoard = (board: string[][]) => {
  const fields = [];
  for (let [i, row] of board.entries()) {
    for (let [j, value] of row.entries()) {
      fields.push(`
        <div class="field ${value ? 'field--busy' : 'field--free'}" 
            data-row="${i}" 
            data-col="${j}"
            style="grid-row:${i + 1};grid-column:${j + 1};"
        >
          ${value || ''}
        </div>
      `);
    }
  }
  boardEl.innerHTML = fields.join('');
}
