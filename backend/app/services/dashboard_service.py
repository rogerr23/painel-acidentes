from sqlalchemy.orm import Session

from backend.app.repositories.dashboard_repository import DashboardRepository
from backend.app.schemas.dashboard import BairroResumo, DashboardResumo


class DashboardService:
    """Monta os indicadores apresentados pelo dashboard."""

    def __init__(
        self,
        repository: type[DashboardRepository] = DashboardRepository,
    ):
        self.repository = repository

    def obter_resumo(self, session: Session) -> DashboardResumo:
        return DashboardResumo(
            total_acidentes=self.repository.contar_total(session),
            por_gravidade=dict(
                self.repository.contar_por_gravidade(session)
            ),
            por_tipo=dict(self.repository.contar_por_tipo(session)),
        )

    def listar_bairros(self, session: Session) -> list[BairroResumo]:
        return [
            BairroResumo(bairro=bairro, total=total)
            for bairro, total in self.repository.contar_por_bairro(session)
        ]
