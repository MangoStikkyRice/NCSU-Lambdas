from django.db import models

# Constants for month choices to avoid duplication
MONTH_CHOICES = [
    ('January', 'January'), ('February', 'February'), ('March', 'March'),
    ('April', 'April'), ('May', 'May'), ('June', 'June'),
    ('July', 'July'), ('August', 'August'), ('September', 'September'),
    ('October', 'October'), ('November', 'November'), ('December', 'December')
]

class Country(models.Model):
    code = models.CharField(
        max_length=2,
        unique=True,
        help_text="ISO 3166-1 alpha-2 country code (e.g., 'us' for United States')"
    )
    name = models.CharField(
        max_length=100,
        help_text="Full country name (e.g., 'United States')"
    )

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.name

class Position(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # Date fields for position tenure
    start_month = models.CharField(
        max_length=9,
        choices=MONTH_CHOICES,
        null=True, 
        blank=True
    )
    start_year = models.CharField(max_length=4, null=True, blank=True)
    end_month = models.CharField(
        max_length=9,
        choices=MONTH_CHOICES,
        null=True, 
        blank=True
    )
    end_year = models.CharField(max_length=4, null=True, blank=True)

    brothers = models.ManyToManyField(
        'Brother',
        related_name='positions_held',
        blank=True,
        help_text="Select brothers who held this position."
    )

    class Meta:
        ordering = ['title']

    def __str__(self):
        return f"{self.title} (ID: {self.id})"

class Brother(models.Model):
    # Basic Information
    name = models.CharField(max_length=100, blank=True)
    line_name = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, blank=True)
    class_field = models.CharField(max_length=50, blank=True)
    
    # Family Tree
    big_id = models.IntegerField(null=True, blank=True)
    little_ids = models.JSONField(default=list, null=True, blank=True)
    
    # Academic Information
    major = models.CharField(max_length=100, blank=True)
    
    # Personal Information
    hobbies = models.JSONField(default=list, null=True, blank=True)
    nationalities = models.ManyToManyField(Country, related_name='brothers', blank=True)
    
    # Images
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    casual_image1 = models.ImageField(upload_to='casual_images/', null=True, blank=True)
    casual_image2 = models.ImageField(upload_to='casual_images/', null=True, blank=True)
    casual_image3 = models.ImageField(upload_to='casual_images/', null=True, blank=True)
    
    # Positions
    positions = models.ManyToManyField(Position, related_name='brothers_in_position', blank=True)
    
    # Timeline Information
    crossing_month = models.CharField(
        max_length=9,
        choices=MONTH_CHOICES,
        null=True, 
        blank=True
    )
    crossing_year = models.CharField(max_length=4, null=True, blank=True)
    graduating_month = models.CharField(
        max_length=9,
        choices=MONTH_CHOICES,
        null=True, 
        blank=True
    )
    graduating_year = models.CharField(max_length=4, null=True, blank=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Brothers"

    def __str__(self):
        return self.name

    @property
    def big(self):
        """Get the big brother object"""
        if self.big_id:
            return Brother.objects.filter(id=self.big_id).first()
        return None

    @property
    def littles(self):
        """Get the little brothers objects"""
        if self.little_ids:
            return Brother.objects.filter(id__in=self.little_ids)
        return []
