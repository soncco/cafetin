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
  var $template = $('#template').html();
  var $table = $('#pedido-lista');
  var $tbody = $table.find('tbody');
  var $ver = $('.ver');

  $('#the-form').submit(function(e) {

    $tbody.empty();
    $table.removeClass('animated fadeInDownBig').delay(1000).hide();

    $ver.attr('disabled', 'disabled');
    $ver.text('Un momento...');

    $.get('/json/pedido/habitacion/' + $('#habitacion').val(),
      function(data) {
        tr = Mustache.to_html($template, data);
        $tbody.html(tr);
        $table.find('.timeago').timeago();

        $estados = $table.find('.estado');
        $estados.each(function() {
          text = cafetin.estados[$(this).text()].texto;
          span = $('<span></span>').text(text).addClass('btn btn-sm ' + cafetin.estados[$(this).text()].clase);
          $(this).html(span);
        })

        $table.show().addClass('animated fadeInDownBig');
        $ver.removeAttr('disabled');
        $ver.text('Ver pedidos');
      });
    e.preventDefault();
  });
})(jQuery);