from collections.abc import Sequence

from sqlalchemy.orm import Session

from backend.app.models.acidente import Acidente
from backend.app.schemas.acidente import AcidenteCreate


class AcidenteRepository:
    """Operações de persistência dos acidentes."""

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
