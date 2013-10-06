var cafetin = cafetin || {};

(function($) {
  
  cafetin.AppPedidoView = Backbone.View.extend({
    el: '#container',

    initialize: function() {
      this.$nombre = this.$('#current-plato');
      this.$cantidad = this.$('#cantidad');

      this.$platos = this.$('#platos');
      this.$actions = this.$('#actions');

      this.listenTo(cafetin.theDetalles, 'add', this.addOne);
      this.listenTo(cafetin.theDetalles, 'reset', this.addAll);
      this.listenTo(cafetin.theDetalles, 'remove', this.handleControls);
    },

    events: {
      'click .add-plato': 'addPedido',
      'click .clear': 'clear'
    },

    addOne: function(pedido) {
      var view = new cafetin.PedidoView({model: pedido});
      $('#detalle-pedido').append(view.render().el);
    },

    addAll: function() {
      this.$('#detalle-pedido').html('');
      cafetin.theDetalles.each(this.addOne, this);
      this.$actions.removeClass().addClass('animated bounceOutDown');
      this.$actions.find('textarea').val('');
    },

    addPedido: function() {
      cafetin.theDetalles.add({
        'platoNombre': this.$nombre.val(),
        'platoId': this.$nombre.data('id'),
        'cantidad': this.$cantidad.val()
      }, {validate: true});
      if (cafetin.theDetalles.length > 0) this.$actions.removeAttr('style').removeClass().addClass('animated bounceInDown');
      this.clearInputs();
    },

    clearInputs: function() {
      this.$nombre.val('');
      this.$cantidad.val('').focus();
      this.$platos.val('');
    },

    clear: function() {
      cafetin.theDetalles.reset();
    },

    handleControls: function(x) {
      if(cafetin.theDetalles.length < 1) {
        this.$actions.removeClass().addClass('animated bounceOutDown');
        this.$actions.find('textarea').val('');
      }
    }
  });

  new cafetin.AppPedidoView();

})(jQuery);