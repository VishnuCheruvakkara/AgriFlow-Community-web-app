import logging
import time
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import mimetypes
from django.core.exceptions import ValidationError
import cloudinary.uploader

logger=logging.getLogger(__name__)

# Common image uploading and retrieving functions 
def upload_image_to_cloudinary(image_file, folder_name):
    """  
    Securely uploads an image to Cloudinary with authenticated access.
    Returns the public_id for later retrieval.   
    """    
    try:

        max_size = 5 * 1024 * 1024  # 5 MB
        if image_file.size > max_size:
            raise ValidationError(f"Image size exceeds 5 MB limit: {image_file.name}")
        
        result = cloudinary.uploader.upload(
            image_file,
            folder=f"private_files/{folder_name}/",
            resource_type="image",
            type="authenticated",  # ensures private storage
            transformation=[
                {"width": 500, "height": 500, "crop": "limit"},
                {"quality": "auto:good"},
                {"fetch_format": "auto"}
            ]
        )
        return result["public_id"]
    except Exception as e:
        logger.exception(f"Cloudinary upload failed : {e}")
        return None

#from public_id generate the secure URL  
def generate_secure_image_url(public_id, expires_in=3600):
    """
    Generates a secure signed URL to access the private image.
    :param public_id: Stored Cloudinary public ID.
    :param expires_in: URL validity in seconds (default 1 hour).
    """
    if not public_id:
        return ""
    try:
        secure_url, _ = cloudinary_url(
            public_id,
            type="authenticated",
            secure=True,
            sign_url=True,
            sign_valid_until=int(time.time()) + expires_in
        )
        return secure_url
    except Exception as e:
        logger.exception(f"Failed to generate secure URL for {public_id}: {e}")
        return ""


def upload_to_cloudinary(file_obj, folder_name):
    """
    Uploads image or video to Cloudinary securely.
    Rejects all other file types.
    Returns a signed private URL.
    """
    try:
        mime_type, _ = mimetypes.guess_type(file_obj.name)

        if not mime_type:
            raise ValidationError("Unable to detect file type.")

        if mime_type.startswith("image"):
            resource_type = "image"
            max_size = 5 * 1024 * 1024
        elif mime_type.startswith("video"):
            resource_type = "video"
            max_size = 20 * 1024 * 1024
        else:
            raise ValidationError("Only image and video files are allowed.")

        if file_obj.size > max_size:
            raise ValidationError(
                f"{resource_type.capitalize()} size exceeds {max_size // (1024 * 1024)} MB limit."
            )

        result = cloudinary.uploader.upload(
            file_obj,
            folder=f"private_files/{folder_name}/",
            resource_type=resource_type,
            type="authenticated",
            transformation=[
                {"width": 500, "height": 500, "crop": "limit"},
                {"quality": "auto:good"},
                {"fetch_format": "auto"}
            ] if resource_type == "image" else None
        )

        return result.get("secure_url")

    except ValidationError as ve:
        logger.warning(f"Validation error for {file_obj}: {ve}")
        return None
    except Exception as e:
        logger.exception(f"Cloudinary upload failed for {file_obj}: {e}")
        return None

# Upload the image and get the secure url 
def upload_image_and_get_url(image_file, folder_name):
    """
    Uploads an image to Cloudinary under a private folder, returns the secure URL.
    """
    try:

        max_size = 5 * 1024 * 1024 
        if image_file.size > max_size:
            raise ValidationError(f"Image size exceeds 5 MB limit: {image_file.name}")
            
        
        result = cloudinary.uploader.upload(
            image_file,
            folder=f"private_files/{folder_name}/",
            resource_type="image",
            type="authenticated",  # private access
            transformation=[
                {"width": 500, "height": 500, "crop": "limit"},
                {"quality": "auto:good"},
                {"fetch_format": "auto"}
            ]
        )
        return result.get("secure_url")
    except Exception as e:
        logger.exception(f"Cloudinary upload failed for {image_file}: {e}")
        return None