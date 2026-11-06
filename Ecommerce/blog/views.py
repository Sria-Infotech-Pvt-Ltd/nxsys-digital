import logging

from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from core.pagination.views import PaginatedAPIView
from .models import Post, PostImage
from .serializers import PostImageSerializer, PostListSerializer, PostSerializer

logger = logging.getLogger(__name__)


def _build_post_queryset(include_inactive=False):
    qs = Post.objects.all().prefetch_related(
        Prefetch("images", queryset=PostImage.objects.order_by("-created_at"))
    )
    if not include_inactive:
        qs = qs.filter(is_active=True)
    return qs


class PostAPIView(PaginatedAPIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method in ["GET", "OPTIONS"]:
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        include_inactive = (
            request.user.is_authenticated
            and request.user.is_staff
            and request.query_params.get("include_inactive", "").lower() == "true"
        )
        queryset = _build_post_queryset(include_inactive=include_inactive)
        response = self.paginate(request, queryset, PostListSerializer)
        if request.user.is_authenticated and request.user.is_staff:
            response["Cache-Control"] = "no-store, no-cache, must-revalidate"
        return response

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        is_active = serializer.validated_data.get("is_active", True)
        serializer.save(is_active=is_active)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PostDetailAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method in ["GET", "OPTIONS"]:
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, pk):
        include_inactive = request.user.is_authenticated and request.user.is_staff
        queryset = _build_post_queryset(include_inactive=include_inactive)
        post = get_object_or_404(queryset, pk=pk)
        return Response(PostSerializer(post, context={"request": request}).data)

    def put(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post, data=request.data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PostBySlugAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        queryset = _build_post_queryset(include_inactive=False)
        post = get_object_or_404(queryset, slug=slug)
        return Response(PostSerializer(post, context={"request": request}).data)


class PostImageDeleteAPIView(APIView):
    """DELETE /blog/posts/{post_id}/images/{image_id}/"""
    permission_classes = [IsAdminUser]

    def delete(self, request, post_id, image_id):
        post = get_object_or_404(Post, pk=post_id)
        image_obj = get_object_or_404(PostImage, pk=image_id, post=post)
        image_obj.delete()
        return Response(
            {"message": f"Image deleted from {post.title} successfully."},
            status=status.HTTP_200_OK,
        )
