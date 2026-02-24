from  django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from news.models import News, Comment
from rest_framework.exceptions import NotFound
from rest_framework import permissions
from news.serializers import NewsListSerializer, NewsDetailSerializer, CommentSerializer

class IsAuthorOrReadOnly(permissions.BasePermission):
    """Permission for news (and other author-owned objects).

    - Safe methods (GET, HEAD, OPTIONS) are allowed for everyone.
    - Write methods (POST, PUT, PATCH, DELETE) are only allowed to the
      object's author or to staff/superuser accounts (admin).
    """

    def has_object_permission(self, request, view, obj):
        # always allow read operations
        if request.method in permissions.SAFE_METHODS:
            return True
        # determine the author field (news uses "author", comments use "user")
        author = getattr(obj, "author", None) or getattr(obj, "user", None)
        # allow if the requester is the author or an administrator
        return author == request.user or request.user.is_staff


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.select_related("author").prefetch_related("comments__user")
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]


class IsCommentAuthorOrNewsAuthorOrReadOnly(permissions.BasePermission):
    """Permission for comment objects.

    * Safe methods (GET, HEAD, OPTIONS) are always allowed.
    * Updating (PUT/PATCH) is limited to the comment's creator (or staff).
    * Deletion is allowed for the comment author, the owner of the related
      news item, or any staff user.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user
        if request.method in ("PUT", "PATCH"):
            return obj.user == user or user.is_staff

        if request.method == "DELETE":
            return (
                obj.user == user
                or obj.news.author == user
                or user.is_staff
            )
        return False



class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    # user must be logged in; additional object-level checks below
    permission_classes = [IsAuthenticated, IsCommentAuthorOrNewsAuthorOrReadOnly]

    def get_queryset(self):
        news_id = self.kwargs.get("news_pk")
        return Comment.objects.filter(news_id=news_id)

    def perform_create(self, serializer):
        news_id = self.kwargs.get("news_pk")
        try:
            news = News.objects.get(id=news_id)
        except News.DoesNotExist:
            raise NotFound("News not found")

        serializer.save(user=self.request.user, news=news)