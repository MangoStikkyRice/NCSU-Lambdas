from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from django.db.models import Q
from core.models import Brother, Position, Country
from core.serializer import BrotherSerializer, PositionSerializer, CountrySerializer

class BrotherAPIViewSet(viewsets.ModelViewSet):
    queryset = Brother.objects.all()
    serializer_class = BrotherSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Brother.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by major
        major_filter = self.request.query_params.get('major', None)
        if major_filter:
            queryset = queryset.filter(major__icontains=major_filter)
        
        # Filter by hobby
        hobby_filter = self.request.query_params.get('hobby', None)
        if hobby_filter:
            queryset = queryset.filter(hobbies__contains=[hobby_filter])
        
        # Search by name or line name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(line_name__icontains=search)
            )
        
        return queryset.order_by('name')
    
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
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get brother statistics"""
        total_brothers = Brother.objects.count()
        active_brothers = Brother.objects.filter(status='Active').count()
        alumni_brothers = Brother.objects.filter(status='Alumni').count()
        
        # Get unique majors
        majors = Brother.objects.values_list('major', flat=True).distinct()
        major_count = len([m for m in majors if m])
        
        # Get unique hobbies
        all_hobbies = []
        for brother in Brother.objects.all():
            if brother.hobbies:
                all_hobbies.extend(brother.hobbies)
        unique_hobbies = list(set(all_hobbies))
        
        data = {
            'total_brothers': total_brothers,
            'active_brothers': active_brothers,
            'alumni_brothers': alumni_brothers,
            'unique_majors': major_count,
            'unique_hobbies': len(unique_hobbies),
            'hobbies_list': unique_hobbies
        }
        
        return Response(data)

class PositionAPIViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Position.objects.all()
        
        # Filter by title
        title_filter = self.request.query_params.get('title', None)
        if title_filter:
            queryset = queryset.filter(title__icontains=title_filter)
        
        # Filter by year
        year_filter = self.request.query_params.get('year', None)
        if year_filter:
            queryset = queryset.filter(
                Q(start_year=year_filter) | Q(end_year=year_filter)
            )
        
        return queryset.order_by('title')

class CountryAPIViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Country.objects.all()
        
        # Search by name or code
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(code__icontains=search)
            )
        
        return queryset.order_by('name') 