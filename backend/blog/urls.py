from django.urls import path
from blog.views import blog_view

urlpatterns = [
    path('blog-posts/', blog_view.BlogPostListCreateView.as_view(), name='blogpost-list-create'),
    path('blog-posts/<int:pk>/', blog_view.BlogPostDetailView.as_view(), name='blogpost-detail'),
]
