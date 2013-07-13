# -*- coding: utf-8 -*-
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404
from cafetin.models import Pedido, PedidoDetalle, Cliente, Plato, User
from cafetin.includes import pedido_json, total_pedido
from django_xhtml2pdf.utils import generate_pdf
import json, datetime

@csrf_exempt
def add_pedido(request):

  if request.method == "POST":
    dictx = request.POST.copy()

    para = Cliente.objects.get(id = dictx.get('para'))
    cantidad = dictx.getlist('cantidad')
    platos = dictx.getlist('platos')
    observaciones = dictx.get('observaciones')

    hecho_por = User.objects.get(id = 1)

    try:
      p = Pedido(hecho_por = hecho_por, para = para, cuando = datetime.datetime.now(), notas = observaciones)
      p.save()
    except Exception as e:
      print '%s (%s)' % (e.message, type(e))
      context = {'status': 'error'}
      return HttpResponse(json.dumps(context), content_type="application/json")

    for (key, plato) in enumerate(platos):
      pl = Plato.objects.get(id = plato)
      detalle = PedidoDetalle(pertenece_al_pedido = p, plato = pl, cantidad = cantidad[key])
      detalle.save()

    context = {'status': 'ok', 'pedido': pedido_json(p)}
    return HttpResponse(json.dumps(context), content_type="application/json")
  
  return HttpResponse(json)

def json_pedidos(request):
  pedidos = Pedido.objects.filter().order_by('cuando')
  callback = request.GET.get('callback')

  response = []
  for pedido in pedidos:
    response.append(pedido_json(pedido))

  return HttpResponse(callback + '(' + json.dumps(response) + ')', mimetype = "application/json")

@csrf_exempt
def remove_pedido(request):
  if request.method == "POST":
    dictx = request.POST.copy()

    pedido = Pedido.objects.get(id = dictx.get('id'))

    try:
      if pedido.estado == 'R':
        pedido.delete()
    except Exception as e:
      print '%s (%s)' % (e.message, type(e))
      context = {'status': 'error'}
      return HttpResponse(json.dumps(context), content_type="application/json")

    context = {'status': 'ok', 'id': dictx.get('id')}
    return HttpResponse(json.dumps(context), content_type="application/json")
  
  return HttpResponse(json)

@csrf_exempt
def atender_pedido(request):
  if request.method == "POST":
    dictx = request.POST.copy()

    pedido = Pedido.objects.get(id = dictx.get('id'))

    try:
      if pedido.estado == 'R':
        pedido.estado = 'A'
        pedido.save()
      else:
        context = {'status': 'error'}
        return HttpResponse(json.dumps(context), content_type="application/json")   
    except Exception as e:
      print '%s (%s)' % (e.message, type(e))
      context = {'status': 'error'}
      return HttpResponse(json.dumps(context), content_type="application/json")

    context = {'status': 'ok', 'id': dictx.get('id')}
    return HttpResponse(json.dumps(context), content_type="application/json")
  
  return HttpResponse(json)

@csrf_exempt
def pedido_printed(request):
  if request.method == "POST":
    dictx = request.POST.copy()

    pedido = Pedido.objects.get(id = dictx.get('id'))

    try:
        pedido.estado = 'I'
        pedido.save()
    except Exception as e:
      print '%s (%s)' % (e.message, type(e))
      context = {'status': 'error'}
      return HttpResponse(json.dumps(context), content_type="application/json")

    context = {'status': 'ok', 'id': dictx.get('id')}
    return HttpResponse(json.dumps(context), content_type="application/json")
  
  return HttpResponse(json)

@csrf_exempt
def pay_pedido(request):
  if request.method == "POST":
    dictx = request.POST.copy()

    pedido = Pedido.objects.get(id = dictx.get('id'))

    try:
        pedido.estado = 'P'
        pedido.save()
    except Exception as e:
      print '%s (%s)' % (e.message, type(e))
      context = {'status': 'error'}
      return HttpResponse(json.dumps(context), content_type="application/json")

    context = {'status': 'ok', 'id': dictx.get('id')}
    return HttpResponse(json.dumps(context), content_type="application/json")
  
  return HttpResponse(json)

def print_pedido(request, id):
  try:
    pedido = Pedido.objects.get(id = id)
  except pedido.DoesNotExist:
    raise Http404

  resp = HttpResponse(content_type='application/pdf')
  context = {'pedido': pedido, 'total': total_pedido(pedido)}
  result = generate_pdf('pedido.html', file_object = resp, context = context)
  return result
