from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class Usuario(AbstractUser):
    escolha_profissao = (
        ('P', 'Professores'),
        ('G', 'Gestores')
    )
    escolha = models.CharField(max_length=20, choices=escolha_profissao)
    NI = models.IntegerField(null=True, blank=True)
    nome = models.CharField(max_length=15)

    validador_telefone = RegexValidator(
        regex='^\(\d{2}\)\d{5}[-]\d{4}$',
        message='O telefone deve ser no formarto (xx)xxxxx-xxxx'
    )
    telefone = models.CharField(max_length=20, validators=[validador_telefone], unique=True)
    data_nascimento = models.DateField(null=True, blank=True)
    data_contratacao = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.nome


class Disciplinas(models.Model):
    nome = models.CharField(max_length=50)
    curso = models.CharField(max_length=50)
    carga_horaria = models.IntegerField()
    descricao = models.TextField()
    professor = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nome
    
class Sala(models.Model):
    nome = models.CharField(max_length=20)
    capacidade = models.IntegerField()
    def __str__(self):
        return self.nome

class ReservaAmbiente(models.Model):
    data_inicio = models.DateTimeField(null=True, blank=True)
    data_termino = models.DateTimeField(null=True, blank=True)
    escolha_periodo = (
        ('M', 'Manhã'),
        ('T', 'Tarde'),
        ('N', 'Noite')
    )
    escolha = models.CharField(max_length=20, choices=escolha_periodo)
    sala_reservada = models.ForeignKey(Sala, on_delete=models.CASCADE)
    disciplina = models.ForeignKey(Disciplinas, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={"escolha": "P"})

    