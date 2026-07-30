# Painel de Acidentes

API REST para visualização e análise de acidentes de trânsito utilizando geolocalização.

O projeto importa registros através de um arquivo CSV, realiza o tratamento dos dados e disponibiliza uma API para consulta. Os acidentes são apresentados em um mapa interativo, permitindo análises por localização e período.

> Projeto em desenvolvimento.

---

# Funcionalidades

- Importação de acidentes por CSV
- Tratamento e validação dos dados
- Armazenamento em PostgreSQL
- Consulta de acidentes
- Filtros por bairro
- Filtros por tipo de acidente
- Filtros por gravidade
- Filtros por período
- Dashboard com indicadores
- Visualização dos acidentes em mapa

---

# Tecnologias

## Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pandas
- Pydantic
- Docker Compose

## Frontend

- React
- TypeScript
- Leaflet
- OpenStreetMap

---

# Estrutura do projeto

```text
backend/
frontend/
docker-compose.yml
README.md
```

---

# Estrutura do CSV

O projeto utiliza um arquivo CSV contendo os registros dos acidentes.

Exemplo:

```csv
id;data;hora;tipo;gravidade;bairro;latitude;longitude
1;2026-01-10;08:30;Colisão;Leve;Centro;-22.9068;-43.1729
2;2026-01-11;18:45;Atropelamento;Grave;Tijuca;-22.9249;-43.2322
```

---

# Endpoints previstos

```text
GET    /acidentes
GET    /acidentes/{id}

GET    /dashboard/resumo
GET    /dashboard/bairros

POST   /importacoes/csv
```

---

# Objetivo

Construir uma aplicação simples, organizada e escalável para demonstrar:

- desenvolvimento de APIs com FastAPI;
- processamento de arquivos CSV utilizando Pandas;
- integração com PostgreSQL;
- utilização de mapas com Leaflet;
- boas práticas de arquitetura e organização de projetos.

---
