var cafetin = cafetin || {};

(function($) {

  var $tbody = $('#pedido-lista tbody');

  removePedido = function() {
    remover = window.confirm('¿Está seguro de remover este pedido?');

    if(remover) {
      socket.emit('pedido:quitar', {'id': $(this).data('id')});
    }
  };

  atenderPedido = function() {
    atender = window.confirm('¿Está seguro de marcar este pedido como atendido?');

    if(atender) {
      socket.emit('pedido:atender', {'id': $(this).data('id')});
    }
  };

  printPedido = function() {
    print = window.confirm('Se enviará el documento a impresión ¿Está seguro?');

    if(print) {
      socket.emit('pedido:print', {'id': $(this).data('id')});
    }
  };

  payPedido = function() {
    pay = window.confirm('¿Está seguro de marcar este pedido como PAGADO?');

    if(pay) {
      socket.emit('pedido:pay', {'id': $(this).data('id')});
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
    $edit = $('<button class="pure-button pure-button-secondary attend" data-id=""></button>&nbsp;').html($('<i class="icon-check"></i>'));
    $print = $('<button class="pure-button pure-button-secondary print" data-id=""></button>&nbsp;').html($('<i class="icon-print"></i>'));
    $pay = $('<button class="pure-button pure-button-success pay" data-id=""></button>&nbsp;').html($('<i class="icon-money"></i>'));
    $delete = $('<button class="pure-button pure-button-error delete" data-id=""></button>').html($('<i class="icon-remove"></i>'));    

    $td.clone().text(pedido.para).appendTo($tr);
    $td.clone().html(parseDetalles(pedido.detalles)).appendTo($tr);
    $td.clone().text(pedido.comentarios).appendTo($tr);
    $td.clone().text(pedido.hecho_por).appendTo($tr);
    $td.clone().text(jQuery.timeago(pedido.fecha)).addClass('timeago').appendTo($tr);
    $td.clone().html($status.text(cafetin.estados[pedido.estado].texto).addClass(cafetin.estados[pedido.estado].clase)).appendTo($tr);

    switch(pedido.estado) {
      case 'R':
        $print.hide();
        $pay.hide();
      break;
      case 'A':
        $edit.hide();
        $pay.hide();
        $delete.hide();
      break;
      case 'I':
        $edit.hide();
        $delete.hide();
      break;
      case 'P':
        $edit.hide();
        $delete.hide();
      break;
    }

    $td.clone()
        .append($edit.data('id', pedido.id))
        .append($print.data('id', pedido.id))
        .append($pay.data('id', pedido.id))
        .append($delete.data('id', pedido.id))
      .addClass('actions')
      .appendTo($tr);

    $tr.delegate('.delete', 'click', removePedido);
    $tr.delegate('.attend', 'click', atenderPedido);
    $tr.delegate('.print', 'click', printPedido);
    $tr.delegate('.pay', 'click', payPedido);

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
    console.log(data);
    $tbody.find('#row-' + data.id).hide('highlight', {}, 1000);
  });

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

  socket.on('pedido:paid', function(data) {
    $tbody.find('#row-' + data.id + ' span')
      .hide('puff')
      .removeClass('pure-button-secondary')
      .addClass('pure-button-success')
      .text('Pagado')
      .show('slide'); 
  });

  socket.on('printforme', function(data) {
    window.open(cafetin.server + '/pedido/print/' + data.id, 'print','width=200,height=400');
  }); 

  setTimeout(function() {
    location.reload();
  }, 300000);

})(jQuery);