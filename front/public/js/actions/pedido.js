var cafetin = cafetin || {};

(function($) {

  var flagClear = false;

  // Autocomplete de Clientes.
  $( "#cliente" ).autocomplete({
    source: function( request, response ) {
      $.ajax({
        url: cafetin.server + "/cliente/" + request.term,
        dataType: "jsonp",
        success: function( data ) {
          response( $.map( data, function( item ) {
            cliente = item.nombres + ' ' + item.apellidos; 
            return {
              'label': cliente,
              'value': cliente,
              'id': item.id
            };
          }));
        }
      });
    },
    minLength: 1,
    select: function( event, ui ) {
      $('.cliente-nombre').data('id', ui.item.id);
      $('.cliente-nombre').text(ui.item.label).effect('highlight');
    },
    open: function() {
      $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
      $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  });

  // Autocomplete de Platos.
  $( "#platos" ).autocomplete({
    source: function( request, response ) {
      $.ajax({
        url: cafetin.server + "/plato/" + cafetin.local + "/" + request.term,
        dataType: "jsonp",
        success: function( data ) {
          //console.log(data);
          response( $.map( data, function( item ) {
            plato = item.nombre;
            return {
              'label': plato,
              'value': plato,
              'id': item.id
            };
          }));
        }
      });
    },
    minLength: 1,
    select: function( event, ui ) {
      $('#current-plato').data('id', ui.item.id);
      $('#current-plato').val(ui.item.label);
    },
    open: function() {
      $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
      $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  });

  // Creamos el pedido.
  pedido = function() {
    cantidades = cafetin.theDetalles.pluck('cantidad');
    platos = cafetin.theDetalles.pluck('platoId');
    var pedido = {
      para: $('.cliente-nombre').data('id'),
      cantidad: cantidades,
      platos: platos,
      observaciones: $('#observaciones').val(),
      hecho_por: cafetin.uid,
      local: cafetin.local
    };
    socket.emit('pedido:nuevo', pedido);
  };

  $('.do').click(function() {
    pedido();
    flagClear = false;
  });

  $('.do-clear').click(function() {
    pedido();
    flagClear = true;
  });

  // Event Handler.
  socket.on('pedido:creadoForMe', function(data) {
    console.log(data);
    if(data.status == 'ok') {
      alert('El pedido se ha creado correctamente.');
      if(flagClear) {
        cafetin.theDetalles.reset();
        $('#cliente').val('');
        $('#cliente').focus();
        $('.cliente-nombre').data('id', '');
        $('.cliente-nombre').text('');    
      }
      else {
        location.href = '/pedido/lista/mozo';
      }
    } else {
      alert('Hubo un error al crear el pedido, intenta nuevamente.');
    }
  });

  $('#cliente').focus();

})(jQuery);