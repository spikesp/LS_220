var nodes = document.body.childNodes;

function getP() {
  var allPs = [];

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeName === 'P') {
      allPs.push(nodes[i]);
    }
  }

  return allPs;
}

console.log(getP());

function addClassToP(node) {
  if (node.nodeName === 'P') {
    node.className = 'article-text';
  }

  var childNodes = node.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    addClassToP(childNodes[i]);
  }
}

addClassToP(document.body);

function walk(node, callback) {
  callback(node);

  for (var i = 0; i < node.childNodes.length; i++) {
    walk(node.childNodes[i], callback);
  }
}

function getElementsByTagName(tagName) {
  var elements = [];
  walk(document.body, function(node) {
    if (node.nodeName === tagName.toUpperCase()) {
      elements.push(node);
    }
  });
  return elements;
}

var allParagraphs = getElementsByTagName('p');
allParagraphs.forEach(function(p) {
  p.className = 'article-text';
});

var allParagraphs = document.getElementsByTagName('p');
allParagraphs = Array.prototype.slice.call(allParagraphs);

allParagraphs.forEach(function(p) {
  p.classList.add('article-text');
});

var introDivs = document.getElementsByClassName('intro');
var nestedPs;

for (var i = 0; i < introDivs.length; i++) {
  nestedPs = introDivs[i].getElementsByTagName('p');
  for (var j = 0; j < nestedPs.length; j++) {
    nestedPs[j].classList.add('article-text');
  }
}

var introDivs = document.getElementsByClassName('intro');
var nestedPs;

for (var i = 0; i < introDivs.length; i++) {
  nestedPs = introDivs[i].getElementsByTagName('p');
  for (var j = 0; j < nestedPs.length; j++) {
    nestedPs[j].classList.add('article-text');
  }
}
