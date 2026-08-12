from django.db import models
from django.contrib.auth.models import User

# 1. PERFILES DE USUARIO (Para manejar los Roles)
class PerfilUsuario(models.Model):
    ROLES = (
        ('ADMINISTRADOR', 'Administrador / Secretaría'),
        ('PROFESOR', 'Profesor / Docente'),
        ('DIRECTOR', 'Director / Rector'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    rol = models.CharField(max_length=20, choices=ROLES)

    def __str__(self):
        return f"{self.user.username} - {self.get_rol_display()}"


# 2. TABLA DE ESTUDIANTES
class Estudiante(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    documento_identidad = models.CharField(max_length=20, unique=True)
    grado = models.CharField(max_length=20) # Ej: "Grado 6A", "Grado 11"

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.grado}"


# 3. TABLA DE CALIFICACIONES (GESTIÓN DE NOTAS AVANZADA)
class Nota(models.Model):
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
    materia = models.CharField(max_length=50) # Ej: Matemáticas, Ciencias
    valor_nota = models.DecimalField(max_digits=3, decimal_places=2) # Para notas colombianas como 4.50 o 5.00
    fecha_registro = models.DateTimeField(auto_now_add=True)
    profesor_que_registro = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.estudiante.nombre} - {self.materia}: {self.valor_nota}"


# 4. TABLA DE PAGOS (EFECTIVO O TRANSFERENCIA)
class Pago(models.Model):
    METODOS = [
        ('EFECTIVO', 'Efectivo'),
        ('TRANSFERENCIA', 'Transferencia Bancaria'),
    ]
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2) # Ej: 150000.00 COP
    metodo_pago = models.CharField(max_length=20, choices=METODOS)
    referencia_comprobante = models.CharField(max_length=100, blank=True, null=True) # Para el número de transferencia
    fecha_pago = models.DateTimeField(auto_now_add=True)
    registrado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True) # El Administrador/Secretaria que lo recibe

    def __str__(self):
        return f"Pago de {self.estudiante.nombre} - ${self.monto} COP ({self.metodo_pago})"


# 5. BITÁCORA DE MODIFICACIONES (Para el sistema de auditoría ante errores)
class HistorialModificacion(models.Model):
    TIPOS = [
        ('NOTA', 'Modificación de Nota'),
        ('PAGO', 'Modificación de Pago'),
    ]
    tipo = models.CharField(max_length=10, choices=TIPOS)
    usuario_que_modifico = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    fecha_modificacion = models.DateTimeField(auto_now_add=True)
    valor_anterior = models.CharField(max_length=255) # Guarda lo que había antes (ej: la nota vieja o el monto viejo)
    valor_nuevo = models.CharField(max_length=255)    # Guarda el cambio corregido
    justificacion = models.TextField() # Por qué se equivocó el Docente o la secretaria

    def __str__(self):
        return f"Cambio {self.tipo} por {self.usuario_que_modifico.username} el {self.fecha_modificacion}"