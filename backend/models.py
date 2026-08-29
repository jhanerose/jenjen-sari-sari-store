from typing import Literal, Optional
from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    category: Optional[str] = Field(default=None, max_length=60)
    unit: Optional[str] = Field(default="pcs", max_length=20)
    price: float = Field(default=0.0, ge=0)
    quantity: int = Field(default=0, ge=0)
    reorder_level: int = Field(default=0, ge=0)


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    category: Optional[str] = Field(default=None, max_length=60)
    unit: Optional[str] = Field(default=None, max_length=20)
    price: Optional[float] = Field(default=None, ge=0)
    quantity: Optional[int] = Field(default=None, ge=0)
    reorder_level: Optional[int] = Field(default=None, ge=0)


class ProductOut(BaseModel):
    id: int
    name: str
    category: Optional[str] = None
    unit: Optional[str] = None
    price: float
    quantity: int
    reorder_level: int
    created_at: str
    updated_at: str


class PaginatedProducts(BaseModel):
    data: list[ProductOut]
    page: int
    page_size: int
    total: int
    total_pages: int


class TransactionCreate(BaseModel):
    type: Literal["IN", "OUT"]
    quantity: int = Field(..., gt=0)
    note: Optional[str] = Field(default=None, max_length=200)


class TransactionOut(BaseModel):
    id: int
    product_id: int
    type: Literal["IN", "OUT"]
    quantity: int
    note: Optional[str] = None
    created_at: str
