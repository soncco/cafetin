var cafetin = cafetin || {};

(function($) {

  var $tbody = $('#pedido-lista tbody');

  removePedido = function() {
    remover = window.confirm('¿Está seguro de remover este pedido?');

    if(remover) {
      socket.emit('pedido:quitar', {'id': $(this).data('id')});
    }
  };

  parseDetalles = function(detalles) {
    $ul = $('<ul></ul>');
    $li = $('<li></li>'); 

    for(j = 0; j < detalles.length; j++) {
      detalle = detalles[j];
      $li.clone().text(detalle.cantidad + ' x ' + detalle.plato).appendTo($ul);
    }
    return $ul;
  };

  parsePedido = function(pedido) {
    
    theClass = (($tbody.find('tr').length) % 2 == 0) ? 'pure-table-odd' : '';
        
    $tr = $('<tr></tr>');
    $td = $('<td></td>');
    $status = $('<span class="pure-button"></span>');
    $edit = $('<button class="pure-button pure-button-secondary edit" data-id=""></button>&nbsp;').html($('<i class="icon-pencil"></i>'));
    $delete = $('<button class="pure-button pure-button-error delete" data-id=""></button>').html($('<i class="icon-remove"></i>'));    

    $td.clone().text(pedido.para).appendTo($tr);
    $td.clone().html(parseDetalles(pedido.detalles)).appendTo($tr);
    $td.clone().text(pedido.comentarios).appendTo($tr);
    $td.clone().text(pedido.hecho_por).appendTo($tr);
    $td.clone().text(jQuery.timeago(pedido.fecha)).addClass('timeago').appendTo($tr);
    $td.clone().html($status.text(cafetin.estados[pedido.estado].texto).addClass(cafetin.estados[pedido.estado].clase)).appendTo($tr);
    $td.clone().append($edit.data('id', pedido.id)).appendTo($tr);
    $td.clone().append($delete.data('id', pedido.id)).appendTo($tr);

    $tr.delegate('.delete', 'click', removePedido);

    $tr
      .attr('id', 'row-' + pedido.id)
      .addClass(theClass)
      .hide()
      .prependTo($tbody)
      .show('highlight', {}, 1000);
  };

  parsePedidos = function(pedidos) {
    for(i = 0; i < pedidos.length; i++) {
      row = pedidos[i];
      parsePedido(row);
    }
  };

  $.ajax({
    url: cafetin.server + "/pedido/json",
    dataType: "jsonp",
    success: function( data ) {
      parsePedidos(data);
    }
  });

  socket.on('pedido:creado', function(data) {
    parsePedido(data.pedido);
  });

  socket.on('pedido:quitado', function(data) {
    $tbody.find('#row-' + data.id).hide('highlight', {}, 1000);
  });

  setTimeout(function() {
    location.reload();
  }, 300000);
})(jQuery);