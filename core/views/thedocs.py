from django.template import RequestContext
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django_xhtml2pdf.utils import generate_pdf
from django.views.decorators.csrf import csrf_exempt

import json

from ..models import Pedido, Consumo, Comanda

@login_required
@csrf_exempt
def tiene_consumo(request, id):
  context = 1
  pedido = Pedido.objects.get(id = id)
  try:
    consumo = Consumo.objects.get(pedido = pedido)
  except Consumo.DoesNotExist:
    context = 0

  return HttpResponse(json.dumps(context), mimetype = "application/json")

@login_required
@csrf_exempt
def tiene_comanda(request, id):
  context = 1
  pedido = Pedido.objects.get(id = id)
  try:
    comanda = Comanda.objects.get(pedido = pedido)
  except Comanda.DoesNotExist:
    context = 0

  return HttpResponse(json.dumps(context), mimetype = "application/json")
