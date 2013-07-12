var cafetin = cafetin || {};

(function() {
  cafetin.Detalles = Backbone.Collection.extend({
    model: cafetin.Detalle,

    initialize: function() {
      
    }
  });

  cafetin.theDetalles = new cafetin.Detalles;
})();