var cafetin = cafetin || {};

(function($) {

  // La tabla.
  var $tbody = $('#pedido-lista tbody');

  atenderPedido = function() {
    atender = window.confirm('¿Está seguro de marcar este pedido como atendido?');

    if(atender) {
      socket.emit('pedido:atender', {'id': $(this).data('id')});
    }
  };

  // Parsea los detalles del pedido JSON en una lista HTML.
  parseDetalles = function(detalles) {
    $ul = $('<ul></ul>');
    $li = $('<li></li>'); 

    for(j = 0; j < detalles.length; j++) {
      detalle = detalles[j];
      $li.clone().text(detalle.cantidad + ' x ' + detalle.plato).appendTo($ul);
    }
    return $ul;
  };

  // Parsea un pedido JSON en una fila de tabla HTML.
  parsePedido = function(pedido) {
    
    theClass = (($tbody.find('tr').length) % 2 == 0) ? 'pure-table-odd' : '';
    
    // Los elementos de las filas.
    $tr = $('<tr></tr>');
    $td = $('<td></td>');
    $status = $('<span class="pure-button"></span>');
    $edit = $('<button class="pure-button pure-button-secondary attend" data-id=""></button>&nbsp;').html($('<i class="icon-check"></i>'));

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
      .addClass(theClass)
      .hide()
      .prependTo($tbody)
      .show('highlight', {}, 1000);
  };

  // Parsea pedidos de JSON a una tabla HTML.
  parsePedidos = function(pedidos) {
    for(i = 0; i < pedidos.length; i++) {
      row = pedidos[i];
      parsePedido(row);
    }
  };

  // Trae los pedidos.
  $.ajax({
    url: cafetin.server + "/pedido/json",
    dataType: "jsonp",
    success: function( data ) {
      parsePedidos(data);
    }
  });

  // Sockets.
  // Crea un pedido.
  socket.on('pedido:creado', function(data) {
    //parsePedido(data.pedido);
    console.log(data);
  });

  // Quita un pedido.
  socket.on('pedido:quitado', function(data) {
    $tbody.find('#row-' + data.id).hide('highlight', {}, 1000);
  });

  // Marca un pedido como atendido.
  socket.on('pedido:atendido', function(data) {
    $tbody.find('#row-' + data.id + ' .attend')
      .remove();
    
    $tbody.find('#row-' + data.id + ' .print')
      .toggle('slide');

    $tbody.find('#row-' + data.id + ' span')
      .hide('puff')
      .removeClass('pure-button-error')
      .addClass('pure-button-warning')
      .text('Atendido')
      .show('slide');

    $tbody.find('#row-' + data.id + ' .delete')
      .remove();

  });

  // Marca un pedido como impreso.
  socket.on('pedido:printed', function(data) {
    
    $tbody.find('#row-' + data.id + ' .pay')
      .toggle('puff');

    $tbody.find('#row-' + data.id + ' span')
      .hide('puff')
      .removeClass('pure-button-warning')
      .addClass('pure-button-secondary')
      .text('Impreso')
      .show('slide');
  });

  // Marca un pedido como pagado.
  socket.on('pedido:paid', function(data) {
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

})(jQuery);