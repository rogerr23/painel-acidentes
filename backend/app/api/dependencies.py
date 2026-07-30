from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from backend.app.database.session import SessionLocal


def get_session() -> Iterator[Session]:
    """Disponibiliza uma sessão do banco durante a requisição."""
    with SessionLocal() as session:
        yield session


SessionDependency = Annotated[Session, Depends(get_session)]
