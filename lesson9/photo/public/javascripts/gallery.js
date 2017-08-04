var slideshow;

$(function() {
  var helpers = {
    handleAjaxError: function(jqXHR, status) {
      console.log(jqXHR, status);
    },
    get$PrevSlide: function($current) {
      return $current.prev().length ? $current.prev() : $('#slides figure:last-child');
    },
    get$NextSlide: function($current) {
      return $current.next().length ? $current.next() : $('#slides figure:first-child');
    },
    setPhotoIdInForm: function(id) {
      $('form input[type=hidden]').val(id);
    },
    resetForm: function() {
      $('form').get(0).reset();
    },
  };

  var templates = {};

  slideshow = {
    listeners: {
      transition: function(e) {
        e.preventDefault();
        var $current = $('#slides figure:visible');
        var $target;

        if ($(e.target).hasClass('prev')) {
          $target = helpers.get$PrevSlide($current);
        } else if ($(e.target).hasClass('next')) {
          $target = helpers.get$NextSlide($current);
        }

        this.transitionSlides($current, $target);
      },
      action: function(e) {
        e.preventDefault();
        $e = $(e.target);
        var photoId = $e.data('id');
        var path = $e.attr('href');
        this.updateInfo(photoId, path);
      },
      comment: function(e) {
        e.preventDefault();
        var queryString = $('form').serialize();
        console.log(queryString);
        this.addComment(queryString);
      },
    },

    cachePhotos: function(data) {
      this.photos = data;
    },
    updatePhotoCache: function(path, photoId) {
      var photo = this.getPhoto(photoId);
      path.endsWith('like') ? photo.likes++ : photo.favorites++;
    },
    getPhoto: function(id) {
      return this.photos.filter(function(photo) {
        return photo.id === id;
      })[0];
    },

    renderSlides: function() {
      var innerHtml = templates.photos({photos: this.photos});
      $('#slides').html(innerHtml);
    },
    transitionSlides: function($current, $target) {
      $current.fadeOut();
      $target.fadeIn();
      this.renderInfo($target.data('id'));
      this.fetchComments($target.data('id'));
      helpers.setPhotoIdInForm($target.data('id'));
    },

    renderInfo: function(id) {
      var innerHtml = templates.photo_information(this.getPhoto(id));
      $('section > header').html(innerHtml);
    },
    reRenderInfo: function(path, data) {
      var $e = $('.actions .button[href="' + path + '"]');
      var updatedText = $e.text().replace(/\d+/, data.total);
      $e.text(updatedText);
    },
    updateInfo: function(photoId, path) {
      $.ajax({
        url: path,
        method: 'POST',
        data: {photo_id: photoId},
      }).done($.proxy(this.updatePhotoCache, this, path, photoId))
        .then($.proxy(this.reRenderInfo, this, path))
        .fail($.proxy(this.handleAjaxError, this));
    },

    renderComments: function(data) {
      var innerHtml = templates.comments({comments: data});
      $('#comments-container > ul').html(innerHtml);
    },
    renderComment: function(data) {
      var innerHtml = templates.comment(data);
      $('#comments-container > ul').append(innerHtml);
    },
    addComment: function(queryString) {
      $.ajax({
        url: '/comments/new',
        method: 'POST',
        data: queryString,
      }).done($.proxy(this.renderComment, this))
        .then(helpers.resetForm)
        .fail($.proxy(this.handleAjaxError, this));
    },

    cacheTemplates: function() {
      $('[type="text/x-handlebars"]').each(function() {
        var $e = $(this);
        templates[$e.attr('id')] = Handlebars.compile($e.html());
      });

      $('[data-type="partial"]').each(function() {
        var $e = $(this);
        Handlebars.registerPartial($e.attr('id'), $e.html());
      });
    },
    fetchPhotos: function() {
      $.ajax({
        url: '/photos',
      }).done($.proxy(this.cachePhotos, this))
        .then($.proxy(this.renderSlides, this))
        .then($.proxy(this.renderInfo, this, 1))
        .fail($.proxy(this.handleAjaxError, this));
    },
    fetchComments: function(photoId) {
      $.ajax({
        url: '/comments?photo_id=' + String(photoId),
      }).done($.proxy(this.renderComments, this))
        .fail($.proxy(this.handleAjaxError, this));
    },
    bindEvents: function() {
      $('.prev, .next').on('click', $.proxy(this.listeners.transition, this));
      $('section > header').on('click', '.actions', $.proxy(this.listeners.action, this));
      $('form').on('submit', $.proxy(this.listeners.comment, this));
    },

    init: function() {
      this.cacheTemplates();
      this.fetchPhotos();
      this.fetchComments(1);
      this.bindEvents();
      helpers.setPhotoIdInForm(1);
    },
  };
}());

$($.proxy(slideshow.init, slideshow));