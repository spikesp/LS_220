var allH2s = document.getElementsByTagName('h2');
allH2s = Array.prototype.slice.call(allH2s);

var h2Text;
allH2s.map(function(h2) {
  h2Text = h2.textContent.trim();
  return h2Text.split(' ').length;
});

document.getElementById('toc');
document.getElementsByClassName('toc')[0];
document.querySelector('#toc');

var tocLinks = document.querySelectorAll('#toc a');
for (var i = 0; i < tocLinks.length; i += 2) {
  tocLinks[i].style.color = 'green';
}

var thumbCaptions = document.getElementsByClassName('thumbcaption');
var thumbCaptionsArray = Array.prototype.slice.call(thumbCaptions);

thumbCaptionsArray.map(function(thumbCaption) {
  return thumbCaption.textContent.trim();
});

var RANKS = ['Kingdom', 'Phylum', 'Class', 'Order', 'Suborder',
             'Family', 'Genus', 'Species'];

var classification = {};
var tds = document.querySelectorAll('.infobox td');
console.log(tds);

for (var i = 0; i < tds.length; i++) {
  var cell = tds[i];

  RANKS.forEach(function(rank) {
    if (cell.textContent.indexOf(rank) > -1) {
      var link = cell.nextElementSibling.firstElementChild;
      classification[rank] = link.textContent;
    }
  });
}

console.log(classification);
