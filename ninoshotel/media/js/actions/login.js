var cafetin = cafetin || {};

(function($) {

  var $username = $('#username');
  var $password = $('#password');
  var $local = $('#local');

  parseLocal = function(local) {
    $option = $('<option></option>');
    $option.clone().html(local.nombre).attr('value', local.id).appendTo($local);
  };

  parseLocales = function(locales) {
    for(i = 0; i < locales.length; i++) {
      row = locales[i];
      parseLocal(row);
    }
  };

  $.ajax({
    url: cafetin.server + "/local/json",
    dataType: "jsonp",
    success: function( data ) {
      parseLocales(data);
    }
  });
/*
  $('.login').click(function() {
    data = {
      'username': $username.val(),
      'password': $password.val(),
      'local': $local.val()
    };
    socket.emit('login', data);
  });

  socket.on('logged', function(data) {
    console.log(data);
  });
*/
  $('#username').focus();
  
})(jQuery);