/*=========================
    Enter key functionality
=========================*/

//Enter key functionality for the player name form inputs
//Most importantly call beginGame() when enter is pressed
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("firstname")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        beginGame();
      }
    });

  document
    .getElementById("lastname")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        beginGame();
      }
    });
});

// Enter key functionality for the guess input
// Calls userGuess() when enter is pressed
document.getElementById("guess").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    userGuess();
  }
});

/*=========================
    Variable Declarations
=========================*/
//I decided to do programming related words for the hangman game, particularlly JavaScript related!
const words = [
  "JavaScript",
  "Programming",
  "Developer",
  "Function",
  "Variable",
  "Constant",
  "Array",
  "Object",
  "Browser",
  "Document",
  "Element",
  "Event",
  "Operator",
  "Scope",
  "Boolean",
  "Iteration",
  "Conditional",
  "Statement",
  "Loop",
  "String",
  "Integer",
  "Syntax",
  "Parameter",
  "Argument",
  "Console",
  "Debugging",
  "Switch",
  "Case",
  "Break",
  "Return",
  "Null",
  "Undefined",
];

//This is how I'm able to get the word in order to test as well as show! Without this I'd be meanlessly clicking keys trying to present hahaha (azmi is my middle name)
const owner = "azmi";
//Shortest word length inorder to check if valid guess, if (guess.length > 1 && guess.length <shortestWord) the guess is invalid
//this was the nifty logic I came up eliminate the edge cases that come with having both word guesses and letter guesses
const shortestWord = 4;
let word = words[Math.floor(Math.random() * words.length)];
let guessedLetters = [];
let maxAttempts = 6;
let attemptsLeft = maxAttempts;
let playerScore = 0;
let displayWord = "";
let gameOver = false;

// Object Literal for the player object
const player = {
  firstName: "",
  lastName: "",
  getFullName() {
    return (this.firstName + " " + this.lastName).trim();
  },
  score: 0,
};

/*=========================
    Animate Player Form on Load
=========================*/
window.onload = function animatePlayerForm() {
  anime({
    targets: "#playerForm",
    scale: [0, 1],
    opacity: [0, 1],
    duration: 900,
    easing: "easeOutBack",
  });
};

/*=========================
    Update Score Logic
=========================*/

function updateScore() {
  document.getElementById("scoreBoard").innerHTML = "Score: " + playerScore;
}

/*=========================
    Start Round Logic
=========================*/

function startRound() {
    
  /*selects a random word from the words array, by receiving a random integer (from 0 to words.length - 1 (random's don't include the number they go up to)) 
rounded to the nearest whole number (because the random number is being used as an index) */
  word = words[Math.floor(Math.random() * words.length)];
  //Reset the display word, guessed letters, attempts left, and clear the hangman figure for the new round
  displayWord = "_ ".repeat(word.length).trim();
  guessedLetters = [];
  attemptsLeft = maxAttempts;
  clearFigure();
  document.getElementById("word").innerHTML = displayWord;
  document.getElementById("guessedLetters").innerHTML = "Guessed Letters: ";
}

/*=========================
    Begin Game Logic
=========================*/

function beginGame() {

  // Validate that at least one name field is filled
  if (document.getElementById("firstname").value.trim() === "" && document.getElementById("lastname").value.trim() === "") {
    alert("Please enter at least one name to begin the game.");
    return;
  }

  // Set player name and display welcome message
  player.firstName = document.getElementById("firstname").value;
  player.lastName = document.getElementById("lastname").value;
  document.getElementById("displayName").innerHTML = player.getFullName();

  //Display the welcome message with the given player's name
  alert("Welcome, " + player.getFullName() + "! Let the games... BEGIN!");

  //day 5 lab DOM - hides the form after starting the game
  document.getElementById("playerForm").style.display = "none";

  //Show the game area after the form is hidden
  document.getElementById("gameArea").style.display = "block";

  //title and gamearea animation using anime.js
  anime({
    targets: ["#gameTitle", "#gameArea"],
    scale: [0, 1],
    opacity: [0, 1],
    duration: 900,
    easing: "easeOutBack",
  });

  //Call the startRound function to initialize the game
  startRound();
}

