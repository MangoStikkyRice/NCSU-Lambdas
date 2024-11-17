# core/serializers.py

from rest_framework import serializers
from .models import React, Country, Position

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['code', 'name']

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['title', 'description', 'start_month', 'start_year', 'end_month', 'end_year']


class ReactSerializer(serializers.ModelSerializer):

    nationalities = CountrySerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField(read_only=True)
    casual_image1_url = serializers.SerializerMethodField(read_only=True)
    casual_image2_url = serializers.SerializerMethodField(read_only=True)
    casual_image3_url = serializers.SerializerMethodField(read_only=True)
    positions = PositionSerializer(many=True)
    crossing_year = serializers.CharField(max_length=4, allow_null=True, allow_blank=True, read_only=True)
    crossing_month = serializers.CharField(max_length=9, allow_null=True, allow_blank=True, read_only=True)

        # Include graduating_year and graduating_month
    graduating_year = serializers.CharField(max_length=4, allow_null=True, allow_blank=True, read_only=True)
    graduating_month = serializers.CharField(max_length=9, allow_null=True, allow_blank=True, read_only=True)

    class Meta:
        model = React
        fields = [
            'id',
            'name',
            'line_name',
            'status',
            'class_field',
            'crossing_year',    # Added
            'crossing_month',   # Added
            'graduating_year',   # Added
            'graduating_month',  # Added
            'bigId',
            'littleIds',
            'major',
            'hobbies',
            'image',  # Writable field
            'casual_image1',  # Writable field
            'casual_image2',  # Writable field
            'casual_image3',  # Writable field
            'image_url',  # Read-only field
            'casual_image1_url',  # Read-only field
            'casual_image2_url',  # Read-only field
            'casual_image3_url',  # Read-only field
            'nationalities',
            'positions'
        ]

            # Adding a method to get crossing_semester or formatted date (e.g., "Fall 2020")
    def get_crossing_semester(self, obj):
        # You can adjust this logic based on how the crossing semester is structured in your data
        return obj.class_field  # Assuming 'class_field' holds values like "Fall 2020"

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_casual_image1_url(self, obj):
        request = self.context.get('request')
        if obj.casual_image1:
            return request.build_absolute_uri(obj.casual_image1.url)
        return None

    def get_casual_image2_url(self, obj):
        request = self.context.get('request')
        if obj.casual_image2:
            return request.build_absolute_uri(obj.casual_image2.url)
        return None

    def get_casual_image3_url(self, obj):
        request = self.context.get('request')
        if obj.casual_image3:
            return request.build_absolute_uri(obj.casual_image3.url)
        return None
