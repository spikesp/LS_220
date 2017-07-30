$(function() {
  var month_text = {
    "January": "garnet",
    "February": "amethyst",
    "March": "aquamarine or bloodstone",
    "April": "diamond",
    "May": "emerald",
    "June": "pearl, moonstone, or alexandrite",
    "July": "ruby",
    "August": "peridot",
    "September": "sapphire",
    "October": "opal or tourmaline",
    "November": "topaz or citrine",
    "December": "turquoise, zircon, or tanzanite"
  };

  $("nav a").on("mouseenter", function() {
    $(this).next("ul").addClass("visible");
  });

  $("nav").on("mouseleave", function() {
    $(this).find("ul ul").removeClass("visible");
  });

  $("button, .button").on("click", function(e) {
    e.preventDefault();

    $(this).addClass("clicked");
  });

  $(".toggle").on("click", function(e) {
    e.preventDefault();

    $(this).next(".accordion").toggleClass("opened");
  });

  $("form").on("submit", function(e) {
    e.preventDefault();
    var cc_number = $(this).find("[type=text]").val(),
        total = getLuhnTotal(cc_number),
        is_valid = total % 10 === 0;

    $(this).find(".success").toggle(is_valid);
    $(this).find(".error").toggle(!is_valid);
  });

  $("ul a").on("click", function(e) {
    e.preventDefault();

    var month = $(this).text(),
        $stone = $("#birthstone");

    $stone.text("Your birthstone is " + month_text[month]);
  });

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
});
