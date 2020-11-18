from django.test import TestCase, Client
from django.urls import reverse


class TestClient(TestCase):

    def test_tasks_view_return_200(self):
        """*** Tasks view get request needs to be with response 200 ***"""
        c = Client()
        response = c.get(reverse('policorp:tasks'))
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()