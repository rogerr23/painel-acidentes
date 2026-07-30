from sqlalchemy.orm import Session

from backend.app.repositories.dashboard_repository import DashboardRepository
from backend.app.schemas.dashboard import BairroResumo, DashboardResumo
from backend.app.schemas.filtros import FiltrosAcidente


class DashboardService:
    """Monta os indicadores apresentados pelo dashboard."""

    def __init__(
        self,
        repository: type[DashboardRepository] = DashboardRepository,
    ):
        self.repository = repository

    def obter_resumo(
        self,
        session: Session,
        filtros: FiltrosAcidente,
    ) -> DashboardResumo:
        return DashboardResumo(
            total_acidentes=self.repository.contar_total(session, filtros),
            por_gravidade=dict(
                self.repository.contar_por_gravidade(session, filtros)
            ),
            por_tipo=dict(
                self.repository.contar_por_tipo(session, filtros)
            ),
        )

    def listar_bairros(
        self,
        session: Session,
        filtros: FiltrosAcidente,
    ) -> list[BairroResumo]:
        return [
            BairroResumo(bairro=bairro, total=total)
            for bairro, total in self.repository.contar_por_bairro(
                session,
                filtros,
            )
        ]
