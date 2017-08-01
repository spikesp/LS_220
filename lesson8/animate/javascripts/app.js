$(function() {
  function getFormObject($form) {
    var result = {};
    $form.serializeArray().forEach(function(obj) {
      result[obj.name] = obj.value;
    });

    return result;
  }

  function makeShape(data) {
    var $e = $('<div></div>', {
      'class': 'shape ' + data.shape,
      data: data,
    });

    return $e;
  }

  function setPosition($shape, data) {
    $shape.css({
      top: Number(data.start_y),
      left: Number(data.start_x),
    });
  }

  function animate(shape) {
    var $shape = $(this);
    var data = $shape.data();

    setPosition($shape, data);
    $shape.stop().animate({
      top: Number(data.end_y),
      left: Number(data.end_x),
    }, 1000);
  }

  function startAnimations() {
    $('.shape').each(animate);
  }

  function stopAnimations() {
    $('.shape').stop();
  }

  $('form').submit(function(e) {
    e.preventDefault();

    var data = getFormObject($(this));
    var $shape = makeShape(data);

    setPosition($shape, data);
    $shape.appendTo($('#canvas'));
  });

  $('a.control').click(function(e) {
    e.preventDefault();

    var control = $(this).data('link');
    switch (control) {
      case 'start': return startAnimations();
      case 'stop' : return stopAnimations();
    }
  });
});