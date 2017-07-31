$(function() {
  var catalog = [{
    "title": "The Legend of Zelda: Majora's Mask 3D",
    "id": 1,
    "category": "Nintendo 3DS"
  }, {
    "title": "Super Smash Bros.",
    "id": 2,
    "category": "Nintendo 3DS"
  }, {
    "title": "Super Smash Bros.",
    "id": 3,
    "category": "Nintendo WiiU"
  }, {
    "title": "LEGO Batman 3: Beyond Gotham",
    "id": 4,
    "category": "Nintendo WiiU"
  }, {
    "title": "LEGO Batman 3: Beyond Gotham",
    "id": 5,
    "category": "Xbox One"
  }, {
    "title": "LEGO Batman 3: Beyond Gotham",
    "id": 6,
    "category": "PlayStation 4"
  }, {
    "title": "Far Cry 4",
    "id": 7,
    "category": "PlayStation 4"
  }, {
    "title": "Far Cry 4",
    "id": 8,
    "category": "Xbox One"
  }, {
    "title": "Call of Duty: Advanced Warfare",
    "id": 9,
    "category": "PlayStation 4"
  }, {
    "title": "Call of Duty: Advanced Warfare",
    "id": 10,
    "category": "Xbox One"
  }];

  function returnUnique(array) {
    var unique = [];
    array.forEach(function(item) {
      if (unique.indexOf(item) === -1) {
        unique.push(item);
      }
    });
    return unique;
  }

  function populateGames() {
    var $gamesList = $('main ul');
    var $li;

    catalog.forEach(function(game) {
      $li = $('<li></li>');
      $li.text(game.title + ' for ' + game.category);
      $li.attr('data-id', game.id);
      $gamesList.append($li);
    });
  }

  function populateCategories() {
    var $categoriesList = $('aside ul');

    var categories = [];
    catalog.forEach(function(game) {
      categories.push(game.category);
    });

    var uniqueCategories = returnUnique(categories);

    uniqueCategories.forEach(function(category) {
      $li = $('<li></li>');
      $input = $('<input>').attr({
        type: 'checkbox',
        value: category,
        checked: 'checked',
      });
      $label = $('<label></label>').text(category);

      $label.prepend($input);
      $li.append($label);
      $categoriesList.append($li);
    });
  }

  function renderPage() {
    populateGames();
    populateCategories();
  }

  renderPage();

  var $inputs = $('aside input[type="checkbox"]');
  var $games = $('main li');

  $inputs.change(function() {
    var $input = $(this);
    var isChecked = $input.is(':checked');
    var category = $input.val();

    var $categoryGames = $games.filter(':contains(' + category + ')');
    $categoryGames.toggle(isChecked);

    // SOLUTION code:
    // var categoryGames = catalog.filter(function(game) {
    //   return game.category === category;
    // });

    // categoryGames.forEach(function(game) {
    //   $games.filter('[data-id=' + game.id + ']').toggle(isChecked);
    // });
  });
});