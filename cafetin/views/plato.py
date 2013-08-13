# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from cafetin.models import Plato, Punto
import json

# Platos.
def busqueda_platos(request, q):
  platos = Plato.objects.filter(nombre__icontains = q)
  callback = request.GET.get('callback')
  response = []
  for plato in platos:
    response.append({
      'id': plato.id,
      'nombre': plato.nombre,
      'precio': plato.precio,
      'foto': str(plato.foto),
    })

  return HttpResponse(callback + '(' + json.dumps(response, cls = DjangoJSONEncoder) + ')', mimetype = "application/json")  

# Platos vendidos en cierto local.
def busqueda_platos_local(request, local, q):
  # Los puntos de un local
  puntos = Punto.objects.filter(pertenece_a = local)
  
  # Busqueda de platos de locales
  platos = Plato.objects.filter(de_venta_en__in = puntos, nombre__icontains = q)
  callback = request.GET.get('callback')
  response = []
  for plato in platos:
    response.append({
      'id': plato.id,
      'nombre': plato.nombre,
      'precio': plato.precio,
      'foto': str(plato.foto),
    })

  return HttpResponse(callback + '(' + json.dumps(response, cls = DjangoJSONEncoder) + ')', mimetype = "application/json")

def carta(request):
  platos = Plato.objects.filter()
  callback = request.GET.get('callback')
  response = []
  for plato in platos:
    response.append({
      'id': plato.id,
      'nombre': plato.nombre,
      'precio': plato.precio,
      'tipo': plato.tipo.nombre,
      'foto': str(plato.foto),
    })

  return HttpResponse(callback + '(' + json.dumps(response, cls = DjangoJSONEncoder) + ')', mimetype = "application/json")