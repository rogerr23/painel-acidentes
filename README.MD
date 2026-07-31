# Painel de Acidentes

API REST para importar, consultar e analisar acidentes de trânsito utilizando
dados geográficos.

O projeto processa arquivos CSV, valida os registros com Pandas e Pydantic,
armazena os dados no PostgreSQL e disponibiliza consultas e indicadores por
meio do FastAPI.

> Projeto em desenvolvimento. O backend está disponível; o frontend e o mapa
> ainda serão implementados.

## Funcionalidades implementadas

- Importação de acidentes por CSV
- Validação individual dos registros
- Descarte de registros inválidos sem interromper toda a importação
- Armazenamento em PostgreSQL
- Migrations com Alembic
- Consulta de acidentes
- Consulta por identificador
- Indicadores por tipo e gravidade
- Quantidade de acidentes por bairro
- Filtros combináveis por bairro, tipo, gravidade e período
- Paginação da consulta de acidentes
- Opções de filtros fornecidas pela API
- CORS configurado para o frontend local
- Documentação automática com Swagger e OpenAPI
- Execução com Docker Compose

## Funcionalidades planejadas

- Frontend em React e TypeScript
- Mapa interativo com Leaflet e OpenStreetMap
- Upload de CSV pela API
- Exportação de dados
- Testes automatizados

## Tecnologias

### Backend

- Python 3.13+
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pandas
- Pydantic
- Alembic
- Docker Compose

### Frontend planejado

- React
- TypeScript
- Vite
- Leaflet
- OpenStreetMap

## Estrutura do projeto

```text
backend/
    alembic/
        versions/
    app/
        api/
        database/
        models/
        repositories/
        schemas/
        services/
        utils/
    Dockerfile
data/
    acidentes_exemplo.csv
    acidentes_com_erros.csv
frontend/
alembic.ini
docker-compose.yml
requirements.txt
```

## Configuração

Crie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

Os valores do `.env.example` são destinados somente ao ambiente local de
desenvolvimento.

## Executando com Docker

Construa a imagem da API:

```bash
docker compose build api
```

Inicie o PostgreSQL:

```bash
docker compose up -d db
```

Crie a tabela de acidentes:

```bash
docker compose run --rm api alembic upgrade head
```

Inicie a API:

```bash
docker compose up -d api
```

A aplicação ficará disponível nos seguintes endereços:

- Swagger: http://localhost:8000/docs
- OpenAPI: http://localhost:8000/openapi.json

Para acompanhar os contêineres:

```bash
docker compose ps
docker compose logs -f api
```

Para interromper os serviços:

```bash
docker compose down
```

O volume do PostgreSQL é preservado por esse comando.

## Estrutura do CSV

O arquivo deve utilizar ponto e vírgula como separador e possuir estas colunas:

```csv
data;hora;tipo;gravidade;bairro;logradouro;latitude;longitude
2026-01-10;08:30;Colisão;Leve;Centro;Avenida Rio Branco;-22.905411;-43.177580
2026-01-18;21:15;Atropelamento;Grave;Copacabana;Avenida Atlântica;-22.976851;-43.188144
```

Regras principais:

- `data` deve seguir o formato `AAAA-MM-DD`;
- `hora` deve seguir o formato `HH:MM`;
- `logradouro`, `bairro`, `tipo` e `gravidade` são obrigatórios;
- latitude deve estar entre `-90` e `90`;
- longitude deve estar entre `-180` e `180`;
- ponto ou vírgula são aceitos como separador decimal;
- o `id` não deve ser informado, pois é gerado pelo PostgreSQL.

Os arquivos em `data/` utilizam vias, bairros e coordenadas reais do município
do Rio de Janeiro. Os acidentes são inteiramente fictícios.

## Importando os dados

Para importar o arquivo válido de exemplo:

```bash
docker compose run --rm api \
  python -m backend.app.utils.importar_csv data/acidentes_exemplo.csv
```

