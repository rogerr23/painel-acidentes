from sqlalchemy.orm import Session

from backend.app.models.acidente import Acidente
from backend.app.repositories.acidente_repository import AcidenteRepository
from backend.app.schemas.acidente import (
    AcidenteMapaResponse,
    AcidenteResponse,
    AcidentesPaginados,
    OpcoesFiltrosAcidente,
)
from backend.app.schemas.filtros import FiltrosAcidente


class AcidenteService:
    """Coordena as consultas de acidentes."""

    def __init__(self, repository: type[AcidenteRepository] = AcidenteRepository):
        self.repository = repository

    def listar(
        self,
        session: Session,
        filtros: FiltrosAcidente,
        pagina: int,
        por_pagina: int,
    ) -> AcidentesPaginados:
        acidentes = self.repository.listar(
            session,
            filtros,
            pagina,
            por_pagina,
        )
        total = self.repository.contar(session, filtros)
        return AcidentesPaginados.criar(
            items=[
                AcidenteResponse.model_validate(acidente)
                for acidente in acidentes
            ],
            pagina=pagina,
            por_pagina=por_pagina,
            total=total,
        )

    def listar_mapa(
        self,
        session: Session,
        filtros: FiltrosAcidente,
    ) -> list[AcidenteMapaResponse]:
        return [
            AcidenteMapaResponse.model_validate(acidente)
            for acidente in self.repository.listar_mapa(session, filtros)
        ]

    def listar_opcoes_filtros(
        self,
        session: Session,
    ) -> OpcoesFiltrosAcidente:
        return OpcoesFiltrosAcidente(
            bairros=self.repository.listar_valores_distintos(
                session,
                "bairro",
            ),
            gravidades=self.repository.listar_valores_distintos(
                session,
                "gravidade",
            ),
            tipos=self.repository.listar_valores_distintos(
                session,
                "tipo",
            ),
        )

    def buscar_por_id(
        self,
        session: Session,
        acidente_id: int,
    ) -> Acidente | None:
        return self.repository.buscar_por_id(session, acidente_id)
