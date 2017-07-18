function countUp(initial, target) {
  for (var i = initial; i <= target; i++) {
    console.log(i);
  }
}

function countDown(initial, target) {
  for (var i = initial; i >= target; i--) {
    console.log(i);
  }
}

function makeCounterLogger(initial) {
  return function(target) {
    if (target > initial) {
      countUp(initial, target);
    } else {
      countDown(initial, target);
    }
  };
};

var countlog = makeCounterLogger(5);
// countlog(8);
// 5
// 6
// 7
// 8


// countlog(2);
// 5
// 4
// 3
// 2

function printList(list) {
  list.forEach(function(item) {
    console.log(item);
  });

  if (list.length <= 0) {
    console.log('The list is empty');
  }
}

function itemInArray(list, message) {
  return getIndex(list, message) > -1;
}

function addTodo(list, message) {
  list.push(message);
}

function removeTodo(list, message, index) {
  list.splice(index, 1);
}

function getIndex(list, message) {
  return list.indexOf(message);
}

function makeList() {
  var list = [];

  return function(message) {
    if (message) {
      if (itemInArray(list, message)) {
        removeTodo(list, getIndex(list, message));
        console.log(message + ' removed!');
      } else {
        addTodo(list, message);
        console.log(message + ' added!');
      }
    } else {
      printList(list);
    }
  }
}

var list = makeList();
// list();
// The list is empty.

// list("make breakfast");
// make breakfast added!

// list("read book");
// read book added!

// list();
// make breakfast
// read book

// list('make breakfast');
// make breakfast removed!

// list();
// read book
