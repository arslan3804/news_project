import django_filters
from news.models import Article

class ArticleFilter(django_filters.FilterSet):
    tag = django_filters.CharFilter(method='filter_by_tags')

    class Meta:
        model = Article
        fields = []

    def filter_by_tags(self, queryset, name, value):
        tag_names = self.request.GET.getlist('tag')
        return queryset.filter(tags__name__in=tag_names).distinct()
