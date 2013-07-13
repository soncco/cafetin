
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
app.get('/logout', routes.logout);

app.get('/', checkAuth, routes.index);
app.get('/pedido', checkAuth, routes.pedido);
app.get('/pedido/lista', routes.pedido_lista);
app.get('/carta', routes.carta);

/*app.post('/test', routes.test);*/

// Sockets.
io.sockets.on('connection', function(socket) {

  // Crear pedido.
  socket.on('pedido:nuevo', function(data) {
    var values = querystring.stringify(data);
    var options = {
      hostname: 'localhost',
      port: '8000',
      path: '/pedido/add',
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
        io.sockets.emit('pedido:creado', data);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message)
    })

    req.write(values);
    req.end();

  });

  // Quitar pedido.
  socket.on('pedido:quitar', function(data) {
    var values = querystring.stringify(data);
    var options = {
      hostname: 'localhost',
      port: '8000',
      path: '/pedido/remove',
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
        io.sockets.emit('pedido:quitado', data);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message)
    })

    req.write(values);
    req.end();
  });

  // Atender pedido.
  socket.on('pedido:atender', function(data) {
    var values = querystring.stringify(data);
    var options = {
      hostname: 'localhost',
      port: '8000',
      path: '/pedido/atender',
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
        io.sockets.emit('pedido:atendido', data);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message)
    })

    req.write(values);
    req.end();
  });

  // Imprimir pedido.
  socket.on('pedido:print', function(data) {
    var values = querystring.stringify(data);
    var options = {
      hostname: 'localhost',
      port: '8000',
      path: '/pedido/printed',
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
        console.log('printed' +  data);
        io.sockets.emit('pedido:printed', data);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message)
    })

    req.write(values);
    req.end();
  });

  // Pagar pedido.
  socket.on('pedido:atender', function(data) {
    var values = querystring.stringify(data);
    var options = {
      hostname: 'localhost',
      port: '8000',
      path: '/pedido/pay',
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
        io.sockets.emit('pedido:paid', data);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message)
    })

    req.write(values);
    req.end();
  });

  // Login.
  socket.on('login', function(data) {
    var values = querystring.stringify(data);
    var options = {
      hostname: 'localhost',
      port: '8000',
      path: '/login',
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
        if(data.status == 'ok')
          socket.user = data.user;
        io.sockets.emit('logged', data);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message)
    })

    req.write(values);
    req.end();
  });
});

server.listen(3000, '0.0.0.0');