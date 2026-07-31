from datetime import date, time
from decimal import Decimal

from pydantic import ValidationError
import pytest

from backend.app.schemas.acidente import AcidenteCreate
from backend.app.schemas.filtros import FiltrosAcidente


def dados_validos() -> dict[str, object]:
    return {
        "data": date(2026, 1, 10),
        "hora": time(8, 30),
        "tipo": "Colisão",
        "gravidade": "Leve",
        "bairro": "Centro",
        "logradouro": "Avenida Rio Branco",
        "latitude": Decimal("-22.905411"),
        "longitude": Decimal("-43.177580"),
    }


def test_schema_aceita_acidente_valido() -> None:
    acidente = AcidenteCreate(**dados_validos())

    assert acidente.bairro == "Centro"
    assert acidente.latitude == Decimal("-22.905411")


def test_schema_rejeita_coordenada_invalida() -> None:
    dados = dados_validos()
    dados["latitude"] = Decimal("-95")

    with pytest.raises(ValidationError):
        AcidenteCreate(**dados)


def test_filtros_rejeitam_periodo_invalido() -> None:
    with pytest.raises(
        ValidationError,
        match="data_inicio deve ser anterior ou igual a data_fim",
    ):
        FiltrosAcidente(
            data_inicio=date(2026, 12, 31),
            data_fim=date(2026, 1, 1),
        )
