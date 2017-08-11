function serializeArrayToObj(array) {
  var result = {};
  array.forEach(function(obj) {
    result[obj.name] = obj.value;
  });
  return result;
}

var ContactManager = {
  templates: {},
  listeners: {
    add: function(e) {
      e.preventDefault();
      this.insertForm(this.templates.addForm);
      this.transitionForm($('main'), $('form'));
    },
    submit: function(e) {
      e.preventDefault();
      var obj = serializeArrayToObj($(e.target).serializeArray());
      obj.tags = this.tagStringsToArray(obj.tags);

      switch ($(e.target).closest('form').data('action')) {
        case 'add':
          this.addContact(obj);
          this.renderNewContact(obj);
          break;
        case 'edit':
          this.editContact(obj);
          this.renderEditedContact(obj);
      }

      this.transitionForm($('form'), $('main'));
    },
    cancel: function(e) {
      e.preventDefault();
      this.transitionForm($('form'), $('main'));
    },
    contacts: function(e) {
      e.preventDefault();

      switch ($(e.target).data('action')) {
        case 'edit':
          this.insertForm(this.getFormHtml($(e.target)));
          return this.transitionForm($('main'), $('form'));
        case 'delete':
          if (!confirm('Do you want to delete the contact?')) return;
          this.deleteContact($(e.target).closest('.contact').data('id'));
          this.renderDeletedContact(id);
      }
    },
    query: function(e) {
      e.preventDefault();
      this.renderContacts(this.filterByName($(e.target).val()));
      this.clearFilteredTags();
    },
    tag: function(e) {
      e.preventDefault();
      var tagName = $(e.target).text();
      if (this.filteredTags.indexOf(tagName) > -1) return;
      this.addFilteredTag(tagName);
      this.showFilteredTag(tagName);
      this.renderContacts(this.filterByTag());
      this.clearSearchBar();
    },
    filteredTag: function(e) {
      e.preventDefault();
      this.removeFilteredTag($(e.target).text().replace(' x', ''));
      this.removeShownFilteredTag(e.target);
      this.renderContacts(this.filterByTag());
    },
    unload: function(e) {
      e.preventDefault();
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
    },
  },
  tagStringsToArray: function(tags) {
    if (!tags) return [];
    return tags.split(/[, ]/);
  },
  registerHelpers: function() {
    Handlebars.registerHelper('heading', function() {
      switch (this.action) {
        case 'add':  return 'Create Contact';
        case 'edit': return 'Edit Contact';
      }
    });
  },
  registerPartials: function() {
    Handlebars.registerPartial('contact', $('#contact').html());
    Handlebars.registerPartial('tags', $('#tags').html());
    Handlebars.registerPartial('tag', $('#tag').html());
  },
  cacheTemplates: function() {
    $('[type="text/x-handlebars"]').toArray().forEach(function(el) {
      this.templates[$(el).attr('id')] = Handlebars.compile($(el).html());
    }, this);
    this.templates.addForm = this.templates.form({action: 'add'});
  },
  clearSearchBar: function() {
    $('#query').val('');
  },
  filterByName: function(q) {
    return this.contacts.filter(function(contact) {
      var re = new RegExp(q, 'i');
      return re.test(contact.name);
    });
  },
  filterByTag: function() {
    return this.contacts.filter(function(contact) {
      var tagString = contact.tags.join('');
      return this.filteredTags.every(function(tagName) {
        return new RegExp(tagName, 'i').test(tagString);
      });
    }, this);
  },
  addFilteredTag: function(tagName) {
    this.filteredTags.push(tagName);
  },
  removeFilteredTag: function(tagName) {
    var idx = this.filteredTags.indexOf(tagName);
    this.filteredTags.splice(idx, 1);
  },
  showFilteredTag: function(tagName) {
    var $tagName = $('<span>', {class: 'tag'}).text(tagName + ' x');
    $('#message').append($tagName);
    this.toggleMessage(true);
  },
  removeShownFilteredTag: function(e) {
    var $e = $(e);
    if (!$e.siblings('.tag').length) this.toggleMessage(false);
    $e.remove();
  },
  clearFilteredTags: function() {
    if (!this.filteredTags.length > 0) return;
    this.filteredTags.forEach(this.removeFilteredTag, this);
    $('#message .tag').toArray().forEach(this.removeShownFilteredTag, this);
    this.toggleMessage(false);
  },
  toggleMessage: function(bool) {
    $('#message').toggle(bool);
  },
  getContact: function(id) {
    return this.contacts.filter(function(contact) {
      return contact.id === id;
    })[0];
  },
  deleteContact: function(id) {
    var idx = this.contacts.indexOf(this.getContact(id));
    this.contacts.splice(idx, 1);
  },
  editContact: function(source) {
    var destination = this.getContact(Number(source.id));
    Object.keys(destination).forEach(function(key) {
      if (key !== 'id') destination[key] = source[key];
    });
  },
  addContact: function(obj) {
    this.id++;
    obj.id = this.id;
    this.contacts.push(obj);
  },
  renderDeletedContact: function(id) {
    var $contact = $('#contacts').find('[data-id=' + id +' ]');
    $contact.remove();
  },
  renderEditedContact: function(obj) {
    var html = this.templates.contact(obj);
    var $contact = $('#contacts').find('[data-id=' + obj.id + ']');
    $contact.replaceWith($(html));
  },
  renderNewContact: function(obj) {
    var html = this.templates.contact(obj);
    $('#contacts').append(html);
  },
  renderContacts: function(contacts) {
    var html = this.templates.contacts({contacts: contacts});
    $('#contacts').html(html);
  },
  transitionMain: function() {
    $('main').slideDown(700);
  },
  transitionForm: function($current, $target) {
    $target.insertAfter($current).show();
    $current.slideUp(400, function() {
      if (this.tagName === 'FORM') $(this).remove();
    });
    $('html, body').animate({scrollTop: 0}, 200, 'linear');
  },
  insertForm: function(html) {
    return $('main').after(html);
  },
  getFormHtml: function($e) {
    var id = Number($e.closest('.contact').data('id'));
    var obj = this.getContact(id);
    var data = Object.assign({}, obj, {action: 'edit'});
    return this.templates.form(data);
  },
  getCachedContacts: function() {
    str = localStorage.getItem('contacts');
    return JSON.parse(str);
  },
  bind: function() {
    $('#add').on('click', this.listeners.add.bind(this));
    $(document.body).on('submit', 'form', this.listeners.submit.bind(this));
    $(document.body).on('click', '[value=Cancel]', this.listeners.cancel.bind(this));
    $('#contacts').on('click', 'button', this.listeners.contacts.bind(this));
    $(window).on('unload', this.listeners.unload.bind(this));
    $('#query').on('keyup', this.listeners.query.bind(this));
    $('#contacts').on('click', '[class="tag filterable"]', this.listeners.tag.bind(this));
    $('#message').on('click', '.tag', this.listeners.filteredTag.bind(this));
  },
  getLastId: function() {
    if (!this.contacts.length) return 0;
    var last = this.contacts[this.contacts.length - 1];
    return last.id;
  },
  init: function() {
    this.registerHelpers();
    this.registerPartials();
    this.cacheTemplates();
    this.bind();
    this.contacts = this.getCachedContacts() || [];
    this.id = this.getLastId();
    this.renderContacts(this.contacts);
    this.filteredTags = [];
    setTimeout(this.transitionMain, 200);
    return this;
  },
};

var manager = Object.create(ContactManager).init();