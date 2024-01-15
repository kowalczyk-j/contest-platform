import csv
from ..models import School
from io import TextIOWrapper


def upload_schools_data(file):
    file_wrapper = TextIOWrapper(file.file, encoding="utf-8")
    with file_wrapper as csvfile:
        csv_reader = csv.DictReader(csvfile)
        for row in csv_reader:
            row.pop("lp.", None)
            existing_record = School.objects.filter(
                name=row["Nazwa"], phone=row["Telefon"], email=row["E-mail"]
            ).first()

            if not existing_record:
                School.objects.create(
                    name=row["Nazwa"],
                    street=row["Ulica"],
                    building_number=row["Numer budynku"],
                    apartment_number=row["Numer lokalu"],
                    postal_code=row["Kod pocztowy"],
                    city=row["Miejscowość"],
                    phone=row["Telefon"],
                    fax=row["Faks"],
                    email=row["E-mail"],
                    website=row["Strona www"],
                    audience_status=row["Publiczność status"],
                    institution_specifics=row["Specyfika placówki"],
                    director_name=row["Imię i nazwisko dyrektora"],
                )
