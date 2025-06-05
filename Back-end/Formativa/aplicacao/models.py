from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator,MinValueValidator
from django.core.exceptions import ValidationError
from datetime import date
from django.utils import timezone


class Usuario(AbstractUser):
    escolha_profissao = (
        ('P', 'Professores'),
        ('G', 'Gestores')
    )
    escolha = models.CharField(max_length=20, choices=escolha_profissao)
    NI = models.IntegerField(null=True, blank=True, unique=True)
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
    
    def clean(self):
        super().clean()

        # Validando a data de nascimento que tem que ser maior de 18 anos
        if self.data_nascimento:
            hoje = date.today()
            idade = hoje.year - self.data_nascimento.year - (
                (hoje.month, hoje.day) < (self.data_nascimento.month, self.data_nascimento.day)
            )
            if idade < 18:
                raise ValidationError({'data_nascimento': 'O professor deve ser maior de 18 anos'})
            
        #Validando a data de contratação que tem que ser antes do dia atual
        if self.data_contratacao:
            if self.data_contratacao >= date.today():
                raise ValidationError({'data_contratacao':'A data de contratação deve ser antes de hoje'})



class Disciplinas(models.Model):
    nome = models.CharField(max_length=50)
    curso = models.CharField(max_length=50)
    carga_horaria = models.IntegerField()
    descricao = models.TextField()
    professor = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nome
    
class Sala(models.Model):
    nome = models.CharField(max_length=20,unique=True)
    capacidade = models.IntegerField(validators=[MinValueValidator(1)])

    def clean(self):
    
        if Sala.objects.filter(nome__iexact=self.nome).exclude(pk=self.pk).exists():
            raise ValidationError({'nome': 'Uma sala com este nome já existe.'})
        
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

    def clean(self):
        super().clean()

        agora = timezone.now()

        if self.data_inicio:
            if self.data_inicio < agora:
                raise ValidationError({'data_inicio': 'A data e hora de início não podem ser anteriores ao momento atual.'})

        if self.data_termino:
            if self.data_termino < agora:
                raise ValidationError({'data_termino': 'A data e hora de término não podem ser anteriores ao momento atual.'})

        if self.data_inicio and self.data_termino:
            if self.data_termino <= self.data_inicio:
                raise ValidationError({'data_termino': 'A data e hora de término devem ser maiores que a data e hora de início.'})


    