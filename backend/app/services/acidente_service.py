from sqlalchemy.orm import Session

from backend.app.models.acidente import Acidente
from backend.app.repositories.acidente_repository import AcidenteRepository


class AcidenteService:
    """Coordena as consultas de acidentes."""

    def __init__(self, repository: type[AcidenteRepository] = AcidenteRepository):
        self.repository = repository

    def listar(self, session: Session) -> list[Acidente]:
        return self.repository.listar(session)

    def buscar_por_id(
        self,
        session: Session,
        acidente_id: int,
    ) -> Acidente | None:
        return self.repository.buscar_por_id(session, acidente_id)
