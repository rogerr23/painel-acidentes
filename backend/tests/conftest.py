from collections.abc import Callable, Iterator
from datetime import date, time
from decimal import Decimal
import os

from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session

from backend.app.api.dependencies import get_session
from backend.app.main import app
from backend.app.models.acidente import Acidente


TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql+psycopg://admin:roger@localhost:5433/"
    "painel_acidentes_test",
)


@pytest.fixture(scope="session")
def database_engine() -> Iterator[Engine]:
    alembic_config = Config("alembic.ini")
    alembic_config.set_main_option("sqlalchemy.url", TEST_DATABASE_URL)
    command.upgrade(alembic_config, "head")

    engine = create_engine(TEST_DATABASE_URL)
    with engine.begin() as connection:
        connection.execute(text("TRUNCATE TABLE acidentes RESTART IDENTITY"))

    yield engine
    engine.dispose()


@pytest.fixture
def db_session(database_engine: Engine) -> Iterator[Session]:
    connection = database_engine.connect()
    transaction = connection.begin()
    session = Session(
        bind=connection,
        join_transaction_mode="create_savepoint",
    )

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session: Session) -> Iterator[TestClient]:
    def substituir_sessao() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_session] = substituir_sessao
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def acidente_factory(
    db_session: Session,
) -> Callable[..., Acidente]:
    contador = 0

    def criar(**alteracoes: object) -> Acidente:
        nonlocal contador
        contador += 1
        dados: dict[str, object] = {
            "data": date(2026, 1, contador),
            "hora": time(8, 30),
            "tipo": "Colisão",
            "gravidade": "Leve",
            "bairro": "Centro",
            "logradouro": "Avenida Rio Branco",
            "latitude": Decimal("-22.905411"),
            "longitude": Decimal("-43.177580"),
        }
        dados.update(alteracoes)
        acidente = Acidente(**dados)
        db_session.add(acidente)
        db_session.flush()
        return acidente

    return criar
