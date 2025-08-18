# core/serializers.py

from rest_framework import serializers
from .models import Brother, Country, Position

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['code', 'name']

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['id', 'title', 'description', 'start_month', 'start_year', 'end_month', 'end_year']

class BrotherSerializer(serializers.ModelSerializer):
    # Related fields
    nationalities = CountrySerializer(many=True, read_only=True)
    positions = PositionSerializer(many=True, read_only=True)
    
    # Image URL fields
    image_url = serializers.SerializerMethodField()
    casual_image1_url = serializers.SerializerMethodField()
    casual_image2_url = serializers.SerializerMethodField()
    casual_image3_url = serializers.SerializerMethodField()
    
    # Computed fields
    big = serializers.SerializerMethodField()
    littles = serializers.SerializerMethodField()

    class Meta:
        model = Brother
        fields = [
            # Basic Information
            'id', 'name', 'line_name', 'status', 'class_field',
            
            # Family Tree
            'big_id', 'little_ids', 'big', 'littles',
            
            # Academic Information
            'major',
            
            # Personal Information
            'hobbies', 'nationalities',
            
            # Images
            'image', 'casual_image1', 'casual_image2', 'casual_image3',
            'image_url', 'casual_image1_url', 'casual_image2_url', 'casual_image3_url',
            
            # Timeline Information
            'crossing_month', 'crossing_year', 'graduating_month', 'graduating_year',
            
            # Positions
            'positions'
        ]

    def get_big(self, obj):
        """Get big brother information"""
        if obj.big_id:
            big_brother = Brother.objects.filter(id=obj.big_id).first()
            if big_brother:
                return {
                    'id': big_brother.id,
                    'name': big_brother.name,
                    'line_name': big_brother.line_name
                }
        return None

    def get_littles(self, obj):
        """Get little brothers information"""
        if obj.little_ids:
            little_brothers = Brother.objects.filter(id__in=obj.little_ids)
            return [
                {
                    'id': little.id,
                    'name': little.name,
                    'line_name': little.line_name
                }
                for little in little_brothers
            ]
        return []

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_casual_image1_url(self, obj):
        request = self.context.get('request')
        if obj.casual_image1 and request:
            return request.build_absolute_uri(obj.casual_image1.url)
        return None

    def get_casual_image2_url(self, obj):
        request = self.context.get('request')
        if obj.casual_image2 and request:
            return request.build_absolute_uri(obj.casual_image2.url)
        return None

    def get_casual_image3_url(self, obj):
        request = self.context.get('request')
        if obj.casual_image3 and request:
            return request.build_absolute_uri(obj.casual_image3.url)
        return None
