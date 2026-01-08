from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.watchlist import Watchlist
from app.schemas.watchlist import WatchlistCreate, WatchlistResponse, WatchlistItem
from app.services.stock_service import get_real_time_price, get_stock_info

router = APIRouter()


@router.get("", response_model=List[WatchlistItem])
async def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    watchlist_items = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id
    ).all()
    
    result = []
    for item in watchlist_items:
        try:
            stock_info = get_stock_info(item.stock_symbol)
            result.append(WatchlistItem(
                id=item.id,
                stock_symbol=item.stock_symbol,
                added_at=item.added_at,
                notes=item.notes,
                current_price=stock_info.current_price,
                change=stock_info.change,
                change_percent=stock_info.change_percent
            ))
        except Exception:
            result.append(WatchlistItem(
                id=item.id,
                stock_symbol=item.stock_symbol,
                added_at=item.added_at,
                notes=item.notes
            ))
    
    return result


@router.post("", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
async def add_to_watchlist(
    watchlist_data: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if already in watchlist
    existing = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.stock_symbol == watchlist_data.stock_symbol.upper()
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock already in watchlist"
        )
    
    # Verify stock exists
    try:
        get_stock_info(watchlist_data.stock_symbol.upper())
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found"
        )
    
    watchlist_item = Watchlist(
        user_id=current_user.id,
        stock_symbol=watchlist_data.stock_symbol.upper(),
        notes=watchlist_data.notes
    )
    
    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)
    
    return watchlist_item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_watchlist(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    watchlist_item = db.query(Watchlist).filter(
        Watchlist.id == item_id,
        Watchlist.user_id == current_user.id
    ).first()
    
    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watchlist item not found"
        )
    
    db.delete(watchlist_item)
    db.commit()
    return None

