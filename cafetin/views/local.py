# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from cafetin.models import Local
import json

# Platos.
def locales_json(request):
  locales = Local.objects.filter()
  callback = request.GET.get('callback')
  response = []
  for local in locales:
    response.append({
      'id': local.id,
      'nombre': local.nombre,
    })

  return HttpResponse(callback + '(' + json.dumps(response, cls = DjangoJSONEncoder) + ')', mimetype = "application/json")