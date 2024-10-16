from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, SubCategory, Tag
from .serializers import CategorySerializer, SubCategorySerializer, TagSerializer

# List and create a new category
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# List and create a new subcategory, linking it to an existing category
class SubCategoryListCreateView(generics.ListCreateAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

    def perform_create(self, serializer):
        category_id = self.request.data.get('category_id')  # Fetch the category ID from the request
        category = Category.objects.get(id=category_id)  # Ensure the category exists
        serializer.save(category=category)


# List and create a new tag
class TagListCreateView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
