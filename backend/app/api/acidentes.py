from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, Query, status

from backend.app.api.dependencies import SessionDependency
from backend.app.models.acidente import Acidente
from backend.app.schemas.acidente import (
    AcidenteMapaResponse,
    AcidenteResponse,
    AcidentesPaginados,
    OpcoesFiltrosAcidente,
)
from backend.app.schemas.filtros import ConsultaAcidentes, FiltrosAcidente
from backend.app.services.acidente_service import AcidenteService


router = APIRouter(prefix="/acidentes", tags=["Acidentes"])
service = AcidenteService()


@router.get("", response_model=AcidentesPaginados)
def listar_acidentes(
    session: SessionDependency,
    consulta: Annotated[ConsultaAcidentes, Query()],
) -> AcidentesPaginados:
    """Lista os acidentes cadastrados de forma paginada."""
    return service.listar(
        session,
        consulta,
        consulta.pagina,
        consulta.por_pagina,
    )


@router.get("/filtros/opcoes", response_model=OpcoesFiltrosAcidente)
def listar_opcoes_filtros(
    session: SessionDependency,
) -> OpcoesFiltrosAcidente:
    """Retorna os valores disponíveis para os filtros da interface."""
    return service.listar_opcoes_filtros(session)


@router.get("/mapa", response_model=list[AcidenteMapaResponse])
def listar_acidentes_mapa(
    session: SessionDependency,
    filtros: Annotated[FiltrosAcidente, Query()],
) -> list[AcidenteMapaResponse]:
    """Lista, sem paginação, os campos necessários para o mapa."""
    return service.listar_mapa(session, filtros)


@router.get("/{acidente_id}", response_model=AcidenteResponse)
def buscar_acidente(
    acidente_id: Annotated[int, Path(gt=0)],
    session: SessionDependency,
) -> Acidente:
    """Busca um acidente pelo identificador."""
    acidente = service.buscar_por_id(session, acidente_id)
    if acidente is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Acidente não encontrado.",
        )
    return acidente
