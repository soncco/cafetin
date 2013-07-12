# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.http import HttpResponse
from cafetin.models import Cliente
import json

# Locales.
def busqueda_clientes(request, q):
  clientes = Cliente.objects.filter(nombres__icontains = q) | Cliente.objects.filter(apellidos__icontains = q)
  callback = request.GET.get('callback') #Jsonp callback function.
  response = []
  for cliente in clientes:
    response.append({
      'id': cliente.id,
      'nombres': cliente.nombres,
      'apellidos': cliente.apellidos,
    })

  return HttpResponse(callback + '(' + json.dumps(response) + ')', mimetype = "application/json")