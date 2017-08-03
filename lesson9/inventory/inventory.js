var helpers = {
  getKeyFromInputName: function(inputName) {
    return inputName.replace(/(^item_|_\d+$)/g, '')
                    .replace(/_[a-z]/g, function(match) {
                      return match[1].toUpperCase();
                    });
  },
  getParent: function(e) {
    return $(e.target).closest('tr');
  },
  getItemId: function(e) {
    var $row = this.getParent(e);
    return Number($row.find('input[name^=item_id]').val());
  },
};

var inventory;

(function() {
  inventory = {
    lastId: 0,
    collection: [],
    defaultItem : {
      name: '',
      stockNumber: '',
      quantity: 1,
    },
    listeners: {
      addItem: function() {
        var item = this.add();
        var html = this.template(item);
        $('#inventory').append(html);
      },
      deleteItem: function(e) {
        e.preventDefault();
        helpers.getParent(e).remove();
        var id = helpers.getItemId(e);
        this.delete(id);
      },
      updateItem: function(e) {
        var inputName = $(e.target).attr('name');
        var value = $(e.target).val();
        var key = helpers.getKeyFromInputName(inputName);
        var id = helpers.getItemId(e);
        this.update(id, key, value);
      },
    },
    getItemById: function(id) {
      return this.collection.filter(function(item) {
        return item.id === id;
      })[0];
    },
    add: function() {
      this.lastId++;
      var item = $.extend({id: this.lastId}, this.defaultItem);
      this.collection.push(item);
      return item;
    },
    update: function(id, key, value) {
      var item = this.getItemById(id);
      item[key] = value;
    },
    delete: function(id) {
      var item = this.getItemById(id);
      var index = this.collection.indexOf(item);
      this.collection.splice(index, 1);
    },
    setDate: function() {
      var dateString = new Date().toUTCString();
      $('#order_date').append(dateString);
    },
    cacheTemplate: function() {
      var $script = $('#inventory_item').remove();
      this.template = Handlebars.compile($script.html());
    },
    bindEvents: function() {
      $('#add_item') .on('click',             $.proxy(this.listeners.addItem,    this));
      $('#inventory').on('blur',   ':input',  $.proxy(this.listeners.updateItem, this))
                     .on('click',  '.delete', $.proxy(this.listeners.deleteItem, this));
    },
    init: function() {
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    },
  };
})();

$($.proxy(inventory.init, inventory));