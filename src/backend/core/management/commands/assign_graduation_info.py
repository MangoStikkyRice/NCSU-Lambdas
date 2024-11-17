# core/management/commands/assign_graduation_info.py

from django.core.management.base import BaseCommand
from core.models import React

class Command(BaseCommand):
    help = 'Assign graduating semester (month and year) based on class_field'

    def handle(self, *args, **kwargs):
        # Define mappings for class_field to graduating_month and graduating_year
        class_graduation_mapping = {
            'Nu Nen': ('May', '2024'),
            'Mu Monarchs': ('May', '2023'),
            'Charter Conquest': ('May', '2017'),
            'Alpha Ascension': ('December', '2018'),
            'Beta Battalion': ('May', '2019'),
            'Gamma Guardians': ('December', '2020'),
            'Delta Dimension': ('May', '2021'),
            'Epsilon Eclipse': ('December', '2022'),
            'Zeta Zaibatsu': ('May', '2023'),
            'Eta Evolution': ('December', '2024'),
            'Theta Trinity': ('May', '2025'),
            'Iota Immortals': ('December', '2026'),
            'Kappa Kazoku': ('May', '2027'),
            # Add more mappings as needed
        }

        # Counters for summary
        total = React.objects.count()
        updated = 0
        not_found = 0
        already_up_to_date = 0

        # Loop through each React object
        for brother in React.objects.all():
            brother_class = brother.class_field

            # Only update if we have a mapping for this class_field
            if brother_class in class_graduation_mapping:
                graduating_month, graduating_year = class_graduation_mapping[brother_class]

                # Check if the current graduating info is different from the mapped values
                if (brother.graduating_month != graduating_month) or (brother.graduating_year != graduating_year):
                    # Update the graduating_month and graduating_year fields
                    brother.graduating_month = graduating_month
                    brother.graduating_year = graduating_year
                    brother.save()

                    updated += 1
                    self.stdout.write(self.style.SUCCESS(
                        f'Updated graduation info for {brother.name} (ID: {brother.id}) to {graduating_month} {graduating_year}'
                    ))
                else:
                    already_up_to_date += 1
                    self.stdout.write(self.style.NOTICE(
                        f'Graduation info already up-to-date for {brother.name} (ID: {brother.id})'
                    ))
            else:
                not_found += 1
                self.stderr.write(self.style.WARNING(
                    f'No graduation mapping found for class_field "{brother_class}" of {brother.name} (ID: {brother.id})'
                ))

        # Summary Output
        self.stdout.write(self.style.SUCCESS(
            f'\nGraduation info assignment complete.\nTotal Reacts: {total}\nUpdated: {updated}\nAlready Up-to-date: {already_up_to_date}\nNo Mapping Found: {not_found}'
        ))
