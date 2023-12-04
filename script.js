const root = document.querySelector(".sudokuBoard");
const button = document.querySelector(".button");
const reset = document.querySelector(".reset");


// helpers functions
const splitArray = (array, part) => {
    var tmp = [];
    for (var i = 0; i < array.length; i += part) {
        tmp.push(array.slice(i, i + part));
    }
    return tmp;
}

// update , fill , reset and check is all numbers 0
const fillNumber = (sudoku) => {
    root.innerHTML = "";
    for (let i = 0; i < sudoku.length; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        if (i === 2 || i === 5 || i == 8) {
            row.classList.add('mBottom');
        }

        for (let j = 0; j < sudoku[0].length; j++) {
            const elem = document.createElement('div');
            elem.classList.add('box');
            elem.setAttribute('contenteditable', true)
            if (j === 2 || j === 5 || j === 8) {
                elem.classList.add('mRight');
            }
            elem.innerText = sudoku[i][j];
            row.appendChild(elem);
        }
        root.appendChild(row);
    }
}

const updateSudoku = (sudoku) => {
    const boxes = document.querySelectorAll('.box');
    const boxesArr = Array.from(boxes);

    const boxesArrIn2D = splitArray(boxesArr, 9);

    for (let i = 0; i < boxesArrIn2D.length; i++) {
        for (let j = 0; j < boxesArrIn2D[0].length; j++) {
            sudoku[i][j] = boxesArrIn2D[i][j].innerHTML;
        }
    }
    return sudoku;
}

const resetSudoku = (sudoku) => {
    fillNumber(sudoku);
}

const checkZeroSudoku = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            if (arr[i][j] != 0) {
                return false;
            }
        }
    }
    return true;
}


// check for valid board
const notInRow = (arr, row) => {
    // Set to store characters seen so far.
    let st = new Set();

    for (let i = 0; i < 9; i++) {

        // If already encountered before,
        // return false
        if (st.has(arr[row][i]))
            return false;

        // If it is not an empty cell, insert value
        // at the current cell in the set
        if (arr[row][i] != 0)
            st.add(arr[row][i]);
    }
    return true;
}

const notInCol = (arr, col) => {
    // Checks whether there is any duplicate
    // in current column or not.
    let st = new Set();

    for (let i = 0; i < 9; i++) {

        // If already encountered before,
        // return false
        if (st.has(arr[i][col]))
            return false;

        // If it is not an empty cell,
        // insert value at the current
        // cell in the set
        if (arr[i][col] != 0)
            st.add(arr[i][col]);
    }
    return true;
}


const notInBox = (arr, startRow, startCol) => {
    // Checks whether current row and current column and
    // current 3x3 box is valid or not
    let st = new Set();

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let curr = arr[row + startRow][col + startCol];

            // If already encountered before, return
            // false
            if (st.has(curr))
                return false;

            // If it is not an empty cell,
            // insert value at current cell in set
            if (curr != 0)
                st.add(curr);
        }
    }
    return true;
}


const isValid = (arr, row, col) => {
    return notInRow(arr, row) && notInCol(arr, col) &&
        notInBox(arr, row - row % 3, col - col % 3);
}


const isValidConfig = (arr, n) => {
    const isZeroSudoku = checkZeroSudoku(arr);
    if (isZeroSudoku) {
        return false;
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {

            // If current row or current column or
            // current 3x3 box is not valid, return
            // false
            if (!isValid(arr, i, j))
                return false;
        }
    }
    return true;
}


// solving sudoku
const isPoValid = (sudoku, po, row, col) => {
    // checkin row
    for (let j = 0; j < sudoku[0].length; j++) {
        if (sudoku[row][j] == po) {
            return false;
        }
    }
    // checkin col
    for (let i = 0; i < sudoku.length; i++) {
        if (sudoku[i][col] == po) {
            return false;
        }
    }

    // checkin 3x3 subMatrix
    let smi = Math.floor(row / 3) * 3;
    let smj = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (sudoku[smi + i][smj + j] == po) {
                return false;
            }
        }
    }
    return true;
}

const solveSudoku = (sudoku, row, col) => {
    if (row == sudoku.length) {
        fillNumber(sudoku)
        return;
    }

    let nRow = 0, nCol = 0;
    if (col == sudoku.length - 1) {
        nCol = 0;
        nRow = row + 1;
    } else {
        nCol = col + 1;
        nRow = row;
    }

    if (sudoku[row][col] != 0) {
        solveSudoku(sudoku, nRow, nCol);
    } else {
        for (let po = 1; po <= 9; po++) {
            if (isPoValid(sudoku, po, row, col) == true) {
                sudoku[row][col] = po;
                solveSudoku(sudoku, nRow, nCol);
                sudoku[row][col] = 0;
            }

        }
    }
}


// Programs starts here
const startProgram = () => {
    let sudoku = [
        [3, 0, 6, 0, 0, 8, 4, 0, 0],
        [5, 2, 0, 0, 0, 0, 0, 0, 0],
        [0, 8, 7, 0, 0, 0, 0, 3, 1],
        [0, 0, 3, 0, 1, 0, 0, 8, 0],
        [9, 0, 0, 8, 6, 3, 0, 0, 5],
        [0, 5, 0, 0, 9, 0, 6, 0, 0],
        [1, 3, 0, 0, 0, 0, 2, 5, 0],
        [0, 0, 0, 0, 0, 0, 0, 7, 4],
        [0, 0, 5, 2, 0, 1, 3, 0, 0],
    ];

    // storing for reset 
    let temp = sudoku;

    // creating initial board
    fillNumber(sudoku);


    // If solve clicked
    button.addEventListener('click', (e) => {
        // get new ui from ui and updating our board
        const updated = updateSudoku(sudoku);

        // checking is current board valid
        const valid = isValidConfig(updated, 9);
        if (!valid) {
            alert("Invalid Board");
            return;
        }

        // here code came means board is valid hence solve
        solveSudoku(sudoku, 0, 0);
    });

    // If reset btn clicked
    reset.addEventListener('click', (e) => {
        resetSudoku(temp);
    });
}

startProgram();

