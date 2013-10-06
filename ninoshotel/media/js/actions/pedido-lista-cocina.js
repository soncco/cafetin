var cafetin = cafetin || {};

cafetin.estados = {
  R: {
    'texto': 'Recibido',
    'clase': 'btn-danger'
  },
  A: {
    'texto': 'Atendido',
    'clase': 'btn-warning'
  },
  I: {
    'texto': 'Impreso',
    'clase': 'btn-info'
  },
  P: {
    'texto': 'Pagado',
    'clase': 'btn-success'
  }
};

(function($) {

  $('.timeago').timeago();

  // La tabla.
  var $tables = $('.pedido-lista');

  atenderPedido = function() {
    atender = window.confirm('¿Está seguro de marcar este pedido como atendido?');

    if(atender) {
      io.emit('pedido:atender', {'id': $(this).data('id')});
    }
  };

  atenderPedido = function() {
    atender = window.confirm('¿Está seguro de marcar este pedido como atendido?');
    if(atender) {
      $.post('/pedido/atender/', {
        'id': $(this).data('id'),
        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
      }, function(data) {
        if(data.status == 'ok') {
          io.emit('pedido:atender', data);
        } else {
          alert('Hubo un error al atender el pedido, intenta nuevamente.');
        }
      }); 
    }
  };

  // Parsea los detalles del pedido JSON en una lista HTML.
  parseDetalles = function(detalles) {
    $ul = $('<ul class="list-unstyled"></ul>');
    $li = $('<li></li>'); 

    for(j = 0; j < detalles.length; j++) {
      detalle = detalles[j];
      $li.clone().text(detalle.cantidad + ' x ' + detalle.plato).appendTo($ul);
    }
    return $ul;
  };

  // Parsea un pedido JSON en una fila de tabla HTML.
  parsePedido = function(pedido) {
    $tbody = $tables.filter('#pedido-lista-' +  pedido.punto);
    // Los elementos de las filas.
    $tr = $('<tr></tr>');
    $td = $('<td></td>');
    $status = $('<span class="btn btn-sm"></span>');
    $edit = $('<button class="btn btn-warning attend" data-id=""></button>&nbsp;').html($('<i class="icon icon-check"></i>'));

    $td.clone().text(pedido.para).appendTo($tr);
    $td.clone().html(parseDetalles(pedido.detalles)).appendTo($tr);
    $td.clone().text(pedido.comentarios).appendTo($tr);
    $td.clone().text(pedido.hecho_por).appendTo($tr);
    $td.clone().text(jQuery.timeago(pedido.fecha)).addClass('timeago').appendTo($tr);
    $td.clone().html($status.text(cafetin.estados[pedido.estado].texto).addClass(cafetin.estados[pedido.estado].clase)).appendTo($tr);

    // Verifica los estados del pedido.
    switch(pedido.estado) {
      case 'R':
      break;
      case 'A':
        $edit.hide();
      break;
      case 'I':
        $edit.hide();
      break;
      case 'P':
        $edit.hide();
      break;
    }

    $td.clone()
        .append($edit.data('id', pedido.id))
      .addClass('actions')
      .appendTo($tr);

    // Agrega eventos a los botones.
    $tr.delegate('.attend', 'click', atenderPedido);

    // Crea la fila.
    $tr
      .attr('id', 'row-' + pedido.id)
      .prependTo($tbody)
      .addClass('animated tada');

  };

  // Parsea pedidos de JSON a una tabla HTML.
  parsePedidos = function(pedidos) {
    for(i = 0; i < pedidos.length; i++) {
      row = pedidos[i];
      parsePedido(row);
    }
  };

  // ios.
  // Crea un pedido.
  io.on('pedido:creado', function(data) {
    for(i = 0; i < data.pedidos.length; i++) {
      pedido = data.pedidos[i];
      parsePedido(pedido);
    }
  });

  // Quita un pedido.
  io.on('pedido:quitado', function(data) {
    $tbody = $tables.filter('#pedido-lista-' +  data.punto);
    $tbody.find('#row-' + data.id).removeClass().addClass('animated slideOutLeft').delay(1000).fadeOut();;
  });

  // Marca un pedido como atendido.
  io.on('pedido:atendido', function(data) {
    $tbody = $tables.filter('#pedido-lista-' +  data.punto);
    $tbody.find('#row-' + data.id + ' .attend')
      .remove();
    
    $tbody.find('#row-' + data.id + ' span')
      .addClass('animated slideOut')
      .removeClass('btn-danger animated slideOut')
      .addClass('btn-warning animated bounceIn')
      .text('Atendido');

  });

  // Marca un pedido como impreso.
  io.on('pedido:impreso', function(data) {
    $tbody = $tables.filter('#pedido-lista-' +  data.punto);
    $el = $tbody.find('#row-' + data.id + ' span');
    if($el.text() != 'Pagado') {
      $el
        .addClass('animated slideOut')
        .removeClass('btn-warning animated slideOut')
        .addClass('btn-info animated bounceIn')
        .text('Impreso');
    }
  });

  // Marca un pedido como pagado.
  io.on('pedido:paid', function(data) {
    $tbody.find('#row-' + data.id + ' span')
      .hide('puff')
      .removeClass('pure-button-secondary')
      .addClass('pure-button-success')
      .text('Pagado')
      .show('slide'); 
  });

  // Recarga la página cada 5 minutos.
  setTimeout(function() {
    location.reload();
  }, 300000);

  $('.attend').click(atenderPedido);

})(jQuery);