from django.contrib import admin
from .models import Post, PostImage


class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 0


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author_name", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("title", "content", "author_name")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PostImageInline]
