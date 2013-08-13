from django.conf.urls import patterns,url


urlpatterns = patterns('cafetin.views',

  # Locales.
  #url(r'^local/$', 'lista', name = 'local_lista'),

  url(r'^login$', 'login', name = 'login'),

  url(r'^cliente/(?P<q>.*)/$', 'busqueda_clientes', name = 'clientes_json'),

  url(r'^plato/(?P<local>.*)/(?P<q>.*)/$', 'busqueda_platos_local', name = 'platos_local_json'),
  url(r'^plato/(?P<q>.*)/$', 'busqueda_platos', name = 'platos_json'),
  

  url(r'^carta/json$', 'carta', name = 'carta_json'),
  url(r'^pedido/add$', 'add_pedido', name = 'agrega_pedido'),
  url(r'^pedido/json$', 'json_pedidos', name = 'pedidos_json'),
  url(r'^pedido/json/mozo/(?P<mozo>.*)/$', 'json_pedidos_mozo', name = 'pedidos_mozo_json'),
  url(r'^pedido/remove$', 'remove_pedido', name = 'quita_pedido'),
  url(r'^pedido/atender$', 'atender_pedido', name = 'atender_pedido'),
  url(r'^pedido/printed$', 'pedido_printed',   name = 'pedido_printed'),
  url(r'^pedido/pay$', 'pay_pedido',   name = 'pay_pedido'),

  url(r'^pedido/print/(?P<id>.*)/$', 'print_pedido',   name = 'print_pedido'),
  

  url(r'^local/json$', 'locales_json', name = 'locales_json'),

  url(r'^testpdf$', 'theviewcito', name = 'theviewcito'),

)