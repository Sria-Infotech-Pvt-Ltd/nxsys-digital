import logging
from rest_framework import serializers
from core.utils.serializers import SanitizedModelSerializer, validate_image_file
from .models import Post, PostImage

logger = logging.getLogger(__name__)


class PostImageSerializer(SanitizedModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PostImage
        fields = ["id", "post", "image", "image_url", "created_at"]
        read_only_fields = ["created_at", "image_url"]

    def get_image_url(self, obj):
        try:
            return obj.image.url if obj.image else None
        except Exception as e:
            logger.error(f"Error getting post image URL: {str(e)}", exc_info=True)
            return None

    def validate_image(self, value):
        return validate_image_file(value)


class PostSerializer(SanitizedModelSerializer):
    images = serializers.SerializerMethodField(read_only=True)
    is_active = serializers.BooleanField(required=False, default=True)
    uploaded_images = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False, use_url=False),
        required=False,
        write_only=True,
    )

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "excerpt", "content", "author_name",
            "featured_image", "is_active", "images", "uploaded_images",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "slug", "images", "created_at", "updated_at"]

    def validate_uploaded_images(self, value):
        validated, errors = [], []
        for idx, f in enumerate(value):
            try:
                validated.append(validate_image_file(f))
            except serializers.ValidationError as e:
                detail = e.detail if isinstance(e.detail, list) else [e.detail]
                errors.append(f"{getattr(f, 'name', f'image #{idx + 1}')}: {' '.join(str(d) for d in detail)}")
            except Exception as e:
                logger.error(f"Error validating post image: {str(e)}", exc_info=True)
                errors.append(f"{getattr(f, 'name', f'image #{idx + 1}')}: validation failed.")
        if errors:
            raise serializers.ValidationError(errors)
        return validated

    def validate_featured_image(self, value):
        return validate_image_file(value)

    def get_images(self, obj):
        try:
            request = self.context.get("request")

            def absolute(url):
                if not url:
                    return None
                return request.build_absolute_uri(url) if request else url

            combined = []
            if obj.featured_image:
                combined.append({
                    "id": None,
                    "image_url": absolute(obj.featured_image.url),
                    "is_main": True,
                })
            combined.extend({
                "id": img.id,
                "image_url": absolute(img.image.url) if img.image else None,
                "is_main": False,
            } for img in obj.images.all())
            return combined
        except Exception as e:
            logger.error(f"Error building post images: {str(e)}", exc_info=True)
            return []

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not representation.get("excerpt"):
            content = instance.content or ""
            representation["excerpt"] = (content[:160] + "...") if len(content) > 160 else content
        return representation

    def to_internal_value(self, data):
        try:
            from django.http import QueryDict
            if isinstance(data, QueryDict):
                shallow = QueryDict(mutable=True)
                for key in data.keys():
                    shallow.setlist(key, data.getlist(key))
                data = shallow
            else:
                data = {**data}

            val = data.get("featured_image")
            if isinstance(val, str):
                data.pop("featured_image", None)

            return super().to_internal_value(data)
        except serializers.ValidationError:
            raise
        except Exception as e:
            logger.error(f"Error processing post data: {str(e)}", exc_info=True)
            raise serializers.ValidationError({"detail": "Error processing post data."})

    def _save_gallery_images(self, post, files):
        if not files:
            return
        for f in files:
            PostImage.objects.create(post=post, image=f)

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        post = super().create(validated_data)
        self._save_gallery_images(post, uploaded_images)
        return post

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        post = super().update(instance, validated_data)
        self._save_gallery_images(post, uploaded_images)
        return post


class PostListSerializer(SanitizedModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "title", "slug", "excerpt", "featured_image", "author_name", "is_active", "created_at"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not representation.get("excerpt"):
            content = instance.content or ""
            representation["excerpt"] = (content[:160] + "...") if len(content) > 160 else content
        return representation
