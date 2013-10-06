from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from core.models import Local, Habitacion, Punto, Cliente, Tipo, Plato, PrecioPlato, Pedido

class HabitacionAdmin(admin.ModelAdmin):
  list_display = ('nombre', 'pertenece_a',)
  list_filter = ('pertenece_a',)

class PuntoAdmin(admin.ModelAdmin):
  list_display = ('nombre', 'pertenece_a',)
  list_filter = ('pertenece_a',)

class ClienteAdmin(admin.ModelAdmin):
  list_display = ('__unicode__', 'habitacion', 'ingreso', 'salida', 'activo')
  list_filter = ('activo', 'ingreso', 'salida',)
  search_fields = ['nombres', 'apellidos']

class TipoAdmin(admin.ModelAdmin):
  list_display = ('nombre', 'recibo',)

class PrecioInline(admin.TabularInline):
  model = PrecioPlato

class PlatoAdmin(admin.ModelAdmin):
  list_display = ('nombre', 'tipo',)
  inlines  = [PrecioInline, ]
  list_filter = ('tipo',)
  filter_vertical = ('de_venta_en',)
  search_fields = ['nombre',]


admin.site.register(Local)
admin.site.register(Habitacion, HabitacionAdmin)
admin.site.register(Punto, PuntoAdmin)
admin.site.register(Cliente, ClienteAdmin)
admin.site.register(Tipo, TipoAdmin)
admin.site.register(Plato, PlatoAdmin)
admin.site.register(Pedido)

class MyUserAdmin(UserAdmin):
  def completo(self, obj):
    return "%s %s" % (obj.first_name, obj.last_name)

  def grupos(self, obj):
    gs = ""
    for grupo in obj.groups.all():
      gs += grupo.name + " "

    return gs

  list_display = ('username', 'completo', 'grupos',)
  list_display_links = ('username',)

admin.site.unregister(User)
admin.site.register(User, MyUserAdmin)