document.addEventListener('DOMContentLoaded', function() {
  var textField = document.querySelector('.text-field');
  var content = document.querySelector('.content');

  var toggleCursorInterval;
  textField.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.add('focused');

    toggleCursorInterval = setInterval(function() {
      textField.classList.toggle('cursor');
    }, 500);
  });

  this.addEventListener('keydown', function(e) {
    if (textField.classList.contains('focused')) {
      var lastIdx = content.textContent.length - 1

      if (e.key === 'Backspace') {
        content.textContent = content.textContent.slice(0, lastIdx);
      } else {
        content.textContent += e.key;
      }
    }
  });

  this.addEventListener('click', function() {
    clearInterval(toggleCursorInterval);
    textField.classList.remove('focused', 'cursor');
  });
});