/*=========================
    Reveal Word method 
=========================*/
function revealWord() {
  // Show the actual word spaced out like the underscores
  displayWord = word.split("").join(" ");
  document.getElementById("word").innerHTML = displayWord;
}

/*=========================
    User Guess Logic
=========================*/
function userGuess() {
  //debugging
  console.log("User guess function called");
  //setting guess variable to the value of the input field, trimmed and converted to lowercase
  const guess = document.getElementById("guess").value.trim().toLowerCase();
  // Clear the input field after getting the guess
  document.getElementById("guess").value = "";
  const correctWord = word.toLowerCase();

  //If guess is empty
  if (guess == "") {
    alert("Please enter a guess.");
    //owner case
  } else if (guess === owner.toLowerCase()) {
    alert("Here is the word: " + correctWord);
    //invalid guess length case
  } else if (guess.length > 1 && guess.length < shortestWord) {
    alert("Invalid guess, I'll let you off this time...");
    //already guessed letter case
  } else if (guess.length === 1 && guessedLetters.includes(guess)) {
    alert(
      "You already guessed the letter '" + guess + "'. Try a different letter!"
    );
    //Wrong word guess case
  } else if (guess.length > 1 && guess !== correctWord) {
    alert("Wrong Guess. Try again!");
    attemptsLeft--;
    updateFigureFromAttempts();

    // If the player used their last attempt
    if (attemptsLeft === 0) {
      revealWord();
      setTimeout(() => {
        alert("Game over! The word was: " + correctWord);
        gameOver = true;
        playerScore = 0;
        updateScore();
        startRound();
      }, 100);
    }
    // Correct word guess case
  } else if (guess === correctWord) {
    // Flash correct guess effect on post and word display
    const post = document.getElementById("hangman-post");
    post.classList.add("flash-right");

    const wordDisplay = document.getElementById("word");
    wordDisplay.classList.add("flash-right");

    // Reveal the word
    revealWord();

    //(Special case for fun!!!)
    if (word === "Undefined") {
      setTimeout(() => {
        alert(
          "It's better to be undefined, why put yourself into a box :)\nHere is two for finding the special word!"
        );
        playerScore += 2;
        document.getElementById("scoreBoard").innerHTML =
          "Score: " + playerScore;
        updateScore();
        startRound();
      }, 1000);
    }

    setTimeout(() => {
      alert("Correct! The word was " + correctWord);
      playerScore++;
      updateScore();
      startRound();
      post.classList.remove("flash-right");
      wordDisplay.classList.remove("flash-right");
    }, 100);

    // Correct letter guess case
  } else if (guess.length === 1 && word.toLowerCase().includes(guess)) {
    const post = document.getElementById("hangman-post");
    post.classList.add("flash-right");

    setTimeout(() => {
      guessedLetters.push(guess);
      alert("You found a letter in the word!");
      post.classList.remove("flash-right");
    }, 100);

    // Updates the guessed letters
    document.getElementById("guessedLetters").innerHTML =
      "Guessed Letters: " + guessedLetters.join(", ");

    //Reveals the guessed letter (loops through the word and replaces the underscores with the guessed letter)
    let letters = displayWord.split(" ");
    let index = 0;
    for (const char of word) {
      if (char.toLowerCase() === guess.toLowerCase()) {
        letters[index] = char;
      }
      index++;
    }

    displayWord = letters.join(" ");
    document.getElementById("word").innerHTML = displayWord;

    // Checks if the word is complete and is not special word
    if (!displayWord.includes("_") && word !== "Undefined") {
     // Flash correct guess effect on post and word display
      const wordDisplay = document.getElementById("word");
      wordDisplay.classList.add("flash-right");
      setTimeout(() => {
        alert("Congratulations on completing " + word + "!");
        playerScore++;
        document.getElementById("scoreBoard").innerHTML =
          "Score: " + playerScore;
        post.classList.remove("flash-right");
        wordDisplay.classList.remove("flash-right");
        updateScore();
        startRound();
      }, 100);
    } else {
      setTimeout(() => {
        post.classList.remove("flash-right");
      }, 100);
    }
    // Special Case: Check if the word is the bonus word "Undefined"
    if (!displayWord.includes("_") && word === "Undefined") {
      setTimeout(() => {
        alert(
          "It's better to be undefined, why put yourself into a box :)\nHere is two for finding the special word!"
        );
        playerScore += 2;
        document.getElementById("scoreBoard").innerHTML =
          "Score: " + playerScore;
        updateScore();
        startRound();
      }, 100);
    }
    // Wrong letter guess case
  } else {
    attemptsLeft--;
    updateFigureFromAttempts();
    //add to guessed letter
    guessedLetters.push(guess);

    // Update the guessed letters display
    document.getElementById("guessedLetters").innerHTML =
      "Guessed Letters: " + guessedLetters.join(", ");

    // Flash the guessed letters display to indicate a wrong guess
    const post = document.getElementById("hangman-post");
    post.classList.add("flash-wrong");

    // Remove the flash effect after a short delay
    setTimeout(() => {
      post.classList.remove("flash-wrong");
    }, 100);

    // If the player used their last attempt
    if (attemptsLeft === 0) {
      revealWord();
      const wordDisplay = document.getElementById("word");
      wordDisplay.classList.add("flash-wrong");
      setTimeout(() => {
        alert("Game over!");
        gameOver = true;
        playerScore = 0;
        post.classList.remove("flash-wrong");
        wordDisplay.classList.remove("flash-wrong");
        updateScore();
        startRound();
      }, 100);
      // Wrong guess but the player has still got a chance
    } else {
      setTimeout(() => {
        alert(
          "Wrong guess. " + attemptsLeft + " attempts left." + " Try again!"
        );
        post.classList.remove("flash-wrong");
      }, 100);
    }
  }
}

