# Generated by Django 5.1.7 on 2025-05-15 12:00

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aplicacao', '0004_alter_disciplinas_curso_alter_disciplinas_nome_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservaambiente',
            name='usuario',
            field=models.ForeignKey(limit_choices_to={'escolha': 'P'}, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
