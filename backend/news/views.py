from  django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from news.models import News, Comment
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework import permissions
from news.serializers import NewsListSerializer, NewsDetailSerializer, CommentSerializer

class IsAuthorOrReadOnly(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        # Always allow GET/HEAD/OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True
        author = getattr(obj, "author", None) or getattr(obj, "user", None)
        if author == request.user:
            return True
        # staff or superusers should also be able to modify/delete
        return bool(request.user and (request.user.is_staff or request.user.is_superuser))


class NewsViewSet(viewsets.ModelViewSet):
    # Since this it will not n+1 queries problem 
    queryset = News.objects.select_related("author").prefetch_related("comments__user")
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return NewsDetailSerializer
        return NewsListSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.author:
            raise PermissionDenied("You can only edit your own post.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied("You can only delete your own post.")
        instance.delete()


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

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