from django_xhtml2pdf.utils import generate_pdf
from django.http import HttpResponse
from cafetin.models import Cliente

def theviewcito(response):
    clientes = Cliente.objects.filter()
    resp = HttpResponse(content_type='application/pdf')
    context = {'test': clientes}
    result = generate_pdf('plato.html', file_object = resp, context = context)
    return result