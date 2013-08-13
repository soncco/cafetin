# -*- coding: utf-8 -*-

from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.models import User, Permission, Group
from django.contrib.auth import login, logout, authenticate
from cafetin.models import Local
import json

@csrf_exempt
def login(request):
  if request.method == 'POST':
    username = request.POST['username']
    password = request.POST['password']
    local = request.POST['local']
    user = authenticate(username = username, password = password)
    if user is not None:
      if user.is_active:
        groups = []
        for g in user.groups.all():
          groups.append(g.name)

        local = Local.objects.get(id = local)
        context = {
          'status': 'ok',
          'user': {
            'id': user.id,
            'username': user.username,
            'first': user.first_name,
            'last': user.last_name,
            'groups': groups,
            'local': {
              'id': local.id,
              'nombre': local.nombre
            }
          }
        }
        return HttpResponse(json.dumps(context), content_type="application/json")
    else:
      context = {
        'status': 'error'
      }
      return HttpResponse(json.dumps(context), content_type="application/json")

  return HttpResponse(json.dumps({'ola': 'ke ase'}), content_type="application/json")
