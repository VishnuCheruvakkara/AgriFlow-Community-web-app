from celery import shared_task
from .models import Post
from common.cloudinary_utils import upload_to_cloudinary
from django.core.files.base import ContentFile
import mimetypes
import base64

@shared_task(name='posts.tasks.upload_media_task')
def upload_media_task(post_id, media_name, media_content):
    post = Post.objects.get(id=post_id)

    # Reconstruct the file
    file_obj = ContentFile(base64.b64decode(media_content), name=media_name)
    mime_type, _ = mimetypes.guess_type(media_name)

    if mime_type:
        secure_url = upload_to_cloudinary(file_obj, folder_name='posts')

        if mime_type.startswith("image"):
            post.image_url = secure_url
        elif mime_type.startswith("video"):
            post.video_url = secure_url
        
        post.save()
