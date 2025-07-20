from rest_framework.pagination import PageNumberPagination

#User side paginations
class CustomCommunityPagination(PageNumberPagination):
    page_size = 6 #Number of data get in the intial loading
    page_size_query_param = 'page_size'
    max_page_size = 50 #Max limit

class CustomEventPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 50

class CustomConnectionPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 50

class CustomProductPagination(PageNumberPagination):
    page_size = 6 
    page_size_query_param = 'page_size'
    max_page_size = 50

class CustomPostPagination(PageNumberPagination):
    page_size = 5 
    page_size_query_param = 'page_size'
    max_page_size = 50

# Admin side pagniations
class CustomUserPagination(PageNumberPagination):
    page_size = 5 #Number of data get in the intial loading
    page_size_query_param = 'page_size'
    max_page_size = 50 #Max limit

class CustomAdminProductPagination(PageNumberPagination):
    page_size = 5 #Number of data get in the intial loading
    page_size_query_param = 'page_size'
    max_page_size = 50 #Max limit

class CustomAdminCommunityPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 50 

class CustomAdminEventPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 50 

class CustomAdminPostPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 50 

