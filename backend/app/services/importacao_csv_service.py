from datetime import date, datetime, time
from decimal import Decimal, InvalidOperation
from pathlib import Path

import pandas as pd
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.app.repositories.acidente_repository import AcidenteRepository
from backend.app.schemas.acidente import AcidenteCreate
from backend.app.schemas.importacao import ErroImportacao, ResultadoImportacao


class ImportacaoCSVError(ValueError):
    """Erro que impede o processamento completo do arquivo CSV."""


class ImportacaoCSVService:
    """Valida e importa acidentes de um arquivo CSV."""

    COLUNAS_OBRIGATORIAS = {
        "data",
        "hora",
        "tipo",
        "gravidade",
        "bairro",
        "logradouro",
        "latitude",
        "longitude",
    }

    def __init__(self, repository: type[AcidenteRepository] = AcidenteRepository):
        self.repository = repository

    def importar(
        self,
        caminho_csv: str | Path,
        session: Session,
    ) -> ResultadoImportacao:
        dataframe = self._ler_csv(Path(caminho_csv))
        acidentes_validos: list[AcidenteCreate] = []
        erros: list[ErroImportacao] = []

        for indice, linha in dataframe.iterrows():
            numero_linha = int(indice) + 2
            try:
                acidentes_validos.append(self._converter_linha(linha))
            except (InvalidOperation, TypeError, ValueError, ValidationError) as exc:
                erros.append(
                    ErroImportacao(
                        linha=numero_linha,
                        motivo=self._formatar_erro(exc),
                    )
                )

        try:
            importados = self.repository.adicionar_varios(
                session,
                acidentes_validos,
            )
            session.commit()
        except SQLAlchemyError as exc:
            session.rollback()
            raise ImportacaoCSVError(
                "Não foi possível inserir os acidentes no PostgreSQL."
            ) from exc

        return ResultadoImportacao(
            total=len(dataframe),
            importados=importados,
            ignorados=len(erros),
            erros=erros,
        )

    def _ler_csv(self, caminho_csv: Path) -> pd.DataFrame:
        if not caminho_csv.is_file():
            raise ImportacaoCSVError(f"Arquivo não encontrado: {caminho_csv}")

        try:
            dataframe = pd.read_csv(
                caminho_csv,
                sep=";",
                dtype=str,
                keep_default_na=False,
                encoding="utf-8-sig",
            )
        except (OSError, pd.errors.ParserError, pd.errors.EmptyDataError) as exc:
            raise ImportacaoCSVError(
                f"Não foi possível ler o CSV: {caminho_csv}"
            ) from exc

        dataframe.columns = [
            str(coluna).strip().lower()
            for coluna in dataframe.columns
        ]

        if dataframe.columns.duplicated().any():
            raise ImportacaoCSVError(
                "O CSV contém nomes de colunas duplicados."
            )

        colunas_ausentes = self.COLUNAS_OBRIGATORIAS - set(dataframe.columns)
        if colunas_ausentes:
            nomes = ", ".join(sorted(colunas_ausentes))
            raise ImportacaoCSVError(
                f"Colunas obrigatórias ausentes: {nomes}"
            )

        return dataframe

    @staticmethod
    def _converter_linha(linha: pd.Series) -> AcidenteCreate:
        return AcidenteCreate(
            data=ImportacaoCSVService._converter_data(linha["data"]),
            hora=ImportacaoCSVService._converter_hora(linha["hora"]),
            tipo=linha["tipo"].strip(),
            gravidade=linha["gravidade"].strip(),
            bairro=linha["bairro"].strip(),
            logradouro=linha["logradouro"].strip(),
            latitude=ImportacaoCSVService._converter_coordenada(
                linha["latitude"],
                "latitude",
            ),
            longitude=ImportacaoCSVService._converter_coordenada(
                linha["longitude"],
                "longitude",
            ),
        )

    @staticmethod
    def _converter_data(valor: str) -> date:
        try:
            return date.fromisoformat(valor.strip())
        except ValueError as exc:
            raise ValueError(
                "data: use o formato AAAA-MM-DD."
            ) from exc

    @staticmethod
    def _converter_hora(valor: str) -> time:
        try:
            return datetime.strptime(valor.strip(), "%H:%M").time()
        except ValueError as exc:
            raise ValueError(
                "hora: use um horário válido no formato HH:MM."
            ) from exc

    @staticmethod
    def _converter_coordenada(valor: str, campo: str) -> Decimal:
        try:
            return Decimal(valor.strip().replace(",", "."))
        except InvalidOperation as exc:
            raise ValueError(f"{campo}: informe um número válido.") from exc

    @staticmethod
    def _formatar_erro(
        erro: InvalidOperation | TypeError | ValueError | ValidationError,
    ) -> str:
        if isinstance(erro, ValidationError):
            primeiro_erro = erro.errors()[0]
            campo = ".".join(str(item) for item in primeiro_erro["loc"])
            tipo = primeiro_erro["type"]
            contexto = primeiro_erro.get("ctx", {})

            if tipo == "string_too_short":
                return f"{campo}: campo obrigatório e não pode ficar vazio."
            if tipo == "greater_than_equal":
                return f"{campo}: deve ser maior ou igual a {contexto['ge']}."
            if tipo == "less_than_equal":
                return f"{campo}: deve ser menor ou igual a {contexto['le']}."

            return f"{campo}: {primeiro_erro['msg']}"
        return str(erro) or "Valor inválido."
