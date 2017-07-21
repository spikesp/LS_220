document.getElementById('primary_heading').setAttribute('class', 'heading');
document.getElementById('list').setAttribute('class', 'bulleted');

var toggleLink = document.getElementById('toggle');
toggleLink.onclick = function(e) {
  e.preventDefault();

  var noticeDiv = document.getElementById('notice');
  if (noticeDiv.getAttribute('class') === 'hidden') {
    noticeDiv.setAttribute('class', 'visible');
  } else {
    noticeDiv.setAttribute('class', 'hidden');
  }
};

var noticeDiv = document.getElementById('notice');
noticeDiv.onclick = function(e) {
  e.preventDefault();

  this.setAttribute('class', 'hidden');
};

var multiplicationP = document.getElementById('multiplication');
multiplicationP.innerText = String(13 * 9);

document.body.id = 'styled';
