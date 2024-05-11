from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from .models import Course, Enrollment

User = get_user_model()

class CreateUserAPITest(APITestCase):
    def test_get_user_with_token(self):
        create_url = '/api/auth/users/'
        user_data = {
            'email': 'ali@mail.ru',
            'username': 'testuser',
            'password': '1234aaa5'
        }
        response_create = self.client.post(create_url, user_data, format='json')
        self.assertEqual(response_create.status_code, status.HTTP_201_CREATED)

        token_url = '/api/token/'
        token_data = {
            'username': 'testuser',
            'password': '1234aaa5'
        }
        response_token = self.client.post(token_url, token_data, format='json')
        self.assertEqual(response_token.status_code, status.HTTP_200_OK)
        token = response_token.data['access']

        user_id = response_create.data['id']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        user_url = f'/api/auth/users/{user_id}/'
        response = self.client.get(user_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'ali@mail.ru')
        self.assertEqual(response.data['username'], 'testuser')
    def test_create_user(self):
        url = '/api/auth/users/'
        data = {
            'email': 'ali@mail.ru',
            'username': 'testuser',
            'password': '1234aaa5'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')
        self.assertEqual(User.objects.get().email, 'ali@mail.ru')

    def test_update_user(self):
        create_url = '/api/auth/users/'
        user_data = {
            'email': 'ali@mail.ru',
            'username': 'testuser',
            'password': '1234aaa5'
        }
        response_create = self.client.post(create_url, user_data, format='json')
        self.assertEqual(response_create.status_code, status.HTTP_201_CREATED)

        user_id = response_create.data['id']

        token_url = '/api/token/'
        token_data = {
            'username': 'testuser',
            'password': '1234aaa5'
        }
        response_token = self.client.post(token_url, token_data, format='json')
        token = response_token.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        update_url = f'/api/auth/users/{user_id}/'
        update_data = {
            'email': 'updated@mail.ru',
            'username': 'updateduser',
            'password': 'newpassword123'
        }
        response_update = self.client.put(update_url, update_data, format='json')

        self.assertEqual(response_update.status_code, status.HTTP_200_OK)
        self.assertEqual(response_update.data['email'], 'updated@mail.ru')
        self.assertEqual(response_update.data['username'], 'updateduser')

        user = User.objects.get(id=user_id)
        self.assertEqual(user.email, 'updated@mail.ru')
        self.assertEqual(user.username, 'updateduser')


class CourseApiViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='ali@mail.ru', password='testpass123')
        self.client.login(username='testuser', password='testpass123')

        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        }, format='json')
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        self.course1 = Course.objects.create(course_name="Course 1", description="A first course", creator=self.user)
        self.course2 = Course.objects.create(course_name="Course 2", description="A second course", creator=self.user)


    def test_create_course(self):
        url = reverse('course-list')
        data = {'course_name': 'New Course', 'description': 'A new course'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 3)

    def test_update_course(self):
        url = reverse('course-detail', args=[self.course1.id])
        data = {'course_name': 'Updated Course', 'description': 'An updated course'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course1.refresh_from_db()
        self.assertEqual(self.course1.course_name, 'Updated Course')

    def test_delete_course(self):
        url = reverse('course-detail', args=[self.course2.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Course.objects.count(), 1)

    def test_search_courses(self):
        url = reverse('course-search-courses')
        response = self.client.get(f'{url}?query=first')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)



class CourseCreaterApiViewTests(APITestCase):
    def setUp(self):
        self.producer = User.objects.create_user(username='producer', email='producer@example.com', password='producerpass')
        self.course = Course.objects.create(course_name='Test Course', description='Test description', creator=self.producer)

        self.create_url = reverse('course-list')

    def test_create_course(self):
        self.client.force_authenticate(user=self.producer)
        data = {'course_name': 'New Course', 'description': 'New course description'}
        response = self.client.post(self.create_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 2)
        self.assertEqual(Course.objects.last().creator, self.producer)

    def test_retrieve_course(self):
        self.client.force_authenticate(user=self.producer)
        detail_url = reverse('course-detail', args=[self.course.pk])
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['course_name'], self.course.course_name)
        self.assertEqual(response.data['description'], self.course.description)

    def test_delete_course(self):
        self.client.force_authenticate(user=self.producer)
        delete_url = reverse('course-detail', args=[self.course.pk])
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Course.objects.count(), 0)

    def test_delete_course_of_other_user(self):
        other_user = User.objects.create_user(username='otheruser', email='otheruser@example.com', password='otheruserpass')
        self.client.force_authenticate(user=other_user)
        delete_url = reverse('course-detail', args=[self.course.pk])
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

