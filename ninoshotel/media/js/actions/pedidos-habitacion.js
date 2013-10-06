var cafetin = cafetin || {};

(function($) {

  $rooms = $('.rooms');

  parseRoom = function(room) {
    $option = $('<option></option>');
    $option.clone().text(room.nombre).val(room.id).appendTo($rooms);
  };

  parseRooms = function(rooms) {
    for(i = 0; i < rooms.length; i++) {
      row = rooms[i];
      parseRoom(row);
    }
  };

  $.ajax({
    url: cafetin.server + "/habitacion/json/" + cafetin.local,
    dataType: "jsonp",
    success: function( data ) {
      parseRooms(data);
    }
  });

  $('.show').click(function() {
    $.ajax({
      url: cafetin.server + "/pedido/json/habitacion/" + $rooms.val(),
      dataType: "jsonp",
      success: function( data ) {
        parsePedidos(data);
      }
    });
  });

  // La tabla.
  var $tbody = $('#pedido-lista tbody');

  // Imprime un pedido.
  printPedido = function() {
    print = window.confirm('Se enviará el documento a impresión ¿Está seguro?');

    if(print) {
      socket.emit('pedido:print', {'id': $(this).data('id')});
    }
  };

  // Paga un pedido.
  payPedido = function() {
    pay = window.confirm('¿Está seguro de marcar este pedido como PAGADO?');

    if(pay) {
      socket.emit('pedido:pay', {'id': $(this).data('id')});
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
    $print = $('<button class="pure-button pure-button-secondary print" data-id=""></button>&nbsp;').html($('<i class="icon-print"></i>'));
    $pay = $('<button class="pure-button pure-button-success pay" data-id=""></button>&nbsp;').html($('<i class="icon-money"></i>'));

    $td.clone().text(pedido.para).appendTo($tr);
    $td.clone().html(parseDetalles(pedido.detalles)).appendTo($tr);
    $td.clone().text(pedido.comentarios).appendTo($tr);
    $td.clone().text(pedido.hecho_por).appendTo($tr);
    $td.clone().text(jQuery.timeago(pedido.fecha)).addClass('timeago').appendTo($tr);
    $td.clone().html($status.text(cafetin.estados[pedido.estado].texto).addClass(cafetin.estados[pedido.estado].clase)).appendTo($tr);

    // Verifica los estados del pedido.
    switch(pedido.estado) {
      case 'R':
        $print.hide();
        $pay.hide();
      break;
      case 'A':
        $pay.hide();
        $print.hide();
      break;
      case 'I':
      break;
      case 'P':
        $pay.hide();
      break;
    }

    $td.clone()
        .append($print.data('id', pedido.id))
        .append($pay.data('id', pedido.id))
      .addClass('actions')
      .appendTo($tr);

    // Agrega eventos a los botones.
    $tr.delegate('.print', 'click', printPedido);
    $tr.delegate('.pay', 'click', payPedido);

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
    $tbody.empty();
    for(i = 0; i < pedidos.length; i++) {
      row = pedidos[i];
      parsePedido(row);
    }
  };

  // Parsea puntos de JSON a una lista HTML.
  parsePuntos = function(puntos) {
    for(i = 0; i < puntos.length; i++) {
      row = puntos[i];
      $li = $('<li></li>');
      $a = $('<a href="#"></a>').addClass('menu-item');
      $li.html($a.clone().data('id', row.id).text(row.nombre)).appendTo($puntos);

      // Eventos al menú.
      $li.delegate('.menu-item', 'click', showPedidos);
    }
  };

  // Sockets.
  // Marca un pedido como impreso.
  socket.on('pedido:printed', function(data) {
    
    $el = $tbody.find('#row-' + data.id + ' span');
    if($el.text() != 'Pagado') {
      $el
        .hide('puff')
        .removeClass('pure-button-warning')
        .addClass('pure-button-secondary')
        .text('Impreso')
        .show('slide');
    }
  });

  // Marca un pedido como pagado.
  socket.on('pedido:paid', function(data) {
    $tbody.find('#row-' + data.id + ' .pay')
      .remove();

    $tbody.find('#row-' + data.id + ' span')
      .hide('puff')
      .removeClass('pure-button-secondary')
      .addClass('pure-button-success')
      .text('Pagado')
      .show('slide'); 
  });

  // Muestra una ventana con el comprobante.
  socket.on('printforme', function(data) {
    window.open(cafetin.server + '/pedido/print/' + data.id, 'print','width=200,height=400');
  }); 

})(jQuery);