from datetime import date, time
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class AcidenteBase(BaseModel):
    """Campos compartilhados pelos schemas de acidente."""

    data: date
    hora: time
    tipo: str = Field(min_length=1, max_length=100)
    gravidade: str = Field(min_length=1, max_length=50)
    bairro: str = Field(min_length=1, max_length=120)
    latitude: Decimal = Field(
        ge=Decimal("-90"),
        le=Decimal("90"),
        max_digits=8,
        decimal_places=6,
    )
    longitude: Decimal = Field(
        ge=Decimal("-180"),
        le=Decimal("180"),
        max_digits=9,
        decimal_places=6,
    )


class AcidenteCreate(AcidenteBase):
    """Dados necessários para cadastrar um acidente."""


class AcidenteResponse(AcidenteBase):
    """Representação de um acidente devolvida pela API."""

    id: int

    model_config = ConfigDict(from_attributes=True)
