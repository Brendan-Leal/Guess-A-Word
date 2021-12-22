class GuessWordGame {
    constructor() {
        this.words = ["apple", "banana", "orange", "pear"];
        this.answer = null;
        this.spaces = document.getElementById("spaces");
        this.apples = document.querySelector("#apples");
        this.numberOfIncorrectGuesses = 0;
        this.totalGuessesAllowed = 6;
        this.guessesMade = [];
        this.keyDownHandler = null;

        this.initApples();
    }

    initApples() {
        let apples = document.querySelector("#apples-template");
        this.template = Handlebars.compile(apples.innerHTML);
    }

    bindEvents() {
        this.keyDownHandler = this.handleKeyDown.bind(this);
        document.addEventListener("keydown", this.keyDownHandler);
        document.querySelector("#replay").onclick = this.handlePlayAgain.bind(this);
    }

    handlePlayAgain(event) {
        event.preventDefault();
        if (this.words.length > 0) {
            this.newGame();
        } else {
            document.querySelector("#message").innerHTML = "Sorry, there are no more words to guess.";
        }
    }

    handleKeyDown(event) {
        let key = event.key.toLowerCase();

        if (this.isValidKey(key) && this.isNewGuess(key)) {
            if (this.correctGuess(key)) {
                this.guessesMade.push(key);
                this.insertCharInSpaces(key);
            } else {
                this.guessesMade.push(key);
                this.numberOfIncorrectGuesses += 1;
                this.insertCharInGuesses(key);
                this.updateApples();
            }
        }

        if (this.isGameOver()) {
            this.endGame();
        }
    }

    endGame() {
        let endGameMessage = document.querySelector("#message");
        if (this.isWinner()) {
            document.body.setAttribute("class", "win");
            endGameMessage.innerHTML = "You Win!";
        } else if (this.isLoser()) {
            document.body.setAttribute("class", "lose");
            endGameMessage.innerHTML = "You Lose :(";
        }
        document.removeEventListener("keydown", this.keyDownHandler);
    }

    isGameOver() {
        return this.wordComplete() || this.numberOfIncorrectGuesses === this.totalGuessesAllowed;
    }

    isWinner() {
        return this.wordComplete() && this.numberOfIncorrectGuesses < this.totalGuessesAllowed;
    }

    isLoser() {
        return this.numberOfIncorrectGuesses === this.totalGuessesAllowed;
    }

    wordComplete() {
        let charSpan = document.querySelectorAll("#spaces > span");
        charSpan = Array.prototype.slice.call(charSpan);

        let word = charSpan.map(span => span.innerHTML).join("");
        console.log(word);
        return word === this.answer;
    }

    isNewGuess(key) {
        return !this.guessesMade.includes(key);
    }

    updateApples() {
        document.querySelector("#tree").innerHTML = this.template({ number: this.numberOfIncorrectGuesses });
    }

    isValidKey(key) {
        return key.match(/[a-z]/i) && key.length === 1;
    }

    correctGuess(key) {
        return this.answer.includes(key);
    }

    insertCharInSpaces(key) {
        let spaces = document.querySelectorAll(".char_space");
        spaces = Array.prototype.slice.call(spaces);

        spaces.forEach((space, index) => {
            if (!space.innerHTML && key === this.answer[index]) {
                space.innerHTML = key;
            }
        });
    }

    insertCharInGuesses(key) {
        let guessSpace = document.createElement("span");
        guessSpace.innerHTML = key;

        document.querySelector("#guesses").insertAdjacentElement("beforeend", guessSpace);
    }

    newGame() {
        let randomIndex = this.rngInclusive(0, this.words.length - 1);

        this.answer = this.words.splice(randomIndex, 1).pop();
        this.numberOfIncorrectGuesses = 0;
        this.totalGuessesAllowed = 6;
        this.guessesMade = [];
        this.keyDownHandler = null;
        this.bindEvents();
        this.resetCharSpaces();
        this.setBlankSpaces();

        document.querySelector("#tree").innerHTML = this.template({ number: this.numberOfIncorrectGuesses });

        document.body.removeAttribute("class");
    }

    rngInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    resetCharSpaces() {
        if (this.spaces.childElementCount > 1) {
            let childElements = this.spaces.children;
            childElements = Array.prototype.slice.call(childElements);
            for (let i = 1; i < childElements.length; i++) {
                childElements[i].remove();
            }
        }

        let guessSpaces = document.querySelector("#guesses");
        if (guessSpaces.childElementCount > 1) {
            let childElements = guessSpaces.children;
            childElements = Array.prototype.slice.call(childElements);

            for (let i = 1; i < childElements.length; i++) {
                childElements[i].remove();
            }
        }
    }

    setBlankSpaces() {
        for (let count = 0; count < this.answer.length; count++) {
            let blankSpan = document.createElement("span");
            blankSpan.setAttribute("class", "char_space");
            this.spaces.insertAdjacentElement("beforeend", blankSpan);
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    let game = new GuessWordGame();
    game.newGame();
});