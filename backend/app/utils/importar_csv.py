import argparse
from pathlib import Path

from backend.app.database.session import SessionLocal
from backend.app.services.importacao_csv_service import (
    ImportacaoCSVError,
    ImportacaoCSVService,
)


def criar_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Importa acidentes de um arquivo CSV para o PostgreSQL."
    )
    parser.add_argument(
        "arquivo",
        type=Path,
        help="Caminho do arquivo CSV separado por ponto e vírgula.",
    )
    return parser


def main() -> int:
    argumentos = criar_parser().parse_args()

    try:
        with SessionLocal() as session:
            resultado = ImportacaoCSVService().importar(
                argumentos.arquivo,
                session,
            )
    except ImportacaoCSVError as exc:
        print(f"Erro: {exc}")
        return 1

    print(resultado.model_dump_json(indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
