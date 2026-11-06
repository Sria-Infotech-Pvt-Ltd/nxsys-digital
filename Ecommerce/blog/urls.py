from django.urls import path

from .views import (
    PostAPIView, PostBySlugAPIView, PostDetailAPIView, PostImageDeleteAPIView,
)

urlpatterns = [
    path("posts/", PostAPIView.as_view(), name="post-list-create"),
    path("posts/<int:pk>/", PostDetailAPIView.as_view(), name="post-detail"),
    path("posts/slug/<slug:slug>/", PostBySlugAPIView.as_view(), name="post-by-slug"),
    path("posts/<int:post_id>/images/<int:image_id>/", PostImageDeleteAPIView.as_view(), name="post-image-delete"),
]
