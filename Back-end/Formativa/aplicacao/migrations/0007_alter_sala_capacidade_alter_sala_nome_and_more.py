# Generated by Django 5.1.7 on 2025-06-05 14:21

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aplicacao', '0006_alter_reservaambiente_data_inicio_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sala',
            name='capacidade',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='sala',
            name='nome',
            field=models.CharField(max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='NI',
            field=models.IntegerField(blank=True, null=True, unique=True),
        ),
    ]
