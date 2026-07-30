from pydantic import BaseModel, Field


class ErroImportacao(BaseModel):
    """Motivo pelo qual uma linha do CSV foi ignorada."""

    linha: int = Field(ge=2)
    motivo: str


class ResultadoImportacao(BaseModel):
    """Resumo da importação de um arquivo CSV."""

    total: int = Field(ge=0)
    importados: int = Field(ge=0)
    ignorados: int = Field(ge=0)
    erros: list[ErroImportacao] = Field(default_factory=list)
