# Generated by Django 3.1.2 on 2020-11-19 20:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('policorp', '0002_booking'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='availabiliy',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='policorp.availability'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='booking',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='policorp.user'),
            preserve_default=False,
        ),
    ]
