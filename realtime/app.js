var express = require('express.io')
  , app = express().http().io()
  , redis = require('redis')
  , RedisStore = require('connect-redis')(express)
  , cookie = require('cookie')
  , querystring = require('querystring');

app.use(express.cookieParser());
app.use(express.session({
    secret: 'tb^0ifxlomxosu5n7u#2wj+-d$j^y)69**8r9au)@5b__ijlg7',
    store: new RedisStore({
        client: redis.createClient()  
    }) 
}));

app.io.set('store', new express.io.RedisStore({
    redisPub: redis.createClient(),
    redisSub: redis.createClient(),
    redisClient: redis.createClient(),
}));

app.io.configure(function() {
  app.io.set('authorization', function(data, accept) {
    if(data.headers.cookie) {
      data.cookie = cookie.parse(data.headers.cookie);
      return accept(null, true);
    }
    return accept('error', false);
  });
});

app.io.route('room', function(req) {
  req.io.join(req.data.room);
});

app.io.route('pedido', {
  nuevo: function(req) {
    app.io.room(req.data.local).broadcast('pedido:creado', req.data);
  },
  quitar: function(req) {
    app.io.room(req.data.local).broadcast('pedido:quitado', req.data);
  },
  atender: function(req) {
    app.io.room(req.data.local).broadcast('pedido:atendido', req.data);
  },
  imprimir: function(req) {
    app.io.room(req.data.local).broadcast('pedido:impreso', req.data);
    req.io.emit('pedido:imprime', req.data);
  }
});

app.listen(3000);