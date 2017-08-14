function serializeArrayToObj(array) {
  var result = {};
  array.forEach(function(obj) {
    result[obj.name] = obj.value;
  });
  return result;
}

var TodoList = {
  dataPerMonth: function(array) {
    this.sortByDate(array);
    var dateString;

    return array.reduce(function(obj, todo) {
      dateString = todo.formattedDate;
      if (!obj.hasOwnProperty(dateString)) {
        obj[dateString] = 0;
      }
      obj[dateString] += 1;
      return obj;
    }, {});
  },
  filterByMonth: function(todos, month) {
    return todos.filter(function(todo) {
      if (isNaN(month)) {
        if (!todo.date) return true;
        return false;
      } else {
        if (!todo.date) return false;
        return todo.date.getMonth() === month;
      }
    });
  },
  sortByDate: function() {
    [].slice.call(arguments).forEach(function(array) {
      array.sort(function(todoA, todoB) {
        if (!todoA.date) return -1;
        if (!todoB.date) return 1;
        return todoB.date.getTime() - todoA.date.getTime();
      });
    });
  },
  updateCompleted: function(id) {
    var todo = this.get(id);
    var prev = todo.completed ? 'uncompleted' : 'completed';
    var current = todo.completed ? 'completed' : 'uncompleted';
    this[prev].splice(this[prev].indexOf(todo), 1);
    this[current].push(todo);
  },
  lastId: function() {
    if (!this.all.length) return 0;
    return this.all.reduce(function(max, todo) {
      return Math.max(max, todo.id);
    }, -Infinity);
  },
  get: function(id) {
    return this.all.filter(function(todo) {
      return todo.id === id;
    })[0];
  },
  delete: function(id) {
    var todo = this.get(id);
    var which = todo.completed ? 'completed' : 'uncompleted';
    this.all.splice(this.all.indexOf(todo), 1);
    this[which].splice(this[which].indexOf(todo), 1);
  },
  add: function(todo) {
    this.all.push(todo);
    if (todo.completed) {
      this.completed.push(todo);
    } else {
      this.uncompleted.push(todo);
    }
  },
  init: function() {
    this.all = [];
    this.completed = [];
    this.uncompleted = [];
    return this;
  },
};

var Todo = {
  toggleCompleted: function() {
    this.completed = !this.completed;
  },
  formatDate: function(date) {
    if (!date) return 'No Due Date';
    var month = String(date.getMonth() + 1);
    var year = String(date.getFullYear()).slice(2);
    if (month.length < 2) month = '0' + month;
    return month + '/' + year;
  },
  edit: function(source) {
    this.title = source.title;
    this.description = source.description;
    this.date = source.date;
    this.formattedDate = this.formatDate(this.date);
  },
  init: function(params) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    this.date = params.date;
    this.formattedDate = this.formatDate(this.date);
    this.completed = params.hasOwnProperty('completed') ?
      params.completed : false;
    return this;
  },
};

