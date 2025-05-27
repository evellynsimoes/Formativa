from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['NI', 'data_contratacao', 'data_nascimento', 'email', 'escolha', 'id', 'nome','password', 'telefone', 'username']



    def create(self, validated_data):
        user = Usuario.objects.create_user(
            password=validated_data['password'],
            username=validated_data['username'],
            escolha=validated_data['escolha'],
            NI=validated_data['NI'],
            nome=validated_data['nome'],
            telefone=validated_data['telefone'],
            data_nascimento=validated_data['data_nascimento'],
            data_contratacao=validated_data['data_contratacao']
        )
        return user 
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)

        instance.save()
        return instance
    

class DisciplinaSerializer(serializers.ModelSerializer):
    professor_nome = serializers.CharField(source='professor.nome', read_only=True)

    class Meta:
        model = Disciplinas
        fields = '__all__' 


class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = '__all__'

class ReservaAmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaAmbiente
        fields = '__all__'