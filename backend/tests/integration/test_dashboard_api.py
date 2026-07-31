from typing import Any

from fastapi.testclient import TestClient


def test_dashboard_resumo(
    client: TestClient,
    acidente_factory: Any,
) -> None:
    acidente_factory(tipo="Colisão", gravidade="Leve")
    acidente_factory(tipo="Colisão", gravidade="Grave")
    acidente_factory(tipo="Atropelamento", gravidade="Grave")

    response = client.get("/dashboard/resumo")

    assert response.status_code == 200
    assert response.json() == {
        "total_acidentes": 3,
        "por_gravidade": {"Grave": 2, "Leve": 1},
        "por_tipo": {"Atropelamento": 1, "Colisão": 2},
    }


def test_dashboard_bairros_ordenado(
    client: TestClient,
    acidente_factory: Any,
) -> None:
    acidente_factory(bairro="Centro")
    acidente_factory(bairro="Centro")
    acidente_factory(bairro="Tijuca")
    acidente_factory(bairro="Botafogo")

    response = client.get("/dashboard/bairros")

    assert response.status_code == 200
    assert response.json() == [
        {"bairro": "Centro", "total": 2},
        {"bairro": "Botafogo", "total": 1},
        {"bairro": "Tijuca", "total": 1},
    ]


def test_lista_e_dashboard_permanecem_consistentes(
    client: TestClient,
    acidente_factory: Any,
) -> None:
    acidente_factory(bairro="Centro", gravidade="Grave")
    acidente_factory(bairro="Tijuca", gravidade="Grave")
    acidente_factory(bairro="Centro", gravidade="Leve")

    params = {"gravidade": "grave"}
    acidentes = client.get("/acidentes", params=params)
    resumo = client.get("/dashboard/resumo", params=params)
    bairros = client.get("/dashboard/bairros", params=params)

    assert acidentes.status_code == 200
    assert resumo.status_code == 200
    assert bairros.status_code == 200
    assert resumo.json()["total_acidentes"] == len(acidentes.json()["items"])
    assert sum(item["total"] for item in bairros.json()) == len(
        acidentes.json()["items"]
    )
