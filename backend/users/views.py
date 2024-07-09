from django.shortcuts import render

# Create your views here.
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate

class LoginView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        # Your authentication logic here
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user:
            token, created = Token.objects.get_or_create(user=user)
            # add the token as a cookie to the response to never expire
            response = Response({'token': token.key,'me': get_user_info_dict(user)})
            response.set_cookie('auth_token', token.key, max_age=365*24*60*60*50, secure=False, httponly=False, samesite='Lax')
            return response
        else:
            return Response({'error': 'פרטים לא נכונים'}, status=401)

class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        # Your logout logic here
        if request.user and request.user.is_authenticated:
            response =  Response({'success': 'Successfully logged out'})
            response.delete_cookie('auth_token')
            return response
        else:
            return Response({'error': 'Invalid credentials'}, status=401)

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    return Response(get_user_info_dict(request.user))


def get_user_info_dict(user=None):
    if user == None or user.is_anonymous:
        return {'username': None, 'business': None, 'status': None, 'description': None, 'is_superuser': False}
    return {'username': user.username, 'business': user.business.name if user.business else None, 'status': user.status, 'description': user.description, 'is_superuser': user.is_superuser}