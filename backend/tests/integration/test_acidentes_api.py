from datetime import date
from typing import Any

from fastapi.testclient import TestClient


def test_lista_vazia(client: TestClient) -> None:
    response = client.get("/acidentes")

    assert response.status_code == 200
    assert response.json() == []


def test_lista_acidentes_ordenados(
    client: TestClient,
    acidente_factory: Any,
) -> None:
    primeiro = acidente_factory(bairro="Centro")
    segundo = acidente_factory(bairro="Tijuca")

    response = client.get("/acidentes")

    assert response.status_code == 200
    assert [item["id"] for item in response.json()] == [
        primeiro.id,
        segundo.id,
    ]
    assert response.json()[0]["logradouro"] == "Avenida Rio Branco"


def test_busca_acidente_por_id(
    client: TestClient,
    acidente_factory: Any,
) -> None:
    acidente = acidente_factory(bairro="Copacabana")

    response = client.get(f"/acidentes/{acidente.id}")

    assert response.status_code == 200
    assert response.json()["id"] == acidente.id
    assert response.json()["bairro"] == "Copacabana"


def test_busca_id_inexistente_retorna_404(client: TestClient) -> None:
    response = client.get("/acidentes/999999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Acidente não encontrado."}


def test_aplica_filtros_combinados(
    client: TestClient,
    acidente_factory: Any,
) -> None:
    esperado = acidente_factory(
        data=date(2026, 1, 15),
        bairro="Centro",
        gravidade="Grave",
        tipo="Colisão",
    )
    acidente_factory(
        data=date(2026, 3, 15),
        bairro="Centro",
        gravidade="Grave",
        tipo="Colisão",
    )
    acidente_factory(
        data=date(2026, 1, 20),
        bairro="Centro",
        gravidade="Leve",
        tipo="Colisão",
    )

    response = client.get(
        "/acidentes",
        params={
            "bairro": "centro",
            "gravidade": "grave",
            "tipo": "colisão",
            "data_inicio": "2026-01-01",
            "data_fim": "2026-02-28",
        },
    )

    assert response.status_code == 200
    assert [item["id"] for item in response.json()] == [esperado.id]
