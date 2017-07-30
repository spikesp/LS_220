  var BIRTH_STONES = {
    January:   'garnet',
    February:  'amethyst',
    March:     'aquamarine or bloodstone',
    April:     'diamond',
    May:       'emerald',
    June:      'pearl, moonstone, or alexandrite',
    July:      'ruby',
    August:    'peridot',
    September: 'sapphire',
    October:   'opal or tourmaline',
    November:  'topaz or citrine',
    December:  'turquoise, zircon, or tanzanite',
  };

function getLuhnTotal(cc_number) {
  var odd_total = 0,
      even_total = 0;

  cc_number = cc_number.split("").reverse();
  cc_number.forEach(function(num, i) {
    if (i % 2 == 1) {
      num = (+num * 2) + "";
      if (num.length > 1) {
        num = +num[0] + +num[1];
      }
      else {
        num = +num;
      }
      odd_total += num;
    }
    else {
      even_total += +num;
    }
  });

    return odd_total + even_total;
  }

$(function() {
  $("nav a").on("mouseenter", function() {
    $(this).next("ul").addClass('show');
  });

  $("nav").on("mouseleave", function() {
    $(this).find("ul ul").removeClass('show');
  });

  $(".button, button").on("click", function(e) {
    e.preventDefault();
    $(this).addClass("clicked");
  });

  $(".toggle").on("click", function(e) {
    e.preventDefault();
    $(this).next('.accordion').toggleClass('opened');
  });

  $("form").on("submit", function(e) {
    e.preventDefault();
    var cc_number = $(this).find("[type=text]").val();
    var total = getLuhnTotal(cc_number);
    var isValid = total % 10 === 0;

    $(this).find(".success").toggle(isValid);
    $(this).find(".error").toggle(!isValid);
  });

  $("ul a").on("click", function(e) {
    e.preventDefault();
    var month = $(this).text(),
        $stone = $("#birthstone");
    $stone.text('Your birthstone is ' + BIRTH_STONES[month]);
  });
});
