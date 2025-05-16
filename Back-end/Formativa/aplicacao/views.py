from django.shortcuts import render
from .models import *
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from .serializers import UsuarioSerializer, DisciplinaSerializer, SalaSerializer,ReservaAmbienteSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .permissions import IsGestor, IsProfessor
from rest_framework.permissions import IsAuthenticated


class LoginView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

class ProfessoresListCreateAPIView(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsGestor()]

class ProfessoresRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    lookup_field = 'pk'

class DisciplinasListCreateAPIView(ListCreateAPIView):
    queryset = Disciplinas.objects.all()
    serializer_class = DisciplinaSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsGestor()]

class DisciplinasRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Disciplinas.objects.all()
    serializer_class = DisciplinaSerializer
    lookup_field = 'pk'

class SalaListCreateAPIView(ListCreateAPIView):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsGestor()]

class SalaRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    lookup_field = 'pk'

class ReservaAmbienteListCreateAPIView(ListCreateAPIView):
    queryset = ReservaAmbiente.objects.all()
    serializer_class = ReservaAmbienteSerializer
    lookup_field = 'pk'
   
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsGestor()]

class ReservaAmbienteUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = ReservaAmbiente.objects.all()
    serializer_class = ReservaAmbienteSerializer
    lookup_field = 'pk'

class ProfessorReservaListAPIView(ListAPIView):
    serializer_class = ReservaAmbienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.escolha == 'P':
            queryset = ReservaAmbiente.objects.filter(usuario = self.request.user)
        else:
            queryset = ReservaAmbiente.objects.all()
        return queryset
    
class ProfessorDisciplinaListAPIView(ListAPIView):
    serializer_class = DisciplinaSerializer

    def get_queryset(self):
        if self.request.user.escolha == 'P':
            queryset = Disciplinas.objects.filter(usuario = self.request.user)
        else:
            queryset = Disciplinas.objects.all()
        return queryset