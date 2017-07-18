function getIndex(list, message) {
  return list.indexOf(message);
}

function itemInList(list, message) {
  return getIndex(list, message) > -1;
}

function makeList() {
  var items = [];

  return {
    list: function() {
      items.forEach(function(item) {
        console.log(item);
      });

      if (items.length <= 0) {
        console.log('The list is empty');
      }
    },

    add: function(message) {
      var index = getIndex(items, message);
      if (!itemInList(items, message)) {
        items.push(message);
        console.log(message + ' added!');
      }
    },

    remove: function(message) {
      var index = getIndex(items, message);
      if (itemInList(items, message)) {
        items.splice(index, 1);
        console.log(message + ' removed!');
      }
    },
  };
}

var list = makeList();

// list.add("peas");
// peas added!

// list.list();
// peas

// list.add("corn");
// corn added!

// list.list();
// peas
// corn

// list.remove("peas");
// peas removed!

// list.list();
// corn
