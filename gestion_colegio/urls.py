from django.urls import path
from . import views

urlpatterns = [
    path('', views.vista_login, name='login'),
    path('inicio/', views.vista_inicio, name='panel_inicio'),
    path('registrar-pago/', views.vista_registrar_pago, name='registrar_pago'),
    path('registrar-nota/', views.vista_registrar_nota, name='registrar_nota'),
    path('reportes/', views.vista_reportes_director, name='reportes_director'),
    path('editar-nota/<int:nota_id>/', views.vista_editar_nota, name='editar_nota'),
    path('estudiantes/', views.vista_gestion_estudiantes, name='gestion_estudiantes'),
]