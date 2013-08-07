
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , nib = require('nib')
  , querystring = require('querystring')
  , stylus = require('stylus')
  , http = require('http')
  , path = require('path');

var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

// Middleware.
app.use(stylus.middleware({
  src: __dirname + '/public'
    , compile: compile
  }
));

app.use(require('express-uglify').middleware({
  src: __dirname + '/public'
}));

function checkAuth(req, res, next) {
  //console.log(io);
  next();
}

var theSecret = 'fm@tt9-7i&p#2l4q2*#5jxcr1d5xo4$$0iy@^nk79gi0zg0*71';

// Add POST, PUT, DELETE methods to the app.
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(theSecret));
app.use(express.session());

// Paths.
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only.
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes.
app.get('/login', routes.login);
app.post('/login', function (req, res) {
  console.log(req);
  res.end(req.body.username);
});
app.get('/logout', routes.logout);

app.get('/', checkAuth, routes.index);
app.get('/pedido', checkAuth, routes.pedido);
app.get('/pedido/lista', routes.pedido_lista);
app.get('/carta', routes.carta);

/*app.post('/test', routes.test);*/

// Sockets.
io.sockets.on('connection', function(socket) {

  var actions = function(params) {
    values = querystring.stringify(params.data);
    var options = {
      hostname: 'localhost',
      port: '8000',
      path: params.path,
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Content-Length': values.length
      }
    };

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(data) {
        data = JSON.parse(data);
        if(!params.alone) // For all.
          io.sockets.emit(params.socketResponse, data);
        else { // For me.
          if(params.extraResponse) {
            socket.emit(params.extraResponse, data);
            io.sockets.emit(params.socketResponse, data);
          } else
            socket.emit(params.socketResponse, data);  
        }
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message)
    })

    req.write(values);
    req.end();
  };

  // Crear pedido.
  socket.on('pedido:nuevo', function(data) {
    params = {
      data: data,
      path: '/pedido/add',
      socketResponse: 'pedido:creado',
      alone: true,      
    };
    actions(params);
  });

  // Quitar pedido.
  socket.on('pedido:quitar', function(data) {
    params = {
      data: data,
      path: '/pedido/remove',
      socketResponse: 'pedido:quitado',
      alone: false
    };
    actions(params);
  });

  // Atender pedido.
  socket.on('pedido:atender', function(data) {
    params = {
      data: data,
      path: '/pedido/atender',
      socketResponse: 'pedido:atendido',
      alone: false
    };
    actions(params);
  });

  // Imprimir pedido.
  socket.on('pedido:print', function(data) {
    params = {
      data: data,
      path: '/pedido/printed',
      socketResponse: 'pedido:printed',
      alone: true,
      extraResponse: 'printforme'
    };
    actions(params);
  });

  // Pagar pedido.
  socket.on('pedido:pay', function(data) {
    params = {
      data: data,
      path: '/pedido/pay',
      socketResponse: 'pedido:paid',
      alone: false
    };
    actions(params);
  });

});

server.listen(4000, '0.0.0.0');
