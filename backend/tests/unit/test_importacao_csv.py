from pathlib import Path
from unittest.mock import MagicMock

import pytest
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.app.models.acidente import Acidente
from backend.app.services.importacao_csv_service import (
    ImportacaoCSVError,
    ImportacaoCSVService,
)


CABECALHO = (
    "data;hora;tipo;gravidade;bairro;logradouro;latitude;longitude\n"
)
LINHA_VALIDA = (
    "2026-06-01;08:30;Colisão;Leve;Centro;"
    "Avenida Rio Branco;-22.905411;-43.177580\n"
)


def escrever_csv(caminho: Path, conteudo: str) -> Path:
    caminho.write_text(conteudo, encoding="utf-8")
    return caminho


def test_importa_csv_valido(
    tmp_path: Path,
    db_session: Session,
) -> None:
    arquivo = escrever_csv(
        tmp_path / "valido.csv",
        CABECALHO + LINHA_VALIDA,
    )

    resultado = ImportacaoCSVService().importar(arquivo, db_session)
    total_banco = db_session.scalar(select(func.count(Acidente.id)))

    assert resultado.total == 1
    assert resultado.importados == 1
    assert resultado.ignorados == 0
    assert total_banco == 1


def test_ignora_linha_invalida_e_importa_valida(
    tmp_path: Path,
    db_session: Session,
) -> None:
    linha_invalida = (
        "2026-06-02;25:00;Colisão;Grave;Tijuca;"
        "Rua Conde de Bonfim;-22.926012;-43.234919\n"
    )
    arquivo = escrever_csv(
        tmp_path / "parcial.csv",
        CABECALHO + LINHA_VALIDA + linha_invalida,
    )

    resultado = ImportacaoCSVService().importar(arquivo, db_session)

    assert resultado.total == 2
    assert resultado.importados == 1
    assert resultado.ignorados == 1
    assert resultado.erros[0].linha == 3


def test_rejeita_csv_sem_coluna_obrigatoria(tmp_path: Path) -> None:
    arquivo = escrever_csv(
        tmp_path / "sem_longitude.csv",
        "data;hora;tipo;gravidade;bairro;logradouro;latitude\n"
        "2026-06-01;08:30;Colisão;Leve;Centro;"
        "Avenida Rio Branco;-22.905411\n",
    )

    with pytest.raises(
        ImportacaoCSVError,
        match="Colunas obrigatórias ausentes: longitude",
    ):
        ImportacaoCSVService()._ler_csv(arquivo)


def test_faz_rollback_quando_banco_falha(tmp_path: Path) -> None:
    arquivo = escrever_csv(
        tmp_path / "falha.csv",
        CABECALHO + LINHA_VALIDA,
    )
    repository = MagicMock()
    repository.adicionar_varios.side_effect = SQLAlchemyError("falha")
    session = MagicMock(spec=Session)

    with pytest.raises(ImportacaoCSVError):
        ImportacaoCSVService(repository).importar(arquivo, session)

    session.rollback.assert_called_once()
    session.commit.assert_not_called()
