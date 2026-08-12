from django.urls import path
from . import views

urlpatterns = [
    path('', views.vista_login, name='login'),
    path('logout/', views.vista_logout, name='logout'),
    path('inicio/', views.vista_inicio, name='panel_inicio'),
    path('registrar-pago/', views.vista_registrar_pago, name='registrar_pago'),
    path('registrar-nota/', views.vista_registrar_nota, name='registrar_nota'),
    path('reportes/', views.vista_reportes_director, name='reportes_director'),
    path('editar-nota/<int:nota_id>/', views.vista_editar_nota, name='editar_nota'),
    path('estudiantes/', views.vista_gestion_estudiantes, name='gestion_estudiantes'),
    path('estudiantes/<int:estudiante_id>/paz-y-salvo/', views.vista_certificado_paz_y_salvo, name='certificado_paz_y_salvo'),
]