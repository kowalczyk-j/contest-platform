import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from contest_platform.models import Contest


def update_contest_statuses():
    contests = Contest.objects.all()
    for contest in contests:
        contest.save()


if __name__ == "__main__":
    update_contest_statuses()
