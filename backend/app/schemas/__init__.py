"""Schemas Pydantic da aplicação."""

from backend.app.schemas.acidente import AcidenteCreate, AcidenteResponse
from backend.app.schemas.dashboard import BairroResumo, DashboardResumo
from backend.app.schemas.filtros import FiltrosAcidente
from backend.app.schemas.importacao import ErroImportacao, ResultadoImportacao

__all__ = [
    "AcidenteCreate",
    "AcidenteResponse",
    "BairroResumo",
    "DashboardResumo",
    "ErroImportacao",
    "FiltrosAcidente",
    "ResultadoImportacao",
]
