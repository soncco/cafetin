from django.template import RequestContext
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django_xhtml2pdf.utils import generate_pdf

from ..models import Pedido, Consumo, Comanda
from ..utils import total_pedido

@login_required
def pedido_imprimir_comanda(request, id):
  
  pedido = Pedido.objects.get(id = id)

  comanda = Comanda.objects.get(pedido = pedido)
  
  resp = HttpResponse(content_type='application/pdf')
  context = {'comanda': comanda}
  result = generate_pdf('pdf/comanda.html', file_object = resp, context = context)
  return result

@login_required
def pedido_imprimir_consumo(request, id):
  try:
    pedido = Pedido.objects.get(id = id)
  except Pedido.DoesNotExist:
    raise Http404

  for detalle in pedido.pedidodetalle_set.all():
    cantidad = detalle.cantidad
    precio = float(detalle.plato.precioplato_set.get(anio = 2013).precio)
    detalle.sub = cantidad * precio

  resp = HttpResponse(content_type='application/pdf')
  context = {'pedido': pedido, 'total': total_pedido(pedido)}
  result = generate_pdf('pdf/consumo.html', file_object = resp, context = context)
  return result