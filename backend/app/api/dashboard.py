from fastapi import APIRouter

from backend.app.api.dependencies import SessionDependency
from backend.app.schemas.dashboard import BairroResumo, DashboardResumo
from backend.app.services.dashboard_service import DashboardService


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
service = DashboardService()


@router.get("/resumo", response_model=DashboardResumo)
def obter_resumo(session: SessionDependency) -> DashboardResumo:
    """Retorna indicadores gerais dos acidentes."""
    return service.obter_resumo(session)


@router.get("/bairros", response_model=list[BairroResumo])
def listar_bairros(session: SessionDependency) -> list[BairroResumo]:
    """Retorna a quantidade de acidentes agrupada por bairro."""
    return service.listar_bairros(session)
