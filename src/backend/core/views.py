# core/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Brother, Position, Country
from .serializer import BrotherSerializer, PositionSerializer, CountrySerializer

class BrotherViewSet(viewsets.ModelViewSet):
    queryset = Brother.objects.all()
    serializer_class = BrotherSerializer
    
    @action(detail=True, methods=['get'])
    def positions(self, request, pk=None):
        """Get all positions for a specific brother"""
        brother = get_object_or_404(Brother, pk=pk)
        positions = brother.positions.all()
        serializer = PositionSerializer(positions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def family(self, request, pk=None):
        """Get family tree information for a brother"""
        brother = get_object_or_404(Brother, pk=pk)
        data = {
            'brother': BrotherSerializer(brother).data,
            'big': BrotherSerializer(brother.big).data if brother.big else None,
            'littles': BrotherSerializer(brother.littles, many=True).data
        }
        return Response(data)

class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer