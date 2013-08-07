var cafetin = cafetin || {};
cafetin.ip = 'http://198.58.111.119';
cafetin.server = cafetin.ip + ':8000';
cafetin.socketserver = cafetin.ip + ':4000';
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
