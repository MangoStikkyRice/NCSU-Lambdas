from django.db import models

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
        ordering = ['name']  # Orders countries alphabetically by name

    def __str__(self):
        return self.name

class Position(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    start_month = models.CharField(
        max_length=9,  # 'January' is the longest month name
        choices=[
            ('January', 'January'), ('February', 'February'), ('March', 'March'),
            ('April', 'April'), ('May', 'May'), ('June', 'June'),
            ('July', 'July'), ('August', 'August'), ('September', 'September'),
            ('October', 'October'), ('November', 'November'), ('December', 'December')
        ],
        null=True, blank=True
    )
    start_year = models.CharField(max_length=4, null=True, blank=True)

    end_month = models.CharField(        max_length=9,  # 'January' is the longest month name
        choices=[
            ('January', 'January'), ('February', 'February'), ('March', 'March'),
            ('April', 'April'), ('May', 'May'), ('June', 'June'),
            ('July', 'July'), ('August', 'August'), ('September', 'September'),
            ('October', 'October'), ('November', 'November'), ('December', 'December')
        ],
        null=True, blank=True)
    end_year = models.CharField(max_length=4, null=True, blank=True)

    brothers = models.ManyToManyField(
        'React',
        related_name='positions_held_by_brothers',
        blank=True,
        help_text="Select brothers who held this position."
    )

    def __str__(self):
        return f"{self.title} (ID: {self.id})"


class React(models.Model):
    name = models.CharField(max_length=100, blank=True)
    line_name = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, blank=True)
    class_field = models.CharField(max_length=50, blank=True)  # 'class' is a reserved keyword
    bigId = models.IntegerField(null=True, blank=True)
    littleIds = models.JSONField(default=list, null=True, blank=True)  # Storing lists of IDs
    major = models.CharField(max_length=100, blank=True)
    hobbies = models.JSONField(default=list, null=True, blank=True)  # Storing lists of hobbies
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    casual_image1 = models.ImageField(upload_to='casual_images/', null=True, blank=True)
    casual_image2 = models.ImageField(upload_to='casual_images/', null=True, blank=True)
    casual_image3 = models.ImageField(upload_to='casual_images/', null=True, blank=True)

    # Nationalities field
    nationalities = models.ManyToManyField(Country, related_name='reacts', blank=True)

    # Positions held by the React brothers (adjusting the related_name here)
    positions = models.ManyToManyField(Position, related_name='brothers_in_position', blank=True)

        # New fields for crossing semester
    crossing_month = models.CharField(
        max_length=9,  # 'January' is the longest month name
        choices=[('January', 'January'), ('February', 'February'), ('March', 'March'),
                 ('April', 'April'), ('May', 'May'), ('June', 'June'),
                 ('July', 'July'), ('August', 'August'), ('September', 'September'),
                 ('October', 'October'), ('November', 'November'), ('December', 'December')],
        null=True, blank=True
    )
    crossing_year = models.CharField(max_length=4, null=True, blank=True)

    graduating_month = models.CharField(
        max_length=9,  # 'January' is the longest month name
        choices=[('January', 'January'), ('February', 'February'), ('March', 'March'),
                 ('April', 'April'), ('May', 'May'), ('June', 'June'),
                 ('July', 'July'), ('August', 'August'), ('September', 'September'),
                 ('October', 'October'), ('November', 'November'), ('December', 'December')],
        null=True, blank=True
    )
    graduating_year = models.CharField(max_length=4, null=True, blank=True)
    def __str__(self):
        return self.name
