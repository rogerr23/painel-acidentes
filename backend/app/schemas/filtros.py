from datetime import date

from pydantic import BaseModel, ConfigDict, Field, model_validator


class FiltrosAcidente(BaseModel):
    """Filtros opcionais aplicáveis às consultas de acidentes."""

    bairro: str | None = Field(default=None, min_length=1, max_length=120)
    gravidade: str | None = Field(default=None, min_length=1, max_length=50)
    tipo: str | None = Field(default=None, min_length=1, max_length=100)
    data_inicio: date | None = None
    data_fim: date | None = None

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    @model_validator(mode="after")
    def validar_periodo(self) -> "FiltrosAcidente":
        if (
            self.data_inicio is not None
            and self.data_fim is not None
            and self.data_inicio > self.data_fim
        ):
            raise ValueError(
                "data_inicio deve ser anterior ou igual a data_fim."
            )
        return self


class ConsultaAcidentes(FiltrosAcidente):
    """Filtros e paginação aceitos pela listagem de acidentes."""

    pagina: int = Field(default=1, ge=1)
    por_pagina: int = Field(default=20, ge=1, le=100)
