
/*
 * GET home page.
 */

exports.login = function(req, res) {
  res.render('login');
};

exports.logout = function(req, res) {
  res.render('logout');
};

exports.index = function(req, res){
  res.render('index');
};

exports.pedido = function(req, res) {
  res.render('pedido');
};

exports.pedido_lista = function(req, res) {
  res.render('pedido-lista');
};

exports.carta = function(req, res) {
  res.render('carta');
};
/*exports.test = function(req, res) {
  console.log('request ' + JSON.stringify(req.));
  res.render('test', {'req': req.body})
}*/