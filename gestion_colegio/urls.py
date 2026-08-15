from django.urls import path
from . import views

urlpatterns = [
    path('', views.vista_login, name='login'),
    path('logout/', views.vista_logout, name='logout'),
    path('inicio/', views.vista_inicio, name='panel_inicio'),
    path('director/', views.vista_director_dashboard, name='director_inicio'),
    path('director/reportes/pagos/', views.vista_director_ultimos_pagos, name='director_ultimos_pagos'),
    path('director/reportes/calificaciones/', views.vista_director_ultimas_notas, name='director_ultimas_notas'),
    path('director/reportes/auditoria/', views.vista_director_auditoria, name='director_auditoria'),
    path('admin-panel/', views.vista_admin_dashboard, name='admin_inicio'),
    path('admin-panel/matricular-estudiante/', views.vista_admin_matricular_estudiante, name='admin_matricular_estudiante'),
    path('admin-panel/estudiantes/', views.vista_admin_lista_estudiantes, name='admin_lista_estudiantes'),
    path('admin-panel/pagos/registro/', views.vista_admin_registrar_pago, name='admin_registrar_pago'),
    path('admin-panel/pagos/', views.vista_admin_ultimos_pagos, name='admin_ultimos_pagos'),
    path('admin-panel/calificaciones/', views.vista_admin_ultimas_notas, name='admin_ultimas_notas'),
    path('admin-panel/auditoria/', views.vista_admin_auditoria, name='admin_auditoria'),
    path('docente/', views.vista_dashboard_docente, name='dashboard_docente'),
    path('docente/registrar-nota/', views.vista_docente_registrar_nota, name='docente_registrar_nota'),
    path('docente/historial-notas/', views.vista_docente_historial_notas, name='docente_historial_notas'),
    path('registrar-pago/', views.vista_registrar_pago, name='registrar_pago'),
    path('registrar-nota/', views.vista_registrar_nota, name='registrar_nota'),
    path('reportes/', views.vista_reportes_director, name='reportes_director'),
    path('editar-nota/<int:nota_id>/', views.vista_editar_nota, name='editar_nota'),
    path('asistencia/', views.vista_asistencia_por_grado, name='asistencia_grado'),
    path('estudiantes/', views.vista_gestion_estudiantes, name='gestion_estudiantes'),
    path('estudiantes/<int:estudiante_id>/paz-y-salvo/', views.vista_certificado_paz_y_salvo, name='certificado_paz_y_salvo'),
]