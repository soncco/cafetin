var cafetin = cafetin || {};

(function($) {

  var $tbody = $('#carta tbody');

  parsePlato = function(pedido) {
    
    theClass = (($tbody.find('tr').length) % 2 == 0) ? 'pure-table-odd' : '';
        
    $tr = $('<tr></tr>');
    $td = $('<td></td>');
    $imgurl = $('<a class="colorbox">Ver foto</a>');

    $td.clone().text(pedido.nombre).appendTo($tr);
    $td.clone().text(pedido.precio).appendTo($tr);
    $td.clone().text(pedido.tipo).appendTo($tr);
    $td.clone().html(
      $imgurl
        .attr('href', cafetin.media + pedido.foto)
        .attr('title', pedido.nombre)
        .colorbox())
      .appendTo($tr);

    $tr.addClass(theClass).hide().prependTo($tbody).show('highlight', {}, 1000);
  };

  parseCarta = function(platos) {
    for(i = 0; i < platos.length; i++) {
      row = platos[i];
      parsePlato(row);
    }
  };

  $.ajax({
    url: cafetin.server + "/carta/json",
    dataType: "jsonp",
    success: function( data ) {
      parseCarta(data);
    }
  });

})(jQuery);