/*=========================
    Drawing Hangman
=========================*/
//Hangman post
document.getElementById("hangman-post").innerText =
  "  +----+\n" +
  "  |    |\n" +
  "  |    \n" +
  "  |    \n" +
  "  |    \n" +
  "  |    \n" +
  "__|__  ";

// Hangman figure
const figure = document.getElementById("hangman-figure");
figure.innerText = "";

function drawHead() {
  figure.innerText =
    "  +----+\n" +
    "  |    |\n" +
    "  |    O\n" +
    "  |    \n" +
    "  |    \n" +
    "  |    \n" +
    "__|__  ";
}

function drawBody() {
  figure.innerText =
    "  +----+\n" +
    "  |    |\n" +
    "  |    O\n" +
    "  |    |\n" +
    "  |    \n" +
    "  |    \n" +
    "__|__  ";
}

function drawLeftArm() {
  figure.innerText =
    "  +----+\n" +
    "  |    |\n" +
    "  |    O\n" +
    "  |   /|\n" +
    "  |    \n" +
    "  |    \n" +
    "__|__  ";
}

//You're probably wondering why the hangman drawing functions above are different from the ones below.
//The reasion is that there was an issue with the arms and legs not displaying properly (there would be two arms). 
//This was my workaround to make sure that the pre's would display correctly.
//In the css, the figure and the post are oriented on top of eachother, that was the easiest way in my head!

function drawRightArm() {
  figure.innerText =
    "        \n" +
    "        \n" +
    "        O\n" +
    "       /|\\\n" +
    "       \n" +
    "       \n" +
    "        ";
}

function drawLeftLeg() {
  figure.innerText =
    "        \n" +
    "        \n" +
    "        O\n" +
    "       /|\\\n" +
    "       / \n" +
    "       \n" +
    "        ";
}

function drawRightLeg() {
  figure.innerText =
    "        \n" +
    "        \n" +
    "        O\n" +
    "       /|\\\n" +
    "       / \\\n" +
    "       \n" +
    "        ";
}

// Clear the hangman figure
function clearFigure() {
  figure.innerText = "";
}

// Update the hangman figure based on attempts left
function updateFigureFromAttempts() {
  const wrongGuesses = maxAttempts - attemptsLeft;
  if (wrongGuesses <= 0) {
    clearFigure();
  } else if (wrongGuesses === 1) {
    drawHead();
  } else if (wrongGuesses === 2) {
    drawBody();
  } else if (wrongGuesses === 3) {
    drawLeftArm();
  } else if (wrongGuesses === 4) {
    drawRightArm();
  } else if (wrongGuesses === 5) {
    drawLeftLeg();
  } else if (wrongGuesses >= 6) {
    drawRightLeg();
  }
}

