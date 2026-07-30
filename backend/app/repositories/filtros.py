from typing import Any

from sqlalchemy import func
from sqlalchemy.sql import Select

from backend.app.models.acidente import Acidente
from backend.app.schemas.filtros import FiltrosAcidente


def aplicar_filtros(
    consulta: Select[Any],
    filtros: FiltrosAcidente,
) -> Select[Any]:
    """Adiciona à consulta somente os filtros informados."""
    if filtros.bairro is not None:
        consulta = consulta.where(
            func.lower(Acidente.bairro) == filtros.bairro.lower()
        )
    if filtros.gravidade is not None:
        consulta = consulta.where(
            func.lower(Acidente.gravidade) == filtros.gravidade.lower()
        )
    if filtros.tipo is not None:
        consulta = consulta.where(
            func.lower(Acidente.tipo) == filtros.tipo.lower()
        )
    if filtros.data_inicio is not None:
        consulta = consulta.where(Acidente.data >= filtros.data_inicio)
    if filtros.data_fim is not None:
        consulta = consulta.where(Acidente.data <= filtros.data_fim)

    return consulta
