# -*- coding: utf-8 -*-

from models import Comanda, ComandaDetalle, Consumo, ConsumoDetalle

def pedido_json(pedido):
  cliente = pedido.para
  fecha = pedido.cuando
  comanda = 'false'
  consumo = 'false'

  # Detalles
  detalles = []
  for detalle in pedido.pedidodetalle_set.all():
    cantidad = detalle.cantidad
    precio = float(detalle.plato.precioplato_set.get(anio = 2013).precio)
    sub = cantidad * precio
    if detalle.plato.tipo.recibo == 'D':
      comanda = 'true'
    if detalle.plato.tipo.recibo == 'C':
      consumo = 'true'

    detalles.append({
      'cantidad': cantidad,
      'plato': detalle.plato.nombre,
      'precio': precio,
      'sub': sub
    })

  return {
    'id': pedido.id,
    'para': cliente.nombres + ' ' + cliente.apellidos,
    'estado': pedido.estado,
    'comentarios': pedido.notas,
    'detalles': detalles,
    'hecho_por': pedido.hecho_por.first_name,
    'fecha': str(pedido.cuando),
    'punto': pedido.punto.id,
    'comanda': comanda,
    'consumo': consumo
  }

def total_pedido(pedido):
  total = 0
  for detalle in pedido.pedidodetalle_set.all():
    total += detalle.plato.precioplato_set.get(anio = 2013).precio * detalle.cantidad

  return total

def total_pedido_tipo(pedido, tipo):
  total = 0
  for detalle in pedido.pedidodetalle_set.all():
    if detalle.plato.tipo.recibo == tipo:
      total += detalle.plato.precioplato_set.get(anio = 2013).precio * detalle.cantidad
  return total

def crear_comanda(request, pedido):
  local = request.session['local']
  total = total_pedido_tipo(pedido, 'C')

  if Comanda.objects.filter(pedido = pedido).count > 0:
    pass

  comanda = Comanda(local = local, pedido = pedido, total = total)
  comanda.save()

  for detalle in pedido.pedidodetalle_set.all():
    plato = detalle.plato
    cantidad = detalle.cantidad
    unitario = detalle.plato.precioplato_set.get(anio = 2013).precio
    subtotal = cantidad * unitario
    cd = ComandaDetalle(pertenece_a_comanda = comanda, plato = plato, cantidad = cantidad, unitario = unitario, subtotal = subtotal)
    cd.save()

def crear_consumo(request, pedido, number):
  local = request.session['local']
  total = total_pedido_tipo(pedido, 'D')
  numero = number

  if Consumo.objects.filter(pedido = pedido).count > 0:
    pass

  consumo = Consumo(local = local, pedido = pedido, total = total, numero = numero)
  consumo.save()

  for detalle in pedido.pedidodetalle_set.all():
    plato = detalle.plato
    cantidad = detalle.cantidad
    unitario = detalle.plato.precioplato_set.get(anio = 2013).precio
    subtotal = cantidad * unitario
    cd = ConsumoDetalle(pertenece_a_consumo = consumo, plato = plato, cantidad = cantidad, unitario = unitario, subtotal = subtotal)
    cd.save()
