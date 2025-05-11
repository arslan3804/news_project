from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .filters import ArticleFilter
from news.models import NewsSource, Category, Tag, Article, Comment
from .permissions import AdminOnlyCreateUpdateDelete
from .serializers import (
    NewsSourceSerializer,
    CategorySerializer,
    TagSerializer,
    ArticleSerializer,
    CommentSerializer
)


class NewsSourceViewSet(viewsets.ModelViewSet):
    queryset = NewsSource.objects.all()
    serializer_class = NewsSourceSerializer
    permission_classes = (AdminOnlyCreateUpdateDelete,)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (AdminOnlyCreateUpdateDelete,)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (AdminOnlyCreateUpdateDelete,)

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all().order_by('-published_at')
    serializer_class = ArticleSerializer
    permission_classes = (AdminOnlyCreateUpdateDelete,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ArticleFilter

    @action(detail=False, url_path='category/(?P<slug>[\w-]+)', methods=['get'])
    def by_category_slug(self, request, slug=None):
        category = get_object_or_404(Category, slug=slug)
        articles = Article.objects.filter(category=category)
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        article_id = self.kwargs.get('article_id')
        article = get_object_or_404(Article, id=article_id)
        return article.comments.all()

    def perform_create(self, serializer):
        article_id = self.kwargs.get('article_id')
        article = get_object_or_404(Article, id=article_id)
        serializer.save(user=self.request.user, article=article)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise permissions.PermissionDenied("Вы можете редактировать только свои комментарии")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise permissions.PermissionDenied("Вы можете удалять только свои комментарии")
        instance.delete()
