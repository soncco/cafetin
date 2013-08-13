var cafetin = cafetin || {};

(function() {
  cafetin.Detalle = Backbone.Model.extend({
    defaults: function() {
      return {
        cantidad: 1,
        platoNombre: '',
        platoId: 0
      };
    },

    validate: function(attribs) {
      if(attribs.platoNombre == '' || attribs.platoId < 1) {
        return 'Ingresa el nombre del plato';
      }
    },

    initialize: function() {
      this.on('invalid', function(model, error) {
        alert(error);
      });
    }
  });
})();