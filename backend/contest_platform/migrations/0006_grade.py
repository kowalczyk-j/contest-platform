# Generated by Django 5.0.1 on 2024-01-12 21:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contest_platform', '0005_rename_assessmentcriterion_gradecriterion'),
    ]

    operations = [
        migrations.CreateModel(
            name='Grade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.IntegerField(null=True)),
                ('criterion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contest_platform.gradecriterion')),
                ('entry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contest_platform.entry')),
            ],
        ),
    ]