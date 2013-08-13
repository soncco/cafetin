# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from cafetin.models import Habitacion
import json


# Habitaciones de un local.
def habitaciones_local(request, local):
  habitaciones = Habitacion.objects.filter(pertenece_a = local)
  
  callback = request.GET.get('callback')
  response = []
  for h in habitaciones:
    response.append({
      'id': h.id,
      'nombre': h.nombre
    })

  return HttpResponse(callback + '(' + json.dumps(response, cls = DjangoJSONEncoder) + ')', mimetype = "application/json")