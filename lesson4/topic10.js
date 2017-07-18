function greet(greeting, name) {
  var capitalized = greeting[0].toUpperCase() + greeting.slice(1);
  var message = capitalized + '. ' + name + '!';
  console.log(message);
}

// console.log(greet("howdy", "Joe"));
// Howdy, Joe!

// console.log(greet("good morning", "Sue"));
// Good morning, Sue!

function partial(primary, arg1) {
  return function(arg2) {
    return primary(arg1, arg2);
  };
}

var sayHello = partial(greet, 'hello');
console.log(sayHello("Brandon"));
// Hello, Brandon!

var sayHi = partial(greet, 'hi');
console.log(sayHi("Sarah"));
// Hi, Sarah!
