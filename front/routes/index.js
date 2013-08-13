
/*
 * GET home page.
 */

var sanitizer = require('sanitizer')
  , querystring = require('querystring')
  , http = require('http');

exports.login = function(req, res) {
  res.render('login');
};

exports.loginPost = function(req, res) {
  username = sanitizer.escape(req.body.username);
  password = sanitizer.escape(req.body.password);
  local = sanitizer.escape(req.body.local);

  values = querystring.stringify({
    'username': username,
    'password': password,
    'local': local
  });
  
  var options = {
    'host': 'localhost',
    'port': 8000,
    'path': '/login',
    'method': 'POST',
    'headers': {
      'Content-type': 'application/x-www-form-urlencoded',
      'Content-Length': values.length
    }
  };

  var request = http.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      data = JSON.parse(data);
      //res.send(data);
      if(data.status == 'ok') {
        req.session.user = data.user;
        console.log(data.user);
        res.redirect('/');
      } else {
        res.render('login', {error: 'error'});
      }
    });
  });

  request.on('error', function(e) {
    console.log('problem with request: ' + e.message)
  })

  request.write(values);  
  request.end();
};

exports.logout = function(req, res) {
  delete req.session.user;
  res.render('login', {status: 'logout'});
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

exports.pedido_lista_mozo = function(req, res) {
  res.render('pedido-lista-mozo');
};

exports.pedido_lista_cocina = function(req, res) {
  res.render('pedido-lista-cocina');
};

exports.carta = function(req, res) {
  res.render('carta');
};
/*exports.test = function(req, res) {
  console.log('request ' + JSON.stringify(req.));
  res.render('test', {'req': req.body})
}*/