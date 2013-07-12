from django.conf.urls import patterns,url


urlpatterns = patterns('cafetin.views',

  # Locales.
  #url(r'^local/$', 'lista', name = 'local_lista'),

  url(r'^login$', 'login', name = 'login'),

  url(r'^cliente/(?P<q>.*)/$', 'busqueda_clientes', name = 'clientes_json'),

  url(r'^plato/(?P<q>.*)/$', 'busqueda_platos', name = 'platos_json'),

  url(r'^carta/json$', 'carta', name = 'carta_json'),
  url(r'^pedido/add$', 'add_pedido', name = 'agrega_pedido'),
  url(r'^pedido/json$', 'json_pedidos', name = 'pedidos_json'),
  url(r'^pedido/remove$', 'remove_pedido', name = 'quita_pedido'),

  url(r'^local/json$', 'locales_json', name = 'locales_json'),

)