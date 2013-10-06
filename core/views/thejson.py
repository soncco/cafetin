from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models import Q

from ..models import Cliente, Punto, Plato, Habitacion, Pedido
from ..utils import pedido_json

from datetime import date
import json


# Clientes hospedados en cierto local.
@login_required
def json_clientes_local(request, q):

  clientes = Cliente.objects.filter(nombres__icontains = q, activo = True) | Cliente.objects.filter(apellidos__icontains = q, activo = True)
  callback = request.GET.get('callback')
  context = []
  for cliente in clientes:
    if cliente.hospedado_en.pertenece_a == request.session['local']:
      context.append({
        'id': cliente.id,
        'nombres': cliente.nombres,
        'apellidos': cliente.apellidos,
      })

  return HttpResponse(callback + '(' + json.dumps(context) + ')', mimetype = "application/json")


# Platos vendidos en cierto local.
@login_required
def json_platos_local(request, q):

  local = request.session['local']
  # Los puntos de un local
  puntos = Punto.objects.filter(pertenece_a = local)
  
  # Busqueda de platos de locales
  platos = Plato.objects.filter(de_venta_en__in = puntos, nombre__icontains = q)
  callback = request.GET.get('callback')
  context = []
  for plato in platos:
    context.append({
      'id': plato.id,
      'nombre': plato.nombre,
      #'precio': plato.platoprecio,
      'foto': str(plato.foto),
    })

  return HttpResponse(callback + '(' + json.dumps(context) + ')', mimetype = "application/json")

@login_required
def pedido_lista_habitacion(request, id):
  habitacion = Habitacion.objects.get(pk = id)
  clientes = Cliente.objects.filter(hospedado_en = habitacion, activo = True)

  context = []
  for cliente in clientes:
    pedidos = Pedido.objects.filter(estado = 'A', para = cliente) | Pedido.objects.filter(estado = 'I', para = cliente)
    for pedido in pedidos:
      context.append(pedido_json(pedido))

  return HttpResponse(json.dumps({'pedidos': context }), mimetype = "application/json")