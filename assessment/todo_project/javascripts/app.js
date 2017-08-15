function serializeArrayToObj(array) {
  var result = {};
  array.forEach(function(obj) {
    result[obj.name] = obj.value;
  });
  return result;
}

var TodoList = {
  returnDataPerMonth: function(array) {
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
  templates: {
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
  },

  todo: {
    edit: function(source) {
      var todo = this.todoList.get(Number(source.id));
      source.date = this.todo.utility.makeDate.call(this, source)
      todo.edit(source);
    },
    add: function(form) {
      this.id++;
      form.id = this.id;
      form.date = this.todo.utility.makeDate.call(this, form);
      var todo = Object.create(Todo).init(form);
      this.todoList.add(todo);
    },
    utility: {
      makeDate: function(form) {
        if (form.month === 'Month' || form.year === 'Year') return;
        var args = [Number(form.year), Number(form.month)];
        if (form.day !== 'Day') args.push(Number(form.day));
        return new Date(...args);
      },
    }
  },

  render: {
    form: function($form) { $('#modal').html($form) },
    main: function() {
      $('nav .all').find('h2').trigger('click');
    },
    deletedTodo: function(id) {
      $('#todos').find('[data-id=' + id + ']').remove();
    },
    editedTodo: function(id) {
      $todo = $('#todos').find('[data-id=' + id + ']');
      $todo.replaceWith(this.templates.todo(this.todoList.get(id)));
    },
    completedTodos: function(completed) {
      completed = completed || this.todoList.completed;
      this.todoList.sortByDate(completed);
      var data = {completed: completed};
      $('#todos').html(this.templates.todos(data));
    },
    allTodos: function(completed, uncompleted) {
      completed = completed || this.todoList.completed;
      uncompleted = uncompleted || this.todoList.uncompleted;
      this.todoList.sortByDate(completed, uncompleted);
      var data = {completed: completed, uncompleted: uncompleted};
      $('#todos').html(this.templates.todos(data));
    },
    nav: function() {
      var allPerMonth = this.todoList.returnDataPerMonth(this.todoList.all);
      var completedPerMonth = this.todoList.returnDataPerMonth(this.todoList.completed);
      this.render.utility.renderNavItems.call(this, allPerMonth, 'all');
      this.render.utility.renderNavItems.call(this, completedPerMonth, 'completed');
      $('.total-count').text(this.todoList.all.length);
      $('.completed-count').text(this.todoList.completed.length);
    },
    selectValues: function(id) {
      var todo = this.todoList.get(id);
      if (!todo.date) return;
      $('[name=day]').val(todo.date.getDate());
      $('[name=month]').val(todo.date.getMonth());
      $('[name=year]').val(todo.date.getFullYear());
    },
    utility : {
      getFormHtml: function(id) {
        var todo = this.todoList.get(id);
        var data = Object.assign({}, todo, {action: 'edit'})
        return this.templates.form(data);
      },
      renderNavItems: function(dataObj, which) {
        var data = [];
        for (key in dataObj) {
          data.push({month: key, count: dataObj[key]});
        }
        $('#' + which).html(this.templates.navItems({months: data}));
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
        this.render.allTodos.call(this, [], []);
      },
    }
  },

  toggle: {
    modal: function(which) { $('#modal, #overlay').fadeToggle(which); },
    completed: function(id) {
      this.todoList.get(id).toggleCompleted();
      this.todoList.updateCompleted(id);
    },
    selected: function($target) {
      $('nav').find('.selected').removeClass('selected');
      $target.addClass('selected');
    },
    heading: function(text, count) {
      var $span = $('<span>', {class: 'count'});
      $('main h1').html($span.text(count)).prepend(text);
    },
  },

  listeners: {
    add: function(e) {
      e.preventDefault();
      this.render.form.call(this, $(this.templates.addForm));
      this.toggle.modal.call(this, true);
    },
    overlay: function(e) {
      e.preventDefault();
      this.toggle.modal.call(this, false);
    },
    submit: function(e) {
      e.preventDefault();
      var form = serializeArrayToObj($(e.target).serializeArray());
      var action = $(e.target).closest('form').data('action');

      switch (action) {
        case 'add':
          this.todo.add.call(this, form);
          this.render.nav.call(this);
          this.render.main.call(this);
          break;
        case 'edit':
          var cb = (function() {
            this.todo.edit.call(this, form);
            this.render.nav.call(this);
          }).bind(this);
          this.render.utility.persistSelected.call(this, cb);
      }

      this.toggle.modal.call(this, false);
    },
    button: function(e) {
      e.preventDefault();
      var action = $(e.target).closest('form').data('action');
      if (action === 'add') return alert('Cannot mark complete as \
        item has not been created yet!');

      var array = $(e.target).closest('form').serializeArray();
      var form = serializeArrayToObj(array);
      if (this.todoList.get(Number(form.id)).completed)
        return this.toggle.modal.call(this, false);

      var $todo = $('#todos').find('[data-id=' + form.id + ']');
      $todo.find('label').trigger('click');
      this.toggle.modal.call(this, false);
    },
    check: function(e) {
      e.preventDefault();
      var id = $(e.target).closest('.todo').data('id');
      var cb = (function() {
        this.toggle.completed.call(this, id);
        this.render.editedTodo.call(this, id);
        this.render.nav.call(this);
      }).bind(this);
      this.render.utility.persistSelected.call(this, cb);
    },
    delete: function(e) {
      e.preventDefault();
      var id = $(e.target).closest('.todo').data('id');
      var cb = (function() {
        this.todoList.delete(id);
        this.render.deletedTodo.call(this, id);
        this.render.nav.call(this);
      }).bind(this);
      this.render.utility.persistSelected.call(this, cb);
    },
    name: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var id = $(e.target).closest('.todo').data('id');
      this.render.form.call(this, this.render.utility.getFormHtml.call(this, id));
      this.render.selectValues.call(this, id);
      this.toggle.modal.call(this, true);
    },
    nav: function(e) {
      e.preventDefault();
      var $e = $(e.target);
      var which = $e.parent().attr('class');
      var completed;
      var uncompleted;

      if ($e.is(':not(h2)')) {
        var $e = $e.closest('li');
        var month = Number($e.text().slice(0, 2)) - 1;
        var completed = this.todoList.filterByMonth(this.todoList.completed, month);
        var uncompleted = this.todoList.filterByMonth(this.todoList.uncompleted, month);
        which = $e.parent().attr('id');
      }

      this.toggle.selected.call(this, $e);
      this.toggle.heading.call(this, $e.data('heading'), $e.find('span').text());

      switch (which) {
        case 'all':
          return this.render.allTodos.call(this, completed, uncompleted);
        case 'completed':
          return this.render.completedTodos.call(this, completed);
      }
    },
    unload: function(e) {
      localStorage.setItem('todos', JSON.stringify(this.todoList.all));
    },
  },

  setup: {
    restoreCachedTodos: function() {
      var array = JSON.parse(localStorage.getItem('todos')) || [];
      array.forEach(function(item) {
        if (item.date) item.date = new Date(item.date);
        this.todoList.add(Object.create(Todo).init(item));
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
      $('nav').on('click', 'h2, li', this.listeners.nav.bind(this));
      $(window).on('unload', this.listeners.unload.bind(this));
    },
  },

  init: function() {
    this.todoList = Object.create(TodoList).init();
    this.setup.restoreCachedTodos.call(this);
    this.id = this.todoList.lastId();
    this.setup.bind.call(this);
    this.templates.registerPartials.call(this);
    this.templates.cacheTemplates.call(this);
    this.render.nav.call(this);
    this.render.main.call(this);
    return this;
  },
};

var view = Object.create(TodoView).init();
