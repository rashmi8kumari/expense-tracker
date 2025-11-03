from django.urls import path, re_path
from django.views.generic import TemplateView
from .views import RegisterView, ExpenseListCreateView, ExpenseDetailView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Expense CRUD
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
]


# Serve React build files
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='home'),
]