O comando retorna um resumo:

```json
{
  "total": 50,
  "importados": 50,
  "ignorados": 0,
  "erros": []
}
```

O arquivo `data/acidentes_com_erros.csv` pode ser usado para observar o
descarte de linhas inválidas:

```bash
docker compose run --rm api \
  python -m backend.app.utils.importar_csv data/acidentes_com_erros.csv
```

Executar novamente o mesmo arquivo insere novos registros, pois a aplicação
ainda não possui uma regra para identificar acidentes duplicados.

## Endpoints

| Método | Caminho | Descrição |
|---|---|---|
| `GET` | `/acidentes` | Lista os acidentes |
| `GET` | `/acidentes/filtros/opcoes` | Lista bairros, tipos e gravidades disponíveis |
| `GET` | `/acidentes/{id}` | Busca um acidente pelo ID |
| `GET` | `/dashboard/resumo` | Retorna totais por tipo e gravidade |
| `GET` | `/dashboard/bairros` | Agrupa a quantidade por bairro |

Uma busca por ID inexistente retorna HTTP `404`.

### Paginação

`GET /acidentes` retorna os registros no campo `items` e os metadados
`pagina`, `por_pagina`, `total` e `total_paginas`. A página padrão é `1`, com
`20` registros. O limite permitido para `por_pagina` é `100`.

```http
GET /acidentes?pagina=2&por_pagina=20
```

O frontend pode preencher seus seletores consultando:

```http
GET /acidentes/filtros/opcoes
```

## Filtros

Os endpoints `/acidentes`, `/dashboard/resumo` e `/dashboard/bairros` aceitam:

| Parâmetro | Descrição | Exemplo |
|---|---|---|
| `bairro` | Nome exato do bairro | `Centro` |
| `gravidade` | Gravidade exata | `Grave` |
| `tipo` | Tipo exato do acidente | `Colisão` |
| `data_inicio` | Início do período | `2026-01-01` |
| `data_fim` | Fim do período | `2026-12-31` |

Os filtros de texto não diferenciam letras maiúsculas e minúsculas. Todos os
parâmetros são opcionais e podem ser combinados:

```http
GET /acidentes?bairro=centro&gravidade=leve&tipo=colisão&data_inicio=2026-01-01&data_fim=2026-12-31
```

Quando as duas datas forem informadas, `data_inicio` deverá ser anterior ou
igual a `data_fim`.

## Acesso pelo frontend

Por padrão, a API aceita requisições do Vite em `http://localhost:5173` e
`http://127.0.0.1:5173`. Em outros ambientes, configure `CORS_ORIGINS` como
uma lista JSON:

```env
CORS_ORIGINS=["https://painel.exemplo.com"]
```

## Testes

Instale as dependências de desenvolvimento:

```bash
pip install -r requirements-dev.txt
```

Inicie o PostgreSQL isolado para testes:

```bash
docker compose --profile test up -d db_test
```

Esse serviço utiliza a porta `5433`, banco próprio e armazenamento temporário.
Ele não altera os registros do PostgreSQL de desenvolvimento.

Execute a suíte:

```bash
pytest
```

Para gerar o relatório de cobertura:

```bash
pytest --cov=backend.app --cov-report=term-missing
```

Para interromper o banco de testes:

```bash
docker compose stop db_test
```

Por padrão, os testes usam esta conexão:

```text
postgresql+psycopg://admin:roger@localhost:5433/painel_acidentes_test
```

Ela pode ser substituída por meio da variável `TEST_DATABASE_URL`.

## Objetivo

Construir uma aplicação simples, organizada e de fácil manutenção para
demonstrar:

- desenvolvimento de APIs com FastAPI;
- processamento de arquivos CSV com Pandas;
- validação de dados com Pydantic;
- integração com PostgreSQL e SQLAlchemy;
- separação entre rotas, serviços, repositórios, schemas e modelos;
- consultas geográficas e visualização futura em mapa.
