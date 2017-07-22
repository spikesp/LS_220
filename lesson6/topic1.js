function makeLogger(arg) {
  return function() {
    console.log(arg);
  };
}

function delayLog() {
  for (var i = 1; i <= 10; i++) {
    var logger = makeLogger(i);
    setTimeout(logger, i * 1000);
  }
}

// delayLog();
// 1  // 1 second later
// 2  // 2 seconds later
// 3  // 3 seconds later
// 4  // etc...
// 5
// 6
// 7
// 8
// 9
// 10

// setTimeout(function() {   // 1
//   console.log("Once");    // 5
// }, 1000);

// setTimeout(function() {   // 2
//   console.log("upon");    // 7
// }, 3000);

// setTimeout(function() {   // 3
//   console.log("a");       // 6
// }, 2000);

// setTimeout(function() {   // 4
//   console.log("time");    // 8
// }, 4000);

// setTimeout(function() {
//   setTimeout(function() {
//     q(); // 7
//   }, 15);

//   d(); // 3

//   setTimeout(function() {
//     n(); // 5
//   }, 5);

//   z();  // 4
// }, 10);

// setTimeout(function() {
//   s(); // 6
// }, 20);

// setTimeout(function() {
//   f(); // 2
// });

// g(); // 1

function afterNSeconds(cb, delay) {
  setTimeout(cb, delay * 1000);
}
