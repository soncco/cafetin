var cafetin = cafetin || {};

cafetin.server = 'http://192.168.1.33:8000';
cafetin.socketserver = 'http://192.168.1.33:3000';
cafetin.media = cafetin.server + '/media/';

cafetin.estados = {
  R: {
    'texto': 'Recibido',
    'clase': 'pure-button-error'
  },
  A: {
    'texto': 'Atendido',
    'clase': 'pure-button-warning'
  },
  I: {
    'texto': 'Impreso',
    'clase': 'pure-button-secondary'
  },
  P: {
    'texto': 'Pagado',
    'clase': 'pure-button-success'
  }
};