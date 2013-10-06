var cafetin = cafetin || {};

(function($) {

  cafetin.PedidoView = Backbone.View.extend({
    tagName: 'tr',

    template: _.template($('#template').html()),

    events: {
      'click .remove-plato': 'delete'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON())).addClass('animated flipInY');
      return this;
    },

    delete: function(e) {
      this.model.destroy();
      e.preventDefault();
    }
  });

})(jQuery);