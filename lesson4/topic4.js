function makeMultipleLister(integer) {
  return function() {
    for (var i = integer; i < 100; i += integer) {
      console.log(i);
    }
  };
}

var lister = makeMultipleLister(13);

// lister();
// 13
// 26
// 39
// 52
// 65
// 78
// 91

var total = 0;

function add(num) {
  total += num;
  console.log(total);
}

function subtract(num) {
  total -= num;
  console.log(total);
}

// add(1);
// 1

// add(42);
// 43

// subtract(39);
// 4

// add(6);
// 10

function later(func, arg) {
  return function() {
    func(arg);
  };
}

var logWarning = later(console.log, 'The system is shutting down!');

// logWarning();
// The system is shutting down!

function startup() {
  var status = 'ready';
  return function() {
    console.log('The system is ready.');
  }
}

var ready = startup();
// var systemStatus = ready.status;
