var cafetin = cafetin || {};

(function() {
  cafetin.Detalle = Backbone.Model.extend({
    defaults: function() {
      return {
        cantidad: 1,
        platoNombre: '',
        platoId: 0
      };
    }
  });
})();