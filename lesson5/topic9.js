var html = document.childNodes[1];
var body = html.lastChild;
var heading = body.childNodes[1];
heading.style.color = 'red';
heading.style.fontSize = '48px';

function walk(node, callback) {
  callback(node);

  for (var i = 0; i < node.childNodes.length; i++) {
    walk(node.childNodes[i], callback);
  }
}

function countPs() {
  var count = 0;

  walk(body, function(node) {
    if (node.nodeName === 'P') {
      count++;
    }
  });

  return count;
}

function logFirstWords() {
  var result = [];

  walk(body, function(node) {
    if (node.nodeName === 'P') {
      result.push(node.textContent.trim().split(' ')[0]);
    }
  });

  return result;
}

var first = true;
walk(body, function(node) {
  if (node.nodeName === 'P') {
    if (first) {
      first = false;
    } else {
      node.className = 'stanza';
    }
  }
});

var images = [];
walk(document, function(node) {
  if (node.nodeName === 'IMG') {
    images.push(node);
  }
});
console.log(images.length);

var pngCount = images.filter(function(image) {
  return image.getAttribute('src').match(/^.*\.png$/);
}).length;
console.log(pngCount);

walk(document, function(node) {
  if (node.nodeName === "A") {
    node.style.color = 'red';
  }
});
