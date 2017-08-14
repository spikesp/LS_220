function serializeArrayToObj(array) {
  var result = {};
  array.forEach(function(obj) {
    result[obj.name] = obj.value;
  });
  return result;
}

function sortByDate() {
  [].slice.call(arguments).forEach(function(array) {
    array.sort(function(todoA, todoB) {
      if (!todoA.date) return -1;
      if (!todoB.date) return 1;
      return todoB.date.getTime() - todoA.date.getTime();
    });
  });
}

var Todo = {
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
        $('nav .all').find('h2').trigger('click');
        this.setAllPerMonth(this.todos);
        this.renderNav();
        this.renderTotalCounts();
      }

      if (action === 'edit') {
        var needsReflow = this.dateChange(form);
        this.editTodo(form);

        if (!needsReflow) {
          this.renderEditedTodo(Number(form.id));
        } else {
          this.setAllPerMonth(this.todos);
          this.setCompletedPerMonth(this.todos);
          this.renderAllTodos();
          this.renderNav();
        }
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
      if (this.getTodo(Number(form.id)).completed) return;

      var $todo = $('#todos').find('[data-id=' + form.id + ']');
      $todo.find('label').trigger('click');
      this.fadeModal(false);
    },
    check: function(e) {
      e.preventDefault();
      var id = $(e.target).closest('.todo').data('id');
      this.toggleCompleted(id);
      this.renderEditedTodo(id);
      this.updatePartition(id);
      this.renderAllTodos();
      this.setCompletedPerMonth();
      this.renderNav();
      this.renderTotalCounts();
    },
    delete: function(e) {
      e.preventDefault();
      var id = $(e.target).closest('.todo').data('id');
      var completed = this.getTodo(id).completed;
      this.deleteTodo(id);
      this.renderDeletedTodo(id);
      this.setAllPerMonth(this.todos);
      if (completed) this.setCompletedPerMonth();
      this.renderNav();
      this.renderTotalCounts();
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
      var completed = this.filterByMonth(this.completed, month);
      var text = $li.clone().find('span').remove().end().text();
      var count = $li.find('span').text();

      this.toggleSelected($li);
      this.toggleHeading(text, count);

      switch (which) {
        case 'all':
          var uncompleted = this.filterByMonth(this.uncompleted, month);
          return this.renderAllTodos(completed, uncompleted);
        case 'completed':
          return this.renderCompletedTodos(completed);
      }
    },
    navHeadings: function(e) {
      e.preventDefault();
      var $e = $(e.target);
      var text = $e.clone().find('span').remove().end().text();
      var count = $e.find('span').text();
      var which = $e.closest('section').attr('class');

      this.toggleSelected($e);
      this.toggleHeading(text, count);

      switch (which) {
        case 'all':
          return this.renderAllTodos();
        case 'completed':
          return this.renderCompletedTodos();
      }
    },
    unload: function(e) {
      localStorage.setItem('todos', JSON.stringify(this.todos));
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
  fadeModal: function(which) { $('#modal, #overlay').fadeToggle(which); },
  insertForm: function($form) { $('#modal').html($form) },
  getFormHtml: function(id) {
    var todo = this.getTodo(id);
    var data = Object.assign({}, todo, {action: 'edit'})
    return this.templates.form(data);
  },
  setSelectValues: function(id) {
    var todo = this.getTodo(id);
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
  formatDate: function(date) {
    if (!date) return 'No Due Date';
    var month = String(date.getMonth() + 1);
    var year = String(date.getFullYear()).slice(2);
    if (month.length < 2) month = '0' + month;
    return month + '/' + year;
  },
  dateChange: function(form) {
    var todoDate = this.getTodo(Number(form.id)).date;
    var formDate = this.makeDate(form);
    if (!formDate &&  todoDate) return true;
    if ( formDate && !todoDate) return true;
    if (!formDate && !todoDate) return false;
    return formDate.getTime() !== todoDate.getTime();
  },
  getTodo: function(id) {
    return this.todos.filter(function(todo) {
      return todo.id === id;
    })[0];
  },
  renderTotalCounts: function() {
    $('.total-count').text(this.todos.length);
    $('.completed-count').text(this.completed.length);
  },
  deleteTodo: function(id) {
    var todo = this.getTodo(id);
    var which = todo.completed ? 'completed' : 'uncompleted';
    this.todos.splice(this.todos.indexOf(todo), 1);
    this[which].splice(this[which].indexOf(todo), 1);
  },
  editTodo: function(source) {
    var destination = this.getTodo(Number(source.id));
    destination.title = source.title;
    destination.description = source.description;
    destination.date = this.makeDate(source)
    destination.formattedDate = this.formatDate(destination.date);
  },
  addTodo: function(form) {
    this.id++;
    var date = this.makeDate(form);
    var formattedDate = this.formatDate(date);

    var todo = {
      id: this.id,
      title: form.title,
      description: form.description,
      date: date,
      formattedDate: formattedDate,
      completed: false,
    };

    this.todos.push(todo);
    this.uncompleted.push(todo);
  },
  renderDeletedTodo: function(id) {
    $('#todos').find('[data-id=' + id + ']').remove();
  },
  renderEditedTodo: function(id) {
    var html = this.templates.todo(this.getTodo(id));
    $todo = $('#todos').find('[data-id=' + id + ']');
    $todo.replaceWith($(html));
  },
  toggleCompleted: function(id) {
    var todo = this.getTodo(id);
    todo.completed = !todo.completed;
  },
  toggleSelected: function($target) {
    $('nav').find('.selected').removeClass('selected');
    $target.addClass('selected');
  },
  toggleHeading: function(text, count) {
    var $span = $('<span>', {class: 'count total-count'});
    $('main h1').html($span.text(count)).prepend(text);
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
  renderCompletedTodos: function(completed) {
    completed = completed || this.completed;
    var data = {completed: completed};
    var html = this.templates.todos(data);
    $('#todos').html(html);
  },
  renderAllTodos: function(completed, uncompleted) {
    completed = completed || this.completed;
    uncompleted = uncompleted || this.uncompleted;
    sortByDate(completed, uncompleted);
    var data = {completed: completed, uncompleted: uncompleted};
    var html = this.templates.todos(data);
    $('#todos').html(html);
  },
  renderNav: function() {
    this.renderNavItems(this.allPerMonth, 'all');
    this.renderNavItems(this.completedPerMonth, 'completed');
  },
  renderNavItems: function(dataObj, which) {
    var data = [];
    for (key in dataObj) {
      data.push({month: key, count: dataObj[key]});
    }

    var html = this.templates.navItems({months: data});
    $('#' + which).html(html);
  },
  dataPerMonth: function(array) {
    sortByDate(array);
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
  setAllPerMonth: function() {
    this.allPerMonth = this.dataPerMonth(this.todos);
  },
  setCompletedPerMonth: function() {
    this.completedPerMonth = this.dataPerMonth(this.completed);
  },
  getCachedTodos: function() {
    var todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(function(todo) {
      if (todo.date) todo.date = new Date(todo.date);
    }, this);
    return todos;
  },
  partitionCompleted: function(todo) {
    if (todo.completed) {
      this.completed.push(todo);
    } else {
      this.uncompleted.push(todo);
    }
  },
  updatePartition: function(id) {
    var todo = this.getTodo(id);
    var prev = todo.completed ? 'uncompleted' : 'completed';
    var current = todo.completed ? 'completed' : 'uncompleted';
    this[prev].splice(this[prev].indexOf(todo), 1);
    this[current].push(todo);
  },
  filterByCompleted: function() {
    this.todos.forEach(this.partitionCompleted, this);
  },
  getLastId: function() {
    if (!this.todos.length) return 0;
    return this.todos.reduce(function(max, todo) {
      return Math.max(max, todo.id);
    }, -Infinity);
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
    this.registerHelpers();
    this.registerPartials();
    this.cacheTemplates();
    this.bind();
    this.completed = [];
    this.uncompleted = [];
    this.todos = this.getCachedTodos();
    this.id = this.getLastId();
    this.filterByCompleted();
    this.setAllPerMonth(this.todos);
    this.setCompletedPerMonth(this.completed);
    this.renderAllTodos();
    this.renderNav();
    this.renderTotalCounts();
    return this;
  },
};

var todo = Object.create(Todo).init();
