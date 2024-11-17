# core/views.py

from rest_framework import viewsets
from .models import React
from .serializer import ReactSerializer

class ReactViewSet(viewsets.ModelViewSet):
    queryset = React.objects.all()
    serializer_class = ReactSerializer