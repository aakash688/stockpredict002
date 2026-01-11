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
            current_price = get_real_time_price(item.stock_symbol)
            total_cost = item.quantity * item.purchase_price
            current_value = item.quantity * current_price
            profit_loss = current_value - total_cost
            profit_loss_percent = (profit_loss / total_cost * 100) if total_cost > 0 else 0
            
            result.append(PortfolioItem(
                id=item.id,
                stock_symbol=item.stock_symbol,
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
    # Verify stock exists
    try:
        get_stock_info(portfolio_data.stock_symbol.upper())
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found"
        )
    
    portfolio_item = Portfolio(
        user_id=current_user.id,
        stock_symbol=portfolio_data.stock_symbol.upper(),
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

