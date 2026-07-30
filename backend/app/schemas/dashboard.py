from pydantic import BaseModel, Field


class DashboardResumo(BaseModel):
    """Indicadores gerais dos acidentes cadastrados."""

    total_acidentes: int = Field(ge=0)
    por_gravidade: dict[str, int]
    por_tipo: dict[str, int]


class BairroResumo(BaseModel):
    """Quantidade de acidentes registrada em um bairro."""

    bairro: str
    total: int = Field(ge=0)
