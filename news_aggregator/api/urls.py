from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import NewsSourceViewSet, CategoryViewSet, TagViewSet, ArticleViewSet, CommentViewSet

router = DefaultRouter()
router.register('sources', NewsSourceViewSet, basename='source')
router.register('categories', CategoryViewSet, basename='category')
router.register('tags', TagViewSet, basename='tag')
router.register('articles', ArticleViewSet, basename='article')


comments_router = DefaultRouter()
comments_router.register('comments', CommentViewSet, basename='comment')


urlpatterns = [
    path('v1/', include('djoser.urls')),
    path('v1/', include('djoser.urls.jwt')),
    path('v1/', include(router.urls)),
    path('v1/articles/<int:article_id>/', include(comments_router.urls)),
]
