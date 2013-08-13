# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from cafetin.models import Punto
import json


# Puntos de un local.
def lista_puntos_local(request, local):
  # Los puntos de un local
  puntos = Punto.objects.filter(pertenece_a = local)
  
  callback = request.GET.get('callback')
  response = []
  for punto in puntos:
    response.append({
      'id': punto.id,
      'nombre': punto.nombre
    })

  return HttpResponse(callback + '(' + json.dumps(response, cls = DjangoJSONEncoder) + ')', mimetype = "application/json")