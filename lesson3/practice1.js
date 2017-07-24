var foo = {
  a: 1,
  b: 2
};

var bar = {
   a: "abc",
   b: "def",
   add: function() {
     return this.a + this.b;
   }
};

// console.log(bar.add.call(foo)); // 3

var fruitsObj = {
  list: ['Apple', 'Banana', 'Grapefruit', 'Pineapple', 'Orange'],
  title: "A Collection of Fruit"
}


function outputList() {
  console.log(this.title + ':');

  var args = [].slice.call(arguments);

  args.forEach(function(elem) {
    console.log(elem);
  });
}

outputList.apply(fruitsObj, fruitsObj.list);

// A Collection of Fruit:
// Apple
// Banana
// Grapefruit
// Pineapple
// Orange
