"""Cria a tabela de acidentes.

Revision ID: 20260730_01
Revises:
Create Date: 2026-07-30
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260730_01"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Cria a tabela e seus índices."""
    op.create_table(
        "acidentes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("data", sa.Date(), nullable=False),
        sa.Column("hora", sa.Time(), nullable=False),
        sa.Column("tipo", sa.String(length=100), nullable=False),
        sa.Column("gravidade", sa.String(length=50), nullable=False),
        sa.Column("bairro", sa.String(length=120), nullable=False),
        sa.Column("latitude", sa.Numeric(precision=9, scale=6), nullable=False),
        sa.Column("longitude", sa.Numeric(precision=10, scale=6), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_acidentes_bairro"), "acidentes", ["bairro"])
    op.create_index(op.f("ix_acidentes_data"), "acidentes", ["data"])


def downgrade() -> None:
    """Remove a tabela e seus índices."""
    op.drop_index(op.f("ix_acidentes_data"), table_name="acidentes")
    op.drop_index(op.f("ix_acidentes_bairro"), table_name="acidentes")
    op.drop_table("acidentes")
