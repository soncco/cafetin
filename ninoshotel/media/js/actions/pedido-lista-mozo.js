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
  var $tbody = $('#pedido-lista tbody');

  // Quita un pedido.
  removePedido = function() {
    remover = window.confirm('¿Está seguro de remover este pedido?');
    if(remover) {
      why = prompt('Escriba la razón por la que está eliminando el pedido.');
      if(why != '') {
        $.post('/pedido/quitar/', {
          'id': $(this).data('id'),
          'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
          'why': why
        }, function(data) {
          if(data.status == 'ok') {
            io.emit('pedido:quitar', data);
          } else {
            alert('Hubo un error al eliminar el pedido, intenta nuevamente.');
          }
        }); 
      } else {
        alert('Tiene que escribir una razón');
      }
    }
  };

  // Imprime un pedido.
  printPedido = function() {
    id = $(this).data('id');
    comanda = $(this).data('comanda');
    consumo = $(this).data('consumo');

    $('.comanda').data('id', id);
    $('.consumo').data('id', id);

    $('.comanda').show();
    $('.consumo').show();
    if(!comanda) $('.comanda').hide();
    if(!consumo) $('.consumo').hide();

    $('#theModal').modal({show: true});
  };

  printDoc = function() {
    var id = $(this).data('id');
    var what = $(this).data('what');
    var thedoc = 0;
    var number = 0;

    $.when(
      $.ajax({
        url: '/json/' + what + '/' + id + '/',
        dataType: 'json'
      })
    ).done(function(data) {
      thedoc = parseInt(data);
      if(what == 'consumo') {
        if(!thedoc) {
          number = prompt('Ingresa el número del detalle de consumo.');
          if(_.isEmpty(number)) { // Fix.
            alert('Debes ingresar un número');
            return;
          }
        }
      }

      $.post('/pedido/imprimir/', {
        'id': id,
        'what': what,
        'thedoc': thedoc,
        'number': number,
        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
      }, function(data) {
        if(data.status == 'ok') {
          io.emit('pedido:imprimir', data);
          $('#theModal').modal('hide');
        } else {
          alert('Hubo un error al imprimir el pedido, intenta nuevamente.');
        }
      });
    }); 
  }

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
    // Los elementos de las filas.
    $tr = $('<tr></tr>');
    $td = $('<td></td>');
    $status = $('<span class="btn btn-sm"></span>');
    $print = $('<button class="btn btn-sm btn-info print" data-id=""></button>&nbsp;')
      .html($('<i class="icon icon-print"></i>'));
    $delete = $('<button class="btn btn-sm btn-danger delete" data-id=""></button>')
      .html($('<i class="icon icon-remove"></i>'));

    $td.clone().text(pedido.para).appendTo($tr);
    $td.clone().html(parseDetalles(pedido.detalles)).appendTo($tr);
    $td.clone().text(pedido.comentarios).appendTo($tr);
    $td.clone().text(jQuery.timeago(pedido.fecha)).addClass('timeago').appendTo($tr);
    $td.clone().html($status.text(cafetin.estados[pedido.estado].texto).addClass(cafetin.estados[pedido.estado].clase)).appendTo($tr);

    // Verifica los estados del pedido.
    switch(pedido.estado) {
      case 'R':
        $print.hide();
      break;
      case 'A':
        $delete.hide();
      break;
      case 'I':
        $delete.hide();
      break;
      case 'P':
        $delete.hide();
      break;
    };
    debugger;
    $td.clone()
        .append($print.data('id', pedido.id)
          .data('comanda', pedido.comanda)
          .data('consumo', pedido.consumo)
          )
        .append($delete.data('id', pedido.id))
      .addClass('actions')
      .appendTo($tr);

    // Agrega eventos a los botones.
    $tr.delegate('.delete', 'click', removePedido);
    $tr.delegate('.print', 'click', printPedido);


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

  // Crea un pedido.
  io.on('pedido:creado', function(data) {
    for(i = 0; i < data.pedidos.length; i++) {
      pedido = data.pedidos[i];
      parsePedido(pedido);
    }
  });

  // Quita un pedido.
  io.on('pedido:quitado', function(data) {
    $tbody.find('#row-' + data.id).removeClass().addClass('animated slideOutLeft').delay(1000).fadeOut();
  });

  // Marca un pedido como atendido.
  io.on('pedido:atendido', function(data) {
    $tbody.find('#row-' + data.id + ' .print')
      .show()
      .addClass('animated tada');

    $tbody.find('#row-' + data.id + ' span')
      .addClass('animated slideOut')
      .removeClass('btn-danger animated slideOut')
      .addClass('btn-warning animated bounceIn')
      .text('Atendido');

    $tbody.find('#row-' + data.id + ' .delete')
      .remove();

  });

  // Marca un pedido como impreso.
  io.on('pedido:impreso', function(data) {
    
    $el = $tbody.find('#row-' + data.id + ' span');
    if($el.text() != 'Pagado') {
      $el
        .addClass('animated slideOut')
        .removeClass('btn-warning animated slideOut')
        .addClass('btn-info animated bounceIn')
        .text('Impreso');
    }
  });

  // Muestra una ventana con el comprobante.
  io.on('pedido:imprime', function(data) {
    //window.open('/pedido/imprimir/' + data.what + '/' + data.id, 'print','width=500,height=800');
    frameSrc = '/pedido/imprimir/' + data.what + '/' + data.id;
    $('iframe').attr("src", frameSrc);
    $('#printModal').modal({show: true});
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

  $('.delete').click(removePedido);
  $('.print').click(printPedido);
  $('.comanda').click(printDoc);
  $('.consumo').click(printDoc);
})(jQuery);