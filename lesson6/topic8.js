document.onclick = function(e) {
  var x = document.querySelector('.x');
  x.style.top = String(e.clientY) + 'px';
  x.style.left = String(e.clientX) + 'px';
};

document.addEventListener('mousemove', function(e) {
  var x = document.querySelector('.x');
  x.style.top = String(e.clientY) + 'px';
  x.style.left = String(e.clientX) + 'px';
});

document.addEventListener('mousemove', function(e) {
  var x = document.querySelector('.x');
  x.style.top = String(e.clientY) + 'px';
  x.style.left = String(e.clientX) + 'px';
});

function changeXColor(color) {
  var x1 = document.querySelector('.x .horizontal');
  var x2 = document.querySelector('.x .vertical');
  x1.style.background = color;
  x2.style.background = color;
};

window.addEventListener('keyup', function(e) {
  switch (e.key) {
    case 'b': return changeXColor('blue');
    case 'g': return changeXColor('green');
    case 'r': return changeXColor('red');
  }
});
