def pedido_json(pedido):
  cliente = pedido.para
  fecha = pedido.cuando

  # Local donde se ha vendido.
  punto = pedido.punto
  local = punto.pertenece_a.id

  # Detalles
  detalles = []
  for detalle in pedido.pedidodetalle_set.all():
    detalles.append({
      'cantidad': detalle.cantidad,
      'plato': detalle.plato.nombre
    })

  return {
    'id': pedido.id,
    'para': cliente.nombres + ' ' + cliente.apellidos,
    'estado': pedido.estado,
    'comentarios': pedido.notas,
    'detalles': detalles,
    'hecho_por': pedido.hecho_por.first_name,
    'fecha': str(pedido.cuando),
    'local': local
  }

def total_pedido(pedido):
  total = 0
  for detalle in pedido.pedidodetalle_set.all():
    total += detalle.plato.precio

  return total