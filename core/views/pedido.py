# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib import messages
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
import json, datetime

from ..models import Cliente, Plato, Pedido, PedidoDetalle, Punto, Local, Bitacora, Habitacion

from ..utils import crear_comanda, crear_consumo

@login_required
def pedido(request):
  return render_to_response('pedido.html', context_instance = RequestContext(request))

@login_required
def pedido_lista_mozo(request):

  today_min = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
  today_max = datetime.datetime.combine(datetime.date.today(), datetime.time.max)
  local = request.session['local']

  pedidos = Pedido.objects.filter(
    hecho_por = request.user,
    cuando__range = (today_min, today_max),
    punto__pertenece_a = local
  ).order_by('-cuando')

  for pedido in pedidos:
    comanda = 'false'
    consumo = 'false'
    for detalle in pedido.pedidodetalle_set.all():
      if detalle.plato.tipo.recibo == 'C':
        comanda = 'true'
      if detalle.plato.tipo.recibo == 'D':
        consumo = 'true'
    pedido.comanda = comanda
    pedido.consumo = consumo

  context = {'pedidos': pedidos}
  return render_to_response('pedido-lista-mozo.html', context, context_instance = RequestContext(request))

@login_required
def pedido_lista_cocina(request):

  today_min = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
  today_max = datetime.datetime.combine(datetime.date.today(), datetime.time.max)
  local = request.session['local']

  pedidos = Pedido.objects.filter(
    cuando__range = (today_min, today_max),
    punto__pertenece_a = local
  ).order_by('-cuando')
  puntos = Punto.objects.filter(pertenece_a = request.session['local'])

  context = {'pedidos': pedidos, 'puntos': puntos}
  return render_to_response('pedido-lista-cocina.html', context, context_instance = RequestContext(request))

@login_required
def pedido_lista_recepcion(request):
  
  local = request.session['local']
  habitaciones = Habitacion.objects.filter(pertenece_a = local)
  context = {'habitaciones': habitaciones}
  return render_to_response('pedido-lista-recepcion.html', context, context_instance = RequestContext(request))

from ..utils import pedido_json
@login_required
def pedido_crear(request):

  if request.method == "POST":
    post = request.POST.copy()

    para = Cliente.objects.get(pk = post.get('para'))
    cantidad = post.getlist('cantidad[]')
    platos = post.getlist('platos[]')
    observaciones = post.get('observaciones')
    hecho_por = request.user
    local = request.session['local']

    pedidos = []

    puntos = []

    for (key, plato) in enumerate(platos):
      pl = Plato.objects.get(id = plato)
      punto = pl.de_venta_en.get(pertenece_a = local)
      puntos.append(punto)

    # Removiendo duplicados.
    puntos = list(set(puntos))

    # Creando pedidos para cada punto.
    for punto in puntos:
      try:
        p = Pedido(hecho_por = hecho_por, para = para, cuando = datetime.datetime.now(), notas = observaciones, punto = punto)
        p.save()
      except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        context = {'status': 'error'}
        return HttpResponse(json.dumps(context), content_type="application/json")

      # Añade pedidos según el plato
      for (key, plato) in enumerate(platos):
        pl = Plato.objects.get(id = plato)
        if punto in list(pl.de_venta_en.all()):
          detalle = PedidoDetalle(pertenece_al_pedido = p, plato = pl, cantidad = cantidad[key])
          detalle.save()

      pedidos.append(pedido_json(p))

    context = {'status': 'ok', 'pedidos': pedidos}
    return HttpResponse(json.dumps(context), content_type="application/json")

  return HttpResponse(json)

@login_required  
def pedido_quitar(request):
  if request.method == "POST":
    pedido = Pedido.objects.get(id = request.POST.get('id'))
    punto = pedido.punto.id
    why = request.POST.get('why')
    mensaje = u"He eliminado el pedido para %s que se hizo el dia %s porque %s" % (pedido.para, pedido.cuando, why)

    try:
      if pedido.estado == 'R':
        pedido.delete()
        bitacora = Bitacora(mensaje = mensaje, hecho_por = request.user, local = request.session['local'], cuando = datetime.datetime.now())
        bitacora.save()
    except Exception as e:
      print '%s (%s)' % (e.message, type(e))
      context = {'status': 'error'}
      return HttpResponse(json.dumps(context), content_type="application/json")

    context = {'status': 'ok', 'id': request.POST.get('id'), 'punto': punto}
    return HttpResponse(json.dumps(context), content_type="application/json")

@login_required
def pedido_atender(request):
  if request.method == "POST":
    pedido = Pedido.objects.get(id = request.POST.get('id'))
    punto = pedido.punto.id

    try:
      if pedido.estado == 'R':
        pedido.estado = 'A'
        pedido.save()
    except Exception as e:
      print '%s (%s)' % (e.message, type(e))
      context = {'status': 'error'}
      return HttpResponse(json.dumps(context), content_type="application/json")

    context = {'status': 'ok', 'id': request.POST.get('id'), 'punto': punto}
    return HttpResponse(json.dumps(context), content_type="application/json")

@login_required
def pedido_imprimir(request):
  if request.method == "POST":
    pedido = Pedido.objects.get(id = request.POST.get('id'))
    what = request.POST.get('what')
    thedoc = request.POST.get('thedoc')
    number = request.POST.get('number')
    punto = pedido.punto.id

    if thedoc == '0':
      print "what %s  thedoc %s"  %(what, thedoc)
      if what == 'comanda':
        crear_comanda(request, pedido)
      else:
        crear_consumo(request, pedido, number)

    try:
      if pedido.estado == 'A':
        pedido.estado = 'I'
        pedido.save()
    except Exception as e:
      print '%s (%s)' % (e.message, type(e))
      context = {'status': 'error'}
      return HttpResponse(json.dumps(context), content_type="application/json")

    context = {'status': 'ok', 'id': request.POST.get('id'), 'punto': punto, 'what': what}
    return HttpResponse(json.dumps(context), content_type="application/json")
