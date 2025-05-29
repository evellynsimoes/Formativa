from django.urls import path
from .views import *

urlpatterns = [
    path('token/', view=LoginView.as_view()),
    path('professores/', view=ProfessoresListCreateAPIView.as_view()),
    path('professores/<int:pk>', view=ProfessoresRetrieveUpdateDestroyAPIView.as_view()),
    path('disciplina/', view=DisciplinasListCreateAPIView.as_view()),
    path('disciplina/<int:pk>', view=DisciplinasRetrieveUpdateDestroyAPIView.as_view()),
    path('reservaAmbiente/', view=ReservaAmbienteListCreateAPIView.as_view()),
    path('reservaAmbiente/<int:pk>/', view=ReservaAmbienteUpdateDestroyAPIView.as_view()),
    path('professorReservas/', view=ProfessorReservaListAPIView.as_view()),
    path('professoresDisciplinas/', view=ProfessorDisciplinaListAPIView.as_view()),
    path('sala/', view=SalaListCreateAPIView.as_view()),
    path('sala/<int:pk>/', view=SalaRetrieveUpdateDestroyAPIView.as_view())
]