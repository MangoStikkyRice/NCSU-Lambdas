from django.core.management.base import BaseCommand
from core.models import React

class Command(BaseCommand):
    help = 'Assign crossing semester (month and year) based on class'

    def handle(self, *args, **kwargs):
        # Define mappings for class_field to crossing_month and crossing_year
        class_date_mapping = {
            'Nu Nen': ('August', '2023'),
            'Mu Monarchs': ('August', '2022'),
            'Charter Conquest': ('August', '2016'),
            'Alpha Ascension': ('January', '2017'),
            'Beta Battalion': ('August', '2017'),
            'Gamma Guardians': ('January', '2018'),
            'Delta Dimension': ('August', '2018'),
            'Epsilon Eclipse': ('January', '2019'),
            'Zeta Zaibatsu': ('August', '2019'),
            'Eta Evolution': ('January', '2020'),
            'Theta Trinity': ('January', '2021'),
            'Iota Immortals': ('August', '2021'),
            'Kappa Kazoku': ('January', '2022'),
            # Add more mappings as needed
        }

        # Loop through each React object
        for brother in React.objects.all():
            brother_class = brother.class_field

            # Only update if we have a mapping for this class
            if brother_class in class_date_mapping:
                crossing_month, crossing_year = class_date_mapping[brother_class]

                # Update the crossing month and year fields
                brother.crossing_month = crossing_month
                brother.crossing_year = crossing_year
                brother.save()

                self.stdout.write(self.style.SUCCESS(f'Updated crossing dates for {brother.name}'))

        self.stdout.write(self.style.SUCCESS('Crossing dates assignment complete.'))
