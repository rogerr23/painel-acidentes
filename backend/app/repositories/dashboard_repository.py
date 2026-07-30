from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.models.acidente import Acidente


class DashboardRepository:
    """Consultas agregadas usadas pelo dashboard."""

    @staticmethod
    def contar_total(session: Session) -> int:
        consulta = select(func.count(Acidente.id))
        return session.scalar(consulta) or 0

    @staticmethod
    def contar_por_gravidade(session: Session) -> list[tuple[str, int]]:
        consulta = (
            select(Acidente.gravidade, func.count(Acidente.id))
            .group_by(Acidente.gravidade)
            .order_by(Acidente.gravidade)
        )
        return [(gravidade, total) for gravidade, total in session.execute(consulta)]

    @staticmethod
    def contar_por_tipo(session: Session) -> list[tuple[str, int]]:
        consulta = (
            select(Acidente.tipo, func.count(Acidente.id))
            .group_by(Acidente.tipo)
            .order_by(Acidente.tipo)
        )
        return [(tipo, total) for tipo, total in session.execute(consulta)]

    @staticmethod
    def contar_por_bairro(session: Session) -> list[tuple[str, int]]:
        total = func.count(Acidente.id)
        consulta = (
            select(Acidente.bairro, total)
            .group_by(Acidente.bairro)
            .order_by(total.desc(), Acidente.bairro)
        )
        return [
            (bairro, quantidade)
            for bairro, quantidade in session.execute(consulta)
        ]
