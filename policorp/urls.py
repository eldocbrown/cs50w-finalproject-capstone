from django.urls import path

from . import views

app_name = "policorp"

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("tasks/", views.tasks, name="tasks"),
    path("availabilities/<int:taskid>/", views.availabilities, name="availabilities"),
    path("dailyavailabilities/<int:taskid>/<str:date>/", views.dailyavailabilities, name="dailyavailabilities"),
    path("book/<int:availabilityid>/", views.book, name="book"),
    path("myschedule/", views.myschedule, name="myschedule"),
    path("cancelbooking/<int:bookingid>/", views.cancelbooking, name="cancelbooking"),
    path("mysupervisedlocations/", views.mysupervisedlocations, name="mysupervisedlocations"),
    path("locationschedule/<int:locationid>/<str:date>/", views.locationschedule, name="locationschedule"),
    path("createavailabilities/", views.createavailabilities, name="createavailabilities")
]
