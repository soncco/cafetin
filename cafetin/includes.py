def pedido_json(pedido):
  cliente = pedido.para
  fecha = pedido.cuando
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
    'hecho_por': pedido.hecho_por.username,
    'fecha': str(pedido.cuando),
  }

def total_pedido(pedido):
  total = 0
  for detalle in pedido.pedidodetalle_set.all():
    total += detalle.plato.precio

  return total