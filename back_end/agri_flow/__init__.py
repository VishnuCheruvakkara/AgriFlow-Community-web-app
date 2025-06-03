# Initialize celery in agri_flow 

from .celery import app as celery_app 
__all__= ["celery_app"]