var TodoView = {
  templates: {},
  listeners: {
    add: function(e) {
      e.preventDefault();
      this.insertForm($(this.templates.addForm));
      this.fadeModal(true);
    },
    overlay: function(e) {
      e.preventDefault();
      this.fadeModal(false);
    },
    submit: function(e) {
      e.preventDefault();
      var form = serializeArrayToObj($(e.target).serializeArray());
      var action = $(e.target).closest('form').data('action');

      if (action === 'add') {
        this.addTodo(form);
        this.renderAllTodos();
        this.renderNav();
        this.renderTotalCounts();
        $('nav .all').find('h2').trigger('click');
      }

      if (action === 'edit') {
        this.persistSelected(function() {
          this.editTodo(form);
          this.renderNav();
          this.renderTotalCounts();
        }.bind(this));
      }

      this.fadeModal(false);
    },
    button: function(e) {
      e.preventDefault();
      var action = $(e.target).closest('form').data('action');
      if (action === 'add') return alert('Cannot mark complete as \
        item has not been created yet!');

      var array = $(e.target).closest('form').serializeArray();
      var form = serializeArrayToObj(array);
      if (this.todos.get(Number(form.id)).completed)
        return this.fadeModal(false);

      var $todo = $('#todos').find('[data-id=' + form.id + ']');
      $todo.find('label').trigger('click');
      this.fadeModal(false);
    },
    check: function(e) {
      e.preventDefault();
      var id = $(e.target).closest('.todo').data('id');

      this.persistSelected(function() {
        this.toggleCompleted(id);
        this.renderEditedTodo(id);
        this.todos.updateCompleted(id);
        this.renderNav();
        this.renderTotalCounts();
      }.bind(this));
    },
    delete: function(e) {
      e.preventDefault();
      var id = $(e.target).closest('.todo').data('id');

      this.persistSelected(function() {
        this.todos.delete(id);
        this.renderDeletedTodo(id);
        this.renderNav();
        this.renderTotalCounts();
      }.bind(this));
    },
    name: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var id = $(e.target).closest('.todo').data('id');
      this.insertForm(this.getFormHtml(id));
      this.setSelectValues(id);
      this.fadeModal(true);
    },
    navItems: function(e) {
      e.preventDefault();
      var $li = $(e.target).closest('li');
      var which = $li.closest('ul').attr('id');
      var month = Number($li.text().slice(0, 2)) - 1;
      var completed = this.todos.filterByMonth(this.todos.completed, month);
      this.toggleSelected($li);
      this.toggleHeading($li.data('heading'), $li.find('span').text());

      switch (which) {
        case 'all':
          var uncompleted = this.todos.filterByMonth(this.todos.uncompleted, month);
          return this.renderAllTodos(completed, uncompleted);
        case 'completed':
          return this.renderCompletedTodos(completed);
      }
    },
    navHeadings: function(e) {
      e.preventDefault();
      var $e = $(e.target);
      var which = $e.closest('section').attr('class');
      this.toggleSelected($e);
      this.toggleHeading($e.data('heading'), $e.find('span').text());

      switch (which) {
        case 'all':
          return this.renderAllTodos();
        case 'completed':
          return this.renderCompletedTodos();
      }
    },
    unload: function(e) {
      localStorage.setItem('todos', JSON.stringify(this.todos.all));
    },
  },
  registerPartials: function() {
    Handlebars.registerPartial('todos', $('[data-id=todos]').html());
    Handlebars.registerPartial('todo', $('[data-id=todo]').html());
  },
  cacheTemplates: function() {
    $('[type="text/x-handlebars"]').toArray().forEach(function(e) {
      this.templates[$(e).data('id')] = Handlebars.compile($(e).html())
    }, this);
    this.templates.addForm = this.templates.form({action: 'add'});
  },
  persistSelected: function(cb) {
    var $selected = $('nav').find('.selected');
    var heading = $selected.data('heading');
    var which = $selected.closest('section').attr('class');

    cb();

    var $target = $('nav .' + which).find('[data-heading="' +
      heading + '"]');
    if ($target.length)
      return $target.trigger('click');
    $('h1 .count').text('0');
    this.renderAllTodos([], []);
  },
  fadeModal: function(which) { $('#modal, #overlay').fadeToggle(which); },
  insertForm: function($form) { $('#modal').html($form) },
  getFormHtml: function(id) {
    var todo = this.todos.get(id);
    var data = Object.assign({}, todo, {action: 'edit'})
    return this.templates.form(data);
  },
  setSelectValues: function(id) {
    var todo = this.todos.get(id);
    if (!todo.date) return;
    $('[name=day]').val(todo.date.getDate());
    $('[name=month]').val(todo.date.getMonth());
    $('[name=year]').val(todo.date.getFullYear());
  },
  makeDate: function(form) {
    if (form.month === 'Month' || form.year === 'Year') return;
    var args = [Number(form.year), Number(form.month)];
    if (form.day !== 'Day') args.push(Number(form.day));
    return new Date(...args);
  },
  renderTotalCounts: function() {
    $('.total-count').text(this.todos.all.length);
    $('.completed-count').text(this.todos.completed.length);
  },
  editTodo: function(source) {
    var todo = this.todos.get(Number(source.id));
    source.date = this.makeDate(source)
    todo.edit(source);
  },
  addTodo: function(form) {
    this.id++;
    form.id = this.id;
    form.date = this.makeDate(form);
    var todo = Object.create(Todo).init(form);
    this.todos.add(todo);
  },
  renderDeletedTodo: function(id) {
    $('#todos').find('[data-id=' + id + ']').remove();
  },
  renderEditedTodo: function(id) {
    $todo = $('#todos').find('[data-id=' + id + ']');
    $todo.replaceWith(this.templates.todo(this.todos.get(id)));
  },
  toggleCompleted: function(id) {
    this.todos.get(id).toggleCompleted();
  },
  toggleSelected: function($target) {
    $('nav').find('.selected').removeClass('selected');
    $target.addClass('selected');
  },
  toggleHeading: function(text, count) {
    var $span = $('<span>', {class: 'count'});
    $('main h1').html($span.text(count)).prepend(text);
  },
  renderCompletedTodos: function(completed) {
    completed = completed || this.todos.completed;
    this.todos.sortByDate(completed);
    var data = {completed: completed};
    $('#todos').html(this.templates.todos(data));
  },
  renderAllTodos: function(completed, uncompleted) {
    completed = completed || this.todos.completed;
    uncompleted = uncompleted || this.todos.uncompleted;
    this.todos.sortByDate(completed, uncompleted);
    var data = {completed: completed, uncompleted: uncompleted};
    $('#todos').html(this.templates.todos(data));
  },
  renderNavItems: function(dataObj, which) {
    var data = [];
    for (key in dataObj) {
      data.push({month: key, count: dataObj[key]});
    }
    $('#' + which).html(this.templates.navItems({months: data}));
  },
  renderNav: function() {
    var allPerMonth = this.todos.dataPerMonth(this.todos.all);
    var completedPerMonth = this.todos.dataPerMonth(this.todos.completed);
    this.renderNavItems(allPerMonth, 'all');
    this.renderNavItems(completedPerMonth, 'completed');
  },
  getCachedTodos: function() {
    var array = JSON.parse(localStorage.getItem('todos')) || [];
    array.forEach(function(item) {
      if (item.date) item.date = new Date(item.date);
      this.todos.add(Object.create(Todo).init(item));
    }, this);
  },
  bind: function() {
    $('#add').on('click', this.listeners.add.bind(this));
    $('#overlay').on('click', this.listeners.overlay.bind(this));
    $('#modal').on('submit', 'form', this.listeners.submit.bind(this));
    $('#modal').on('click', '[type=button]', this.listeners.button.bind(this));
    $('#todos').on('click', '.delete', this.listeners.delete.bind(this));
    $('#todos').on('click', '.name', this.listeners.name.bind(this));
    $('#todos').on('click', 'label', this.listeners.check.bind(this));
    $('nav').on('click', 'li', this.listeners.navItems.bind(this));
    $('nav h2').on('click', this.listeners.navHeadings.bind(this));
    $(window).on('unload', this.listeners.unload.bind(this));
  },
  init: function() {
    this.registerPartials();
    this.cacheTemplates();
    this.bind();
    this.todos = Object.create(TodoList).init();
    this.id = this.todos.lastId();
    this.getCachedTodos();
    this.renderNav();
    this.renderAllTodos();
    this.renderTotalCounts();
    $('nav .all').find('h2').trigger('click');
    return this;
  },
};

var view = Object.create(TodoView).init();
