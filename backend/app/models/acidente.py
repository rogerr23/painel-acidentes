from datetime import date, time
from decimal import Decimal

from sqlalchemy import Date, Integer, Numeric, String, Time
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.database.base import Base


class Acidente(Base):
    """Registro de um acidente de trânsito."""

    __tablename__ = "acidentes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    data: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    hora: Mapped[time] = mapped_column(Time, nullable=False)
    tipo: Mapped[str] = mapped_column(String(100), nullable=False)
    gravidade: Mapped[str] = mapped_column(String(50), nullable=False)
    bairro: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    logradouro: Mapped[str] = mapped_column(String(200), nullable=False)
    latitude: Mapped[Decimal] = mapped_column(Numeric(9, 6), nullable=False)
    longitude: Mapped[Decimal] = mapped_column(Numeric(10, 6), nullable=False)
