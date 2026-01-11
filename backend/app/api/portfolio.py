from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.portfolio import Portfolio
from app.schemas.portfolio import PortfolioCreate, PortfolioResponse, PortfolioItem
from app.services.stock_service import get_real_time_price, get_stock_info

router = APIRouter()


@router.get("", response_model=List[PortfolioItem])
async def get_portfolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio_items = db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id
    ).all()
    
    result = []
    for item in portfolio_items:
        try:
            stock_info = get_stock_info(item.stock_symbol)
            current_price = stock_info.current_price
            stock_name = stock_info.name
            total_cost = item.quantity * item.purchase_price
            current_value = item.quantity * current_price
            profit_loss = current_value - total_cost
            profit_loss_percent = (profit_loss / total_cost * 100) if total_cost > 0 else 0
            
            result.append(PortfolioItem(
                id=item.id,
                stock_symbol=item.stock_symbol,
                stock_name=stock_name,
                quantity=item.quantity,
                purchase_price=item.purchase_price,
                purchase_date=item.purchase_date,
                current_price=current_price,
                total_cost=total_cost,
                current_value=current_value,
                profit_loss=profit_loss,
                profit_loss_percent=profit_loss_percent
            ))
        except Exception:
            result.append(PortfolioItem(
                id=item.id,
                stock_symbol=item.stock_symbol,
                stock_name=None,
                quantity=item.quantity,
                purchase_price=item.purchase_price,
                purchase_date=item.purchase_date
            ))
    
    return result


@router.post("", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def add_to_portfolio(
    portfolio_data: PortfolioCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    symbol = portfolio_data.stock_symbol.upper().strip()
    
    # Basic validation - check symbol format
    if not symbol or len(symbol) < 1 or len(symbol) > 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid stock symbol format"
        )
    
    # Try to verify stock exists, but don't fail if API is rate-limited
    # Since user selected from search dropdown, the symbol is likely valid
    try:
        get_stock_info(symbol)
    except ValueError as e:
        error_msg = str(e)
        # If it's a rate limit issue, allow the add anyway (user selected from valid search)
        if "rate" in error_msg.lower() or "unavailable" in error_msg.lower() or "wait" in error_msg.lower():
            # Log but proceed - user selected from valid search dropdown
            print(f"Warning: Could not verify stock {symbol} due to API limits, proceeding anyway")
        else:
            # Genuine stock not found
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Stock '{symbol}' not found. Please verify the symbol is correct."
            )
    except Exception as e:
        # For other exceptions, also be lenient if it looks like an API issue
        error_msg = str(e).lower()
        if "timeout" in error_msg or "connection" in error_msg or "429" in error_msg:
            print(f"Warning: Could not verify stock {symbol} due to API error, proceeding anyway")
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Could not verify stock '{symbol}'. Please try again."
            )
    
    # Check if already in portfolio (optional - allow multiple entries for same stock)
    # Users might want to track different purchases separately
    
    portfolio_item = Portfolio(
        user_id=current_user.id,
        stock_symbol=symbol,
        quantity=portfolio_data.quantity,
        purchase_price=portfolio_data.purchase_price,
        purchase_date=portfolio_data.purchase_date
    )
    
    db.add(portfolio_item)
    db.commit()
    db.refresh(portfolio_item)
    
    return portfolio_item


@router.put("/{item_id}", response_model=PortfolioResponse)
async def update_portfolio(
    item_id: int,
    portfolio_data: PortfolioCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio_item = db.query(Portfolio).filter(
        Portfolio.id == item_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found"
        )
    
    portfolio_item.stock_symbol = portfolio_data.stock_symbol.upper()
    portfolio_item.quantity = portfolio_data.quantity
    portfolio_item.purchase_price = portfolio_data.purchase_price
    portfolio_item.purchase_date = portfolio_data.purchase_date
    
    db.commit()
    db.refresh(portfolio_item)
    
    return portfolio_item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_portfolio(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio_item = db.query(Portfolio).filter(
        Portfolio.id == item_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found"
        )
    
    db.delete(portfolio_item)
    db.commit()
    return None

