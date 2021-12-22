let randomWord = function () {
    let words = ["apple", "banana", "orange", "pear"];
    
    return function () {
        let randomIndex = rngInclusive(0, words.length - 1);
        return words.splice(randomIndex, 1).pop();
    };
}();

function rngInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}




