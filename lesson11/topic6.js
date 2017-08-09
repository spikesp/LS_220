// function getDefiningObject(object, propKey) {
  // if (object.hasOwnProperty(propKey)) return object;

  // var prototype = Object.getPrototypeOf(object);
  // if (prototype) {
  //   return getDefiningObject(prototype, propKey);
  // } else {
  //   return null;
  // }

  // while (object) {
  //   if (object.hasOwnProperty(propKey)) {
  //     return object;
  //   } else {
  //     object = Object.getPrototypeOf(object);
  //   }
  // }

  // return object;

//   while (object && !object.hasOwnProperty(propKey)) {
//     object = Object.getPrototypeOf(object);
//   }

//   return object;
// }

// var foo = {
//   a: 1,
//   b: 2
// };

// var bar = Object.create(foo);
// var baz = Object.create(bar);
// var qux = Object.create(baz);

// bar.c = 3;

// console.log(getDefiningObject(qux, 'c'));
// console.log(getDefiningObject(qux, 'c') === bar);     // true
// console.log(getDefiningObject(qux, 'e'));             // null

function shallowCopy(object) {
  var copy = Object.create(Object.getPrototypeOf(object));
  return extend(copy, object);
}

var foo = {
  a: 1,
  b: 2
};

var bar = Object.create(foo);
bar.c = 3;
bar.say = function() {
  console.log("c is " + this.c);
}

var baz = shallowCopy(bar);
console.log(baz.a);       // 1
baz.say();                // c is 3

function extend(destination) {
  var sources = [].slice.call(arguments, 1);

  sources.forEach(function(source) {
    Object.keys(source).forEach(function(key) {
      destination[key] = source[key];
    });
  });

  return destination;
}

var foo = {
  a: 0,
  b: {
    x: 1,
    y: 2
  }
};

var joe = {
  name: 'Joe'
};

var funcs = {
  sayHello: function() {
    console.log('Hello, ' + this.name);
  },

  sayGoodBye: function() {
    console.log('Goodbye, ' + this.name);
  }
};

var object = extend({}, foo, joe, funcs);
console.log(object.b.x);          // 1
object.sayHello();                // Hello, Joe
