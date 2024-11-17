# backend/core/admin.py

from django.contrib import admin
from django.utils.html import format_html
from .models import React, Country, Position

@admin.register(React)
class ReactAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'name', 
        'line_name', 
        'status', 
        'major', 
        'positions_display', 
        'crossing_semester_display',  # Display crossing semester
        'graduating_semester_display',  # Display graduating semester
        'image_tag', 
        'casual_images_tag'
    )
    search_fields = ('name', 'line_name', 'major')
    list_filter = ('status', 'major', 'positions', 'crossing_year', 'graduating_year')  # Added filters
    readonly_fields = ('id', 'image_tag', 'casual_images_tag', 'crossing_semester_display', 'graduating_semester_display')
    filter_horizontal = ('nationalities', 'positions',)  # Enhances ManyToManyField UI

    def crossing_semester_display(self, obj):
        """Display the crossing semester as 'Month Year'."""
        if obj.crossing_month and obj.crossing_year:
            return f"{obj.crossing_month} {obj.crossing_year}"
        return "Unknown"
    crossing_semester_display.short_description = 'Crossing Semester'

    def graduating_semester_display(self, obj):
        """Display the graduating semester as 'Month Year'."""
        if obj.graduating_month and obj.graduating_year:
            return f"{obj.graduating_month} {obj.graduating_year}"
        return "Unknown"
    graduating_semester_display.short_description = 'Graduating Semester'

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />'.format(obj.image.url))
        return "-"
    image_tag.short_description = 'Main Image'

    def casual_images_tag(self, obj):
        images = []
        for img_field in ['casual_image1', 'casual_image2', 'casual_image3']:
            img = getattr(obj, img_field)
            if img:
                images.append(format_html('<img src="{}" width="50" height="50" style="margin-right:5px;" />', img.url))
        return format_html(' '.join(images)) if images else "-"
    casual_images_tag.short_description = 'Casual Images'

    def positions_display(self, obj):
        """Display a comma-separated list of positions with optional start and end dates."""
        return ", ".join([
            f"{position.title} (ID: {position.id}) [{self.get_start_date(position)} - {self.get_end_date(position)}]"
            for position in obj.positions.all()
        ])

    def get_start_date(self, position):
        """Helper method to format the start date."""
        if position.start_month and position.start_year:
            return f"{position.start_month} {position.start_year}"
        elif position.start_year:
            return f"{position.start_year}"
        return "N/A"

    def get_end_date(self, position):
        """Helper method to format the end date."""
        if position.end_month and position.end_year:
            return f"{position.end_month} {position.end_year}"
        elif position.end_year:
            return f"{position.end_year}"
        return "Present"

    positions_display.short_description = 'Positions (with IDs)'

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ('code', 'name')  # Adds a search bar for easier navigation
    ordering = ('name',)  # Ensures alphabetical ordering in the admin list

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'start_display', 'end_display', 'brothers_display')
    search_fields = ('title', 'description')
    list_filter = ('title', 'start_year', 'end_year')
    ordering = ('id', 'title', 'start_year', 'end_year')
    
    def start_display(self, obj):
        """Display start date in a 'Month Year' format."""
        if obj.start_month and obj.start_year:
            return f"{obj.start_month} {obj.start_year}"
        elif obj.start_year:
            return f"{obj.start_year}"
        return "Unknown"

    def end_display(self, obj):
        """Display end date in a 'Month Year' format."""
        if obj.end_month and obj.end_year:
            return f"{obj.end_month} {obj.end_year}"
        elif obj.end_year:
            return f"{obj.end_year}"
        return "Present"  # Assume "Present" if end date is missing

    start_display.short_description = 'Start Date'
    end_display.short_description = 'End Date'

    def brothers_display(self, obj):
        """Display a comma-separated list of brothers by name and their React IDs."""
        return ", ".join([f"{brother.name} (ID: {brother.id})" for brother in obj.brothers.all()])
    brothers_display.short_description = 'Brothers'
