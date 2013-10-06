# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import User
from decimal import *

# Lugares.
class Local(models.Model):
  nombre = models.CharField(max_length = 20)
  direccion = models.TextField(max_length = 100)

  class Meta:
    verbose_name_plural = "Locales"

  def __unicode__(self):
    return self.nombre
 
class Habitacion(models.Model):
  nombre = models.CharField(max_length = 50)
  pertenece_a = models.ForeignKey(Local, null = False)

  class Meta:
    verbose_name_plural = "Habitaciones"

  def __unicode__(self):
    return self.nombre

class Punto(models.Model):
  nombre = models.CharField(max_length = 20)
  pertenece_a  = models.ForeignKey(Local)

  def __unicode__(self):
    return self.nombre

class Cliente(models.Model):
  nombres = models.CharField(max_length = 100)
  apellidos = models.CharField(max_length = 100)
  hospedado_en = models.ForeignKey(Habitacion)
  activo = models.BooleanField(default = True)
  ingreso = models.DateField()
  salida = models.DateField(null = True, blank = True)

  def __unicode__(self):
    completo = "%s %s"%(self.nombres, self.apellidos)
    return completo

  def my_habitacion(self):
    return "%s: %s" % (self.hospedado_en.pertenece_a, self.hospedado_en)
  my_habitacion.short_description = 'Donde está hospedado'

  habitacion = property(my_habitacion)


# Cocina.
class Tipo(models.Model):
  RECIBOS = (
    ('C', 'Comanda'),
    ('D', 'Detalle de Consumo'),
  )
  nombre = models.CharField(max_length = 100)
  recibo = models.CharField(max_length = 1, choices = RECIBOS, default = 'D')

  def __unicode__(self):
    return self.nombre

class PlatoManager(models.Manager):
  def get_by_natural_key(self, nombre, precio):
    return self.get(nombre = nombre, precio = precio)

class Plato(models.Model):
  objects = PlatoManager()

  nombre = models.CharField(max_length = 255)
  tipo = models.ForeignKey(Tipo)
  de_venta_en = models.ManyToManyField(Punto)
  foto = models.FileField(upload_to = 'fotos', default = 'default.jpg')

  def __unicode__(self):
    return self.nombre

class PrecioPlato(models.Model):
  precio_de = models.ForeignKey(Plato)
  precio = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))
  anio = models.IntegerField(max_length = 4, verbose_name = 'Año')

  class Meta:
    verbose_name = "Precio"
    verbose_name_plural = "Precios"

  def __unicode__(self):
    return self.precio

# Pedidos
class Pedido(models.Model):
  ESTADOS = (
    ('R', 'Recibido'),
    ('A', 'Atendido'),
    ('I', 'Impreso'),
    ('P', 'Pagado'),
  )
  hecho_por = models.ForeignKey(User)
  para = models.ForeignKey(Cliente)
  cuando = models.DateTimeField()
  estado = models.CharField(max_length = 1, choices = ESTADOS, default = 'R')
  punto = models.ForeignKey(Punto)
  notas = models.TextField()

class PedidoDetalle(models.Model):
  pertenece_al_pedido = models.ForeignKey(Pedido)
  plato = models.ForeignKey(Plato)
  cantidad = models.IntegerField()

class Bitacora(models.Model):
  hecho_por = models.ForeignKey(User)
  local = models.ForeignKey(Local)
  cuando = models.DateTimeField()
  mensaje = models.TextField()

# Documentos
class Comanda(models.Model):
  numero = models.IntegerField()
  local = models.ForeignKey(Local)
  pedido = models.ForeignKey(Pedido)
  total = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))

  def save(self):
    if self.numero == None:
      total = Comanda.objects.filter(local = self.local).count()
      self.numero = total + 1
    super(Comanda, self).save()

class ComandaDetalle(models.Model):
  pertenece_a_comanda = models.ForeignKey(Comanda)
  plato = models.ForeignKey(Plato)
  cantidad = models.IntegerField()
  unitario = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))
  subtotal = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))

class Consumo(models.Model):
  numero = models.IntegerField()
  local = models.ForeignKey(Local)
  pedido = models.ForeignKey(Pedido)
  total = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))

class ConsumoDetalle(models.Model):
  pertenece_a_consumo = models.ForeignKey(Consumo)
  plato = models.ForeignKey(Plato)
  cantidad = models.IntegerField()
  unitario = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))
  subtotal = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))

class Boleta(models.Model):
  numero = models.IntegerField()
  local = models.ForeignKey(Local)
  pedido = models.ForeignKey(Pedido)
  total = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))

class BoletaDetalle(models.Model):
  pertenece_a_boleta = models.ForeignKey(Boleta)
  plato = models.ForeignKey(Plato)
  cantidad = models.IntegerField()
  unitario = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))
  subtotal = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))

class Factura(models.Model):
  numero = models.IntegerField()
  local = models.ForeignKey(Local)
  pedido = models.ForeignKey(Pedido)
  total = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))

class FacturaDetalle(models.Model):
  pertenece_a_factura = models.ForeignKey(Factura)
  plato = models.ForeignKey(Plato)
  cantidad = models.IntegerField()
  unitario = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))
  subtotal = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))