from accounts.serializers import UserSerializer
from rest_framework import serializers
from news.models import News, Comment


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "text", "user", "timestamp"]
        read_only_fields = ["id", "timestamp", "user"]


class NewsListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comment_count = serializers.IntegerField(source="comments.count", read_only=True)

    class Meta:
        model = News
        fields = ["id", "title", "body", "author", "comment_count", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at", "author"]


class NewsDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = News
        fields = ["id", "title", "body", "author", "comments", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at", "author"]