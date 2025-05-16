from django.contrib import admin
from .models import Usuario
from django.contrib.auth.admin import UserAdmin
from .models import Sala

class UsuarioAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Campos novos', {
            'fields': ('escolha', 'NI', 'nome', 'telefone','data_nascimento', 'data_contratacao')
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Campos Novos', {
            'fields':('escolha', 'NI', 'nome', 'telefone','data_nascimento', 'data_contratacao')
        }),
    )

admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Sala)