from rest_framework.permissions import BasePermission

class IsGestor(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.escolha == 'G':
            return True
        return False

class IsProfessor(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.escolha == 'P':
            return True
        return False