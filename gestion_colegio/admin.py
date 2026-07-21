from django.contrib import admin
from .models import PerfilUsuario, Estudiante, Nota, Pago, HistorialModificacion

# Registramos los modelos para que aparezcan en el panel administrador
admin.site.register(PerfilUsuario)
admin.site.register(Estudiante)
admin.site.register(Nota)
admin.site.register(Pago)
admin.site.register(HistorialModificacion)