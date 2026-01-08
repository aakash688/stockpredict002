from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.dependencies import get_current_admin_user
from app.models.user import User
from app.models.watchlist import Watchlist
from app.models.portfolio import Portfolio
from app.schemas.user import UserResponse
from app.schemas.admin import AdminStats, UserStatusUpdate

router = APIRouter()


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/stats", response_model=AdminStats)
async def get_stats(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    total_watchlists = db.query(func.count(Watchlist.id)).scalar()
    total_portfolios = db.query(func.count(Portfolio.id)).scalar()
    
    return AdminStats(
        total_users=total_users,
        active_users=active_users,
        total_watchlists=total_watchlists,
        total_portfolios=total_portfolios
    )


@router.put("/users/{user_id}/status", response_model=UserResponse)
async def update_user_status(
    user_id: int,
    status_update: UserStatusUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify your own status"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if status_update.is_active is not None:
        user.is_active = status_update.is_active
    if status_update.is_admin is not None:
        user.is_admin = status_update.is_admin
    
    db.commit()
    db.refresh(user)
    return user

