var $document = $(document);
var $body     = $(document.body);
var $apples   = $('#apples');
var $word     = $('#word');
var $guesses  = $('#guesses');
var $message  = $('#message');
var $restart  = $('#restart');

var randomWord = (function() {
  var words = ['apple', 'banana', 'cherry', 'orange'];
  var copy = words.slice();

  return function() {
    if (!copy.length) return undefined;
    var index = Math.floor(Math.random() * (copy.length));
    var word = copy.splice(index, 1)[0];
    return word;
  };
}());

function makeLetter(letter) {
  return $('<span>', {class: 'letter', text: letter});
}

var Game = {
  gameWon: function() {
    return this.correctSpaces === this.word.length;
  },

  gameLost: function() {
  return !this.guesses;
  },

  duplicateGuess: function(letter) {
    return this.lettersGuessed.indexOf(letter) > -1;
  },

  isCorrectGuess: function(letter) {
    return this.word.indexOf(letter) > -1;
  },

  revealLetter: function(i) {
    $word.find('.letter').eq(i).text(this.word[i]);
  },

  showGuessesLeft: function() {
    $apples.removeClass().addClass('_' + this.guesses);
  },

  processFinishedGame: function(win) {
    var message   = win ? 'You win!' : 'Sorry! You\'re out of guesses';
    this.displayMessage(message);
    this.toggleRestartLink(true);
    this.setBackground(win ? 'win' : 'lose');
    this.unbind();
  },

  processCorrectGuess: function(letter) {
    this.word.forEach(function(l, i) {
      if (l === letter) {
        this.revealLetter.call(this, i);
        this.correctSpaces++;
      }
    }, this);

    if (this.gameWon()) this.processFinishedGame(true);
  },

  processIncorrectGuess: function() {
    this.guesses--;
    this.showGuessesLeft();
    if (this.gameLost()) this.processFinishedGame(false);
  },

  processGuess: function(e) {
    var code = e.which;
    if (code < 97 || code > 122) return;

    var letter = String.fromCharCode(code);
    if (this.duplicateGuess(letter)) return;

    this.lettersGuessed.push(letter);
    $guesses.append(makeLetter(letter));

    switch (this.isCorrectGuess(letter)) {
      case true:  return this.processCorrectGuess(letter);
      case false: return this.processIncorrectGuess();
    }
  },

  displayMessage: function(message) {
    $message.text(message);
  },

  toggleRestartLink: function(which) {
    $restart.toggle(which);
  },

  setBackground: function(status) {
    $body.removeClass();
    if (status) $body.addClass(status);
  },

  clearLetters: function() {
    $('.letter').remove();
  },

  clearLastGame: function() {
    this.setBackground();
    this.showGuessesLeft();
    this.displayMessage('');
    this.toggleRestartLink(false);
    this.clearLetters();
  },

  bind: function() {
    $document.on('keypress.game', this.processGuess.bind(this));
  },

  unbind: function() {
    $document.off('.game');
  },

  createSpaces: function() {
    this.word.forEach(function() {
      $word.append(makeLetter(''));
    });
  },

  init: function() {
    this.word = randomWord();
    this.guesses = 6;
    this.lettersGuessed = [];
    this.correctSpaces = 0;

    if (!this.word) {
      this.displayMessage('Sorry, I\'ve run out of words!');
      return this.toggleRestartLink(false);
    }
    this.word = this.word.split('');

    this.clearLastGame();
    this.bind();
    this.createSpaces();

    return this;
  },
};

$restart.on('click', function(e) {
  e.preventDefault();
  Object.create(Game).init();
}).trigger('click');
