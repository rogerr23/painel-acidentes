from datetime import date
from typing import Any

from fastapi.testclient import TestClient


def test_lista_vazia(client: TestClient) -> None:
    response = client.get("/acidentes")

    assert response.status_code == 200
    assert response.json() == {
        "items": [],
        "pagina": 1,
        "por_pagina": 20,
        "total": 0,
        "total_paginas": 0,
    }


def test_lista_acidentes_ordenados(
    client: TestClient,
    acidente_factory: Any,
) -> None:
    primeiro = acidente_factory(bairro="Centro")
    segundo = acidente_factory(bairro="Tijuca")

    response = client.get("/acidentes")

    assert response.status_code == 200
    payload = response.json()
    assert [item["id"] for item in payload["items"]] == [
        primeiro.id,
        segundo.id,
    ]
    assert payload["items"][0]["logradouro"] == "Avenida Rio Branco"
    assert payload["total"] == 2
    assert payload["total_paginas"] == 1


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
    assert [item["id"] for item in response.json()["items"]] == [esperado.id]
    assert response.json()["total"] == 1


def test_pagina_acidentes(
    client: TestClient,
    acidente_factory: Any,
) -> None:
    acidentes = [acidente_factory() for _ in range(5)]

    response = client.get(
        "/acidentes",
        params={"pagina": 2, "por_pagina": 2},
    )

    assert response.status_code == 200
    assert response.json() == {
        "items": [
            {
                "id": acidentes[2].id,
                "data": "2026-01-03",
                "hora": "08:30:00",
                "tipo": "Colisão",
                "gravidade": "Leve",
                "bairro": "Centro",
                "logradouro": "Avenida Rio Branco",
                "latitude": "-22.905411",
                "longitude": "-43.177580",
            },
            {
                "id": acidentes[3].id,
                "data": "2026-01-04",
                "hora": "08:30:00",
                "tipo": "Colisão",
                "gravidade": "Leve",
                "bairro": "Centro",
                "logradouro": "Avenida Rio Branco",
                "latitude": "-22.905411",
                "longitude": "-43.177580",
            },
        ],
        "pagina": 2,
        "por_pagina": 2,
        "total": 5,
        "total_paginas": 3,
    }


def test_mapa_retorna_todos_os_acidentes_filtrados_sem_paginacao(
    client: TestClient,
    acidente_factory: Any,
) -> None:
    esperados = [
        acidente_factory(
            data=date(2026, 1, dia),
            bairro="Centro",
            gravidade="Grave",
            tipo="Colisão",
        )
        for dia in range(1, 5)
    ]
    acidente_factory(
        data=date(2026, 2, 1),
        bairro="Tijuca",
        gravidade="Leve",
        tipo="Atropelamento",
    )
    filtros = {
        "bairro": "centro",
        "gravidade": "grave",
        "tipo": "colisão",
        "data_inicio": "2026-01-01",
        "data_fim": "2026-01-31",
    }

    pagina = client.get(
        "/acidentes",
        params={**filtros, "pagina": 2, "por_pagina": 2},
    )
    mapa = client.get("/acidentes/mapa", params=filtros)

    assert pagina.status_code == 200
    assert [item["id"] for item in pagina.json()["items"]] == [
        esperados[2].id,
        esperados[3].id,
    ]
    assert pagina.json()["total"] == 4

    assert mapa.status_code == 200
    assert [item["id"] for item in mapa.json()] == [
        acidente.id for acidente in esperados
    ]
    assert set(mapa.json()[0]) == {
        "id",
        "latitude",
        "longitude",
        "tipo",
        "gravidade",
        "bairro",
        "data",
        "hora",
    }


def test_rejeita_paginacao_invalida(client: TestClient) -> None:
    response = client.get(
        "/acidentes",
        params={"pagina": 0, "por_pagina": 101},
    )

    assert response.status_code == 422


def test_lista_opcoes_dos_filtros(
    client: TestClient,
    acidente_factory: Any,
) -> None:
    acidente_factory(
        bairro="Tijuca",
        gravidade="Grave",
        tipo="Atropelamento",
    )
    acidente_factory(
        bairro="Centro",
        gravidade="Leve",
        tipo="Colisão",
    )
    acidente_factory(
        bairro="Centro",
        gravidade="Leve",
        tipo="Colisão",
    )

    response = client.get("/acidentes/filtros/opcoes")

    assert response.status_code == 200
    assert response.json() == {
        "bairros": ["Centro", "Tijuca"],
        "gravidades": ["Grave", "Leve"],
        "tipos": ["Atropelamento", "Colisão"],
    }


def test_cors_permite_frontend_local(client: TestClient) -> None:
    response = client.options(
        "/acidentes",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == (
        "http://localhost:5173"
    )
