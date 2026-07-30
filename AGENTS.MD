# AGENTS.md

# Painel de Acidentes

## Objetivo

Construir uma aplicação web para visualizar e analisar acidentes de trânsito a partir de um arquivo CSV.

O projeto deve ser desenvolvido de forma incremental, priorizando código limpo, arquitetura simples e fácil manutenção.

---

# Tecnologias

## Backend

- Python 3.13+
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pandas
- Pydantic
- Docker Compose

## Frontend

- React
- TypeScript
- Vite
- Leaflet
- OpenStreetMap

---

# Objetivos do projeto

A aplicação deverá permitir:

- importar acidentes através de um arquivo CSV;
- validar e tratar os dados;
- armazenar os registros no PostgreSQL;
- disponibilizar uma API REST;
- visualizar os acidentes em um mapa;
- aplicar filtros por data, bairro, tipo e gravidade;
- apresentar indicadores simples.

---

# Estrutura sugerida

```text
backend/
    app/
        api/
        database/
        models/
        repositories/
        schemas/
        services/
        utils/

frontend/
    src/
```

---

# Entidade principal

Acidente

Campos mínimos:

- id
- data
- hora
- tipo
- gravidade
- bairro
- latitude
- longitude

---

# Etapas de desenvolvimento

## Etapa 1

Criar o projeto FastAPI.

Configurar:

- ambiente virtual;
- dependências;
- Docker Compose;
- PostgreSQL;
- Swagger.

---

## Etapa 2

Criar a estrutura da aplicação.

Separar:

- rotas;
- serviços;
- modelos;
- schemas;
- acesso ao banco.

---

## Etapa 3

Criar a entidade Acidente.

Criar:

- modelo SQLAlchemy;
- schema de entrada;
- schema de saída;
- migration (caso Alembic seja utilizado).

---

## Etapa 4

Implementar importação do CSV utilizando Pandas.

Durante a importação:

- validar colunas obrigatórias;
- converter datas;
- converter latitude e longitude;
- ignorar registros inválidos;
- inserir os dados no PostgreSQL.

---

## Etapa 5

Criar endpoints REST.

Exemplos:

GET /acidentes

GET /acidentes/{id}

GET /dashboard/resumo

GET /dashboard/bairros

---

## Etapa 6

Criar filtros.

Permitir:

- bairro
- gravidade
- tipo
- período

Todos os filtros devem funcionar combinados.

---

## Etapa 7

Criar o frontend.

Tela única contendo:

- mapa;
- filtros;
- indicadores;
- lista de acidentes.

Utilizar Leaflet.

---

## Etapa 8

Adicionar melhorias.

Exemplos:

- paginação;
- upload de CSV;
- exportação;
- testes automatizados;
- Docker.

---

# Boas práticas

Sempre seguir:

- SOLID quando fizer sentido;
- código limpo;
- tipagem;
- validações;
- separação de responsabilidades;
- respostas padronizadas;
- tratamento de exceções;
- documentação automática da API.

Evitar complexidade desnecessária.

Priorizar legibilidade.

Sempre explicar alterações importantes antes de implementações grandes.
