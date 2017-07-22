document.addEventListener('DOMContentLoaded', function(e) {
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function newGame() {
    clearTextInput();
    answer = getRandomIntInclusive(MIN, MAX);

    message = NEW_GAME_MESSAGE;
    msgContainer.textContent = message;
    guesses = 0;
    guessLink.disabled = false;
  }

  function endGame() {
    guessLink.disabled = true;
  }

  function isValidGuess(guess) {
    return guess >= MIN && guess <= MAX;
  }

  function getResultMessage(guess) {
    if (!isValidGuess(guess)) return INVALID_GUESS_MESSAGE;

    guesses++;
    if (guess > answer) {
      return 'My number is lower than ' + String(guess);
    } else if (guess < answer) {
      return 'My number is higher than ' + String(guess);
    } else {
      return 'You guessed it!  It took you ' + guesses + ' guesses.';
    }
  }

  function clearTextInput() {
    form.reset();
  }

  function isCorrectGuess(guess) {
    return guess === answer;
  }

  var MIN = 1;
  var MAX = 100;

  var NEW_GAME_MESSAGE = 'Guess a number from ' + MIN + ' to ' + MAX;
  var INVALID_GUESS_MESSAGE = 'That is not a valid number.' +
                              ' Please enter another number.';

  var answer;
  var message;
  var guess;
  var guesses;

  var form = document.querySelector('form');
  var textInput = document.querySelector('#guess');
  var msgContainer = document.querySelector('main p');
  var newGameLink = document.querySelector('main a');
  var guessLink = document.querySelector('input[type="submit"]');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    guess = parseInt(textInput.value, 10);
    message = getResultMessage(guess);
    msgContainer.textContent = message;

    isCorrectGuess(guess) ? endGame() : clearTextInput();
  });

  newGameLink.addEventListener('click', function(e) {
    e.preventDefault();
    newGame();
  });

  newGame();
});