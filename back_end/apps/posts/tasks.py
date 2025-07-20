from celery import shared_task
from posts.models import Post
from common.cloudinary_utils import upload_to_cloudinary
import mimetypes

@shared_task
def upload_post_media_task(post_id):
    try:
        post = Post.objects.get(id=post_id)
        media = post.media

        if media:
            url = upload_to_cloudinary(media, folder_name=str(post.author.id))
            if url:
                mime_type, _ = mimetypes.guess_type(media.name)
                if mime_type and mime_type.startswith("image"):
                    post.image_url = url
                elif mime_type and mime_type.startswith("video"):
                    post.video_url = url
                    
                post.is_media_uploaded = True
                post.save()

    except Post.DoesNotExist:
        pass
