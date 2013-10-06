from django.conf.urls import patterns,url


urlpatterns = patterns('core.views',
  url(r'^$', 'index', name = 'index'),
  url(r'^login/$', 'the_login', name = 'the_login'),
  url(r'^logout/$', 'the_logout', name = 'the_logout'),

  # Pedidos.
  url(r'^pedido/$', 'pedido', name = 'pedido'),
  url(r'^pedido/lista/mozo/$', 'pedido_lista_mozo', name = 'pedido_lista_mozo'),
  url(r'^pedido/lista/cocina/$', 'pedido_lista_cocina', name = 'pedido_lista_cocina'),
  url(r'^pedido/lista/recepcion/$', 'pedido_lista_recepcion', name = 'pedido_lista_recepcion'),
  url(r'^pedido/crear/$', 'pedido_crear', name = 'pedido_crear'), 
  url(r'^pedido/quitar/$', 'pedido_quitar', name = 'pedido_quitar'), 
  url(r'^pedido/atender/$', 'pedido_atender', name = 'pedido_atender'), 
  url(r'^pedido/imprimir/$', 'pedido_imprimir', name = 'pedido_imprimir'), 
  url(r'^pedido/imprimir/consumo/(?P<id>.*)$', 'pedido_imprimir_consumo', name = 'pedido_imprimir_consumo'), 
  url(r'^pedido/imprimir/comanda/(?P<id>.*)$', 'pedido_imprimir_comanda', name = 'pedido_imprimir_comanda'), 

  # JSON.
  url(r'^json/cliente/(?P<q>.*)/$', 'json_clientes_local', name = 'json_clientes_local'),
  url(r'^json/plato/(?P<q>.*)/$', 'json_platos_local', name = 'json_platos_local'),
  url(r'^json/pedido/habitacion/(?P<id>.*)/$', 'pedido_lista_habitacion', name = 'pedido_lista_habitacion'),
  url(r'^json/consumo/(?P<id>.*)/$', 'tiene_consumo', name = 'tiene_consumo'),
  url(r'^json/comanda/(?P<id>.*)/$', 'tiene_comanda', name = 'tiene_comanda'),
)