from pydantic import BaseModel
from typing import Optional


class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_watchlists: int
    total_portfolios: int


class UserStatusUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None

