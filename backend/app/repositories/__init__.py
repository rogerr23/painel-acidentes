"""Acesso e consultas aos dados."""

from backend.app.repositories.acidente_repository import AcidenteRepository
from backend.app.repositories.dashboard_repository import DashboardRepository

__all__ = ["AcidenteRepository", "DashboardRepository"]
