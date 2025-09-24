import logging
from django.db.models import Q 
from connections.models import BlockedUser

logger=logging.getLogger(__name__)

def get_blocked_user_ids(user):
    try:
        blocked_relations = BlockedUser.objects.filter(Q(blocker=user)|Q(blocked=user))

        blocked_ids=set()
        for rel in blocked_relations:
            if rel.blocker == user:
                blocked_ids.add(rel.blocked_id)
            else:
                blocked_ids.add(rel.blocker_id)
        return blocked_ids  
    except Exception as e:
        logger.exception(f"Error fetching blocked users for user {user.id}: {e}")
        return set() 