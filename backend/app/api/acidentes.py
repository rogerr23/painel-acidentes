from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, Query, status

from backend.app.api.dependencies import SessionDependency
from backend.app.models.acidente import Acidente
from backend.app.schemas.acidente import AcidenteResponse
from backend.app.schemas.filtros import FiltrosAcidente
from backend.app.services.acidente_service import AcidenteService


router = APIRouter(prefix="/acidentes", tags=["Acidentes"])
service = AcidenteService()


@router.get("", response_model=list[AcidenteResponse])
def listar_acidentes(
    session: SessionDependency,
    filtros: Annotated[FiltrosAcidente, Query()],
) -> list[Acidente]:
    """Lista todos os acidentes cadastrados."""
    return service.listar(session, filtros)


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
