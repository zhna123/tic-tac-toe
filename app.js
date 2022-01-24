const GameBoard = function() {
    const gameboard = [[], [], []];

    const spotAvailable = function(rowInd, colInd) {
        return !gameboard[rowInd][colInd] ? true : false;
    }

    const threeInARow = function() {

        if (gameboard[0][0] 
            && gameboard[0][0] === gameboard[0][1] 
            && gameboard[0][0] === gameboard[0][2]) {

                return [true, [0, 0], [0, 1], [0, 2]];
            }

        if (gameboard[1][0] 
            && gameboard[1][0] === gameboard[1][1] 
            && gameboard[1][0] === gameboard[1][2]) {
                return [true, [1, 0], [1, 1], [1, 2]];
            }

        if (gameboard[2][0] 
            && gameboard[2][0] === gameboard[2][1] 
            && gameboard[2][0] === gameboard[2][2]) {
                return [true, [2, 0], [2, 1], [2, 2]];
            }

        return [false];
    }

    const threeInAColumn = function() {
        if (gameboard[0][0] 
            && gameboard[0][0] === gameboard[1][0] 
            && gameboard[0][0] === gameboard[2][0]) {
                return [true, [0, 0], [1, 0], [2, 0]];
            }

        if (gameboard[0][1] 
            && gameboard[0][1] === gameboard[1][1] 
            && gameboard[0][1] === gameboard[2][1]) {
                return [true, [0, 1], [1, 1], [2, 1]];
            }

        if (gameboard[0][2] 
            && gameboard[0][2] === gameboard[1][2] 
            && gameboard[0][2] === gameboard[2][2]) {
                return [true, [0, 2], [1, 2], [2, 2]];
            }

        return [false];
    }

    const diagonal = function() {
        if (gameboard[0][0] 
            && gameboard[0][0] === gameboard[1][1] 
            && gameboard[0][0] === gameboard[2][2]) {
                return [true, [0, 0], [1, 1], [2, 2]];
            }

        if (gameboard[0][2] 
            && gameboard[0][2] === gameboard[1][1] 
            && gameboard[0][2] === gameboard[2][0]) {
                return [true, [0, 2], [1, 1], [2, 0]];
            }

        return [false];
                
    }

    const noSpotLeft = function() {
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                if(!gameboard[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    const checkGameResults = function() {

        if (threeInARow()[0]) {
            return threeInARow().slice(1);
        }
        if (threeInAColumn()[0]) {
            return threeInAColumn().slice(1);
        }
        if (diagonal()[0]) {
            return diagonal().slice(1);
        }
        if (noSpotLeft()) {
            // tie
            return 0;
        }
        // game still going
        return -1;
    }

    return {gameboard, spotAvailable, checkGameResults}
}();

const Game = function() {

    let currentPlayer;

    const displayResult = function(gameboardDiv, path, displayText) {
        if (path !== 0) {
            const rowDivs = Array.from(document.querySelectorAll('.rowDiv'));
            rowDivs.forEach((row, rowInd) => {
                const colDivs = Array.from(row.querySelectorAll('.colDiv'));
                colDivs.forEach((col, colInd) => {
                    if (rowInd === path[0][0] && colInd === path[0][1] ||
                        (rowInd === path[1][0] && colInd === path[1][1]) ||
                        (rowInd === path[2][0] && colInd === path[2][1])) {
                            col.style.color = "red";
                        }
                })
            });
        }
        setTimeout(showResultDiv, 500, gameboardDiv, displayText);
    }

    const showResultDiv = function(gameboardDiv, displayText) {
        gameboardDiv.style.display = "none";

        const playerHintDiv = document.querySelector('.playerHint');
        playerHintDiv.style.display = "none";

        const body = document.querySelector('body');
        const resultDiv = document.createElement("div");
        resultDiv.classList.add('resultDiv');
        resultDiv.textContent = displayText;
        body.appendChild(resultDiv);

        const restartBtn = document.createElement('button');
        restartBtn.classList.add('btn')
        restartBtn.textContent = 'Play Again'
        body.appendChild(restartBtn);
        restartBtn.addEventListener("click", function(e) {
            location.reload();
        })
    }

    // player1 always goes first
    const start = function(player1, player2, level) {
        currentPlayer = player1;
        if (player1.name !== 'Computer' && player2.name !== 'Computer') {
            const playerHintDiv = document.querySelector('.playerHint > h3 > span');
            playerHintDiv.textContent = currentPlayer.name;
        }
        // computer goes first
        if (currentPlayer.name === 'Computer') {
            computerMove(currentPlayer.symbol, level);
            currentPlayer = player2;
        }

        const gameboardDiv = document.querySelector('.gameboard');
        const rowDiv = Array.from(gameboardDiv.querySelectorAll(".rowDiv"));
        rowDiv.forEach((row, rowInd) => {
            const colDiv = Array.from(row.querySelectorAll('.colDiv'));
            colDiv.forEach((col, colInd) => {
                col.addEventListener("click", function(event) {

                    // check spots already taken
                    if (GameBoard.spotAvailable(rowInd, colInd)) {
                        event.target.textContent = currentPlayer.symbol;
                        GameBoard.gameboard[rowInd][colInd] = currentPlayer.symbol;
                    }
                    if (!ischeckGameResults(gameboardDiv, currentPlayer.name)) {
                        switchPlayers(player1, player2);

                        computerMove(currentPlayer.symbol, level);
                        if (!ischeckGameResults(gameboardDiv, currentPlayer.name)) {
                            switchPlayers(player1, player2);
                        }
                    }
                })
            });
        });
    }

    const ischeckGameResults = function(gameboardDiv, playerName) {
        if  (Array.isArray(GameBoard.checkGameResults())) {
            console.log(`${playerName} won!`)
            console.log(GameBoard.checkGameResults())
            displayResult(gameboardDiv, GameBoard.checkGameResults(), `${playerName} won!`)
            return true;

        }  else if (GameBoard.checkGameResults() === 0) {
            console.log(`A Tie.`)
            displayResult(gameboardDiv, 0, `A tie!`)
            return true;
        }
        return false;
    }

    const switchPlayers = function(player1, player2) {
        if(currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
        if (player1.name !== 'Computer' && player2.name !== 'Computer') {
            playerHintDiv.textContent = currentPlayer.name;
        }
    }

    const generateRandomIndex = function(arrayLen) {
        return Math.floor(Math.random() * 10 % arrayLen)
    }

    const computerMove = function(symbol, level) {
        let rowInd;
        let colInd;

        if (level === 1) {
            //  minimax algorithm - unbeatable AI
            
        } else {
        // random generate numbers for index within their ranges
            do {
                rowInd = generateRandomIndex(3);
                colInd = generateRandomIndex(3);    
            } while (!GameBoard.spotAvailable(rowInd, colInd))
        }

        GameBoard.gameboard[rowInd][colInd] = symbol;

        const gameboardDiv = document.querySelector('.gameboard');
        const rowDiv = Array.from(gameboardDiv.querySelectorAll(".rowDiv"));
        rowDiv.forEach((row, rInd) => {
            if (rInd === rowInd) {
                const colDiv = Array.from(row.querySelectorAll(".colDiv"));
                colDiv.forEach((col, cInd) => {
                    if (cInd === colInd) {
                        col.textContent = symbol;
                    }
                });
            }
        })
    }

    return {start}
}()

const Player = function(name, symbol) {
    return {name, symbol}
}

const InformationForm = function(document) {

    const submitForm = function() {
        const form = document.querySelector("#player_info");
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            let player1;
            let player2;
            let level = 0;

            const player1Name = form.elements['name1'].value;
            const player2Name = form.elements['name2'].value;
            if (player1Name && player2Name) {
                player1 = Player(player1Name, 'O');
                player2 = Player(player2Name, 'X')
                showPlayerHint(document);
            } else {
                level = form.elements['level'].value;
                if (level === 'hard') {
                    level = 1;
                }
                const symbol = form.elements['symbol'].value;
                if (symbol === 'o') {
                    player1 = Player("You", 'O');
                    player2 = Player("Computer", 'X')
                } else {
                    player1 = Player("Computer", 'O');
                    player2 = Player("You", 'X')
                }
            }
            closeForm(document);
            Game.start(player1, player2, level);

        })
    }

    function closeForm(document) {
        document.querySelector('.player_form_container').style.display = 'none';
        document.querySelector('.gameboard').style.display = 'flex';
    }

    function showPlayerHint(document) {
        document.querySelector('.playerHint').style.display = 'block';
    }

    return {submitForm}
}

const infoForm = InformationForm(document).submitForm();

// checkbox 
const checkbox = document.querySelector("#computer");
const player1Textbox = document.querySelector("#name1")
const player2Textbox = document.querySelector("#name2")
const levelTitle = document.querySelector(".levelTitle");
const levelRadio = Array.from(document.querySelectorAll(".level"));
const symbolTitle = document.querySelector(".symbolTitle");
const symbolRadio = Array.from(document.querySelectorAll(".symbol"));

checkbox.addEventListener("change", function(e) {

    if (e.target.checked) {
        player1Textbox.value = null;
        player2Textbox.value = null;
        player1Textbox.disabled = true;
        player2Textbox.disabled = true;

        levelTitle.style.display = "block";
        levelRadio.forEach(level => {
            level.style.display = "block";
        })
        symbolTitle.style.display = "block";
        symbolRadio.forEach(symbol => {
            symbol.style.display = "block";
        })
    }
    if (!e.target.checked) {
        player1Textbox.disabled = false;
        player2Textbox.disabled = false;

        levelTitle.style.display = "none";
        levelRadio.forEach(level => {
            level.style.display = "none";
        })
        symbolTitle.style.display = "none";
        symbolRadio.forEach(symbol => {
            symbol.style.display = "none";
        })
    }

});





