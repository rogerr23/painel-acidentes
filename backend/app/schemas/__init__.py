"""Schemas Pydantic da aplicação."""

from backend.app.schemas.acidente import AcidenteCreate, AcidenteResponse
from backend.app.schemas.importacao import ErroImportacao, ResultadoImportacao

__all__ = [
    "AcidenteCreate",
    "AcidenteResponse",
    "ErroImportacao",
    "ResultadoImportacao",
]
