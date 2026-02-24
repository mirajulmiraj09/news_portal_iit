from django.urls import path, include
from news.views import CommentViewSet, NewsViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

router = DefaultRouter()
router.register("news", NewsViewSet, basename="news")

news_router = NestedDefaultRouter(router, "news", lookup="news")
news_router.register("comments", CommentViewSet, basename="news-comments")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(news_router.urls)),
]
