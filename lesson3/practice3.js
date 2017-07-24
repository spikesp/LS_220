var turk = {
  first_name: "Christopher",
  last_name: "Turk",
  occupation: "Surgeon",
  getDescription: function() {
    return this.first_name + ' ' + this.last_name + ' is a ' + this.occupation + '.';
  }
};

function logReturnVal(func, context) {
  var returnVal = func.call(context);
  console.log(returnVal);
}

var getTurkDescription = turk.getDescription.bind(turk);
// console.log(getTurkDescription());

var TESgames = {
  titles: ['Arena', 'Daggerfall', 'Morrowind', 'Oblivion', 'Skyrim'],
  seriesTitle: "The Elder Scrolls",
  listGames: function() {
    this.titles.forEach(function(title) {
      console.log(this.seriesTitle + ' ' + title);
    }, this);
  }
}

// TESgames.listGames();

// The Elder Scrolls Arena
// The Elder Scrolls Daggerfall
// The Elder Scrolls Morrowind
// The Elder Scrolls Oblivion
// The Elder Scrolls Skyrim

var foo = {
  a: 0,
  incrementA: function() {
    var increment = function() {
      this.a += 1;
    }.bind(this);

    increment();
    increment();
    increment();
  }
}

foo.incrementA();
foo.incrementA();
foo.incrementA();

console.log(foo.a);
