from datetime import date, time
from decimal import Decimal
from math import ceil

from pydantic import BaseModel, ConfigDict, Field


class AcidenteBase(BaseModel):
    """Campos compartilhados pelos schemas de acidente."""

    data: date
    hora: time
    tipo: str = Field(min_length=1, max_length=100)
    gravidade: str = Field(min_length=1, max_length=50)
    bairro: str = Field(min_length=1, max_length=120)
    logradouro: str = Field(min_length=1, max_length=200)
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


class AcidenteMapaResponse(BaseModel):
    """Campos necessários para representar um acidente no mapa."""

    id: int
    latitude: Decimal
    longitude: Decimal
    tipo: str
    gravidade: str
    bairro: str
    data: date
    hora: time

    model_config = ConfigDict(from_attributes=True)


class AcidentesPaginados(BaseModel):
    """Página de acidentes acompanhada dos metadados de navegação."""

    items: list[AcidenteResponse]
    pagina: int = Field(ge=1)
    por_pagina: int = Field(ge=1)
    total: int = Field(ge=0)
    total_paginas: int = Field(ge=0)

    @classmethod
    def criar(
        cls,
        items: list[AcidenteResponse],
        pagina: int,
        por_pagina: int,
        total: int,
    ) -> "AcidentesPaginados":
        return cls(
            items=items,
            pagina=pagina,
            por_pagina=por_pagina,
            total=total,
            total_paginas=ceil(total / por_pagina),
        )


class OpcoesFiltrosAcidente(BaseModel):
    """Valores existentes que podem preencher os seletores do frontend."""

    bairros: list[str]
    gravidades: list[str]
    tipos: list[str]
