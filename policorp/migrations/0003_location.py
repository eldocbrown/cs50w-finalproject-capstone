# Generated by Django 3.1.2 on 2020-11-17 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('policorp', '0002_availability_when'),
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
    ]