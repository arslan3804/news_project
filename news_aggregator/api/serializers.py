from rest_framework import serializers

from news.models import NewsSource, Category, Tag, Article, Comment


class NewsSourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = NewsSource
        fields = ('name', 'url', 'is_active')


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ('name', 'slug')


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('name',)


class ArticleSerializer(serializers.ModelSerializer):
    source = serializers.CharField(write_only=True)
    category = serializers.CharField(
        write_only=True, 
        required=False, 
        allow_null=True
    )
    tags = serializers.ListField(
        write_only=True,
        child=serializers.CharField(),
        required=False,
        default=[]
    )

    source_detail = NewsSourceSerializer(source='source', read_only=True)
    category_detail = CategorySerializer(source='category', read_only=True)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'description', 'content', 'url', 'image_url', 
            'video_url', 'source', 'source_detail',
            'category', 'category_detail', 'tags', 'tags_detail', 'created_at'
        ]
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        source_url = validated_data.pop('source')
        try:
            source = NewsSource.objects.get(url=source_url)
        except NewsSource.DoesNotExist:
            raise serializers.ValidationError(
                {'source': f'Источник с URL {source_url} не найден'}
            )
        
        category_slug = validated_data.pop('category', None)
        category = None
        if category_slug:
            try:
                category = Category.objects.get(slug=category_slug)
            except Category.DoesNotExist:
                raise serializers.ValidationError(
                    {'category': f'Категория {category_slug} не найдена'}
                )
        
        tag_names = validated_data.pop('tags', [])
        
        article = Article.objects.create(
            source=source,
            category=category,
            **validated_data
        )
        
        tags = []
        for name in tag_names:
            tag, _ = Tag.objects.get_or_create(name=name)
            tags.append(tag)
        article.tags.set(tags)
        
        return article


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field='username', read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'user', 'article', 'text', 'created_at')
        read_only_fields = ('user', 'article', 'created_at')
