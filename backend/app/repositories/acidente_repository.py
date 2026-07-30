from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.acidente import Acidente
from backend.app.schemas.acidente import AcidenteCreate


class AcidenteRepository:
    """Operações de persistência dos acidentes."""

    @staticmethod
    def listar(session: Session) -> list[Acidente]:
        consulta = select(Acidente).order_by(Acidente.id)
        return list(session.scalars(consulta).all())

    @staticmethod
    def buscar_por_id(
        session: Session,
        acidente_id: int,
    ) -> Acidente | None:
        return session.get(Acidente, acidente_id)

    @staticmethod
    def adicionar_varios(
        session: Session,
        acidentes: Sequence[AcidenteCreate],
    ) -> int:
        modelos = [
            Acidente(**acidente.model_dump())
            for acidente in acidentes
        ]
        session.add_all(modelos)
        session.flush()
        return len(modelos)
