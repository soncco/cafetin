from django.db import models
from django.contrib.auth.models import User
from decimal import *

# Lugares.
class Local(models.Model):
  nombre = models.CharField(max_length = 255)

  class Meta:
    verbose_name_plural = "Locales"

  def __unicode__(self):
    return self.nombre
 

class Habitacion(models.Model):
  nombre = models.CharField(max_length = 255)
  pertenece_a = models.ForeignKey(Local, null = False)

  class Meta:
    verbose_name_plural = "Habitaciones"

  def __unicode__(self):
    return "%s: %s"%(self.pertenece_a, self.nombre)

class Punto(models.Model):
  nombre = models.CharField(max_length = 100)
  pertenece_a  = models.ForeignKey(Local)

  def __unicode__(self):
    return "%s: %s"%(self.pertenece_a, self.nombre)

class Cliente(models.Model):
  nombres = models.CharField(max_length = 255)
  apellidos = models.CharField(max_length = 255)
  hospedado_en = models.ForeignKey(Habitacion)
  activo = models.BooleanField(default = True)
  ingreso = models.DateField()
  salida = models.DateField(null = True, blank = True)

  def __unicode__(self):
    completo = "%s %s"%(self.nombres, self.apellidos)
    return completo

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

class Producto(models.Model):
  nombre = models.CharField(max_length = 255)
  tipo = models.ForeignKey(Tipo)

  def __unicode__(self):
    return self.nombre

class PlatoManager(models.Manager):
  def get_by_natural_key(self, nombre, precio):
    return self.get(nombre = nombre, precio = precio)

class Plato(models.Model):
  objects = PlatoManager()

  nombre = models.CharField(max_length = 255)
  tipo = models.ForeignKey(Tipo)
  precio = models.DecimalField(max_digits = 5, decimal_places = 2, default = Decimal('0.00'))
  de_venta_en = models.ManyToManyField(Punto)
  foto = models.FileField(upload_to = 'fotos', default = 'default.jpg')

  def __unicode__(self):
    return self.nombre

#Pedidos Stock
class StockProducto(models.Model):
  hecho_por = models.ForeignKey(User)
  punto_origen = models.IntegerField()
  punto_destino = models.ForeignKey(Punto)
  producto  = models.ForeignKey(Producto)
  cantidad = models.IntegerField()
  detalle = models.CharField(max_length = 255)
  fecha = models.DateTimeField()

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
  notas = models.TextField()

class PedidoDetalle(models.Model):
  pertenece_al_pedido = models.ForeignKey(Pedido)
  plato = models.ForeignKey(Plato)
  cantidad = models.IntegerField()
