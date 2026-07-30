# Dados de exemplo

Os arquivos desta pasta contêm acidentes fictícios para desenvolvimento.
Os nomes das vias, bairros e coordenadas representam locais reais do município
do Rio de Janeiro, mas não indicam que acidentes reais ocorreram nesses pontos.

As referências geográficas foram consultadas no OpenStreetMap:
https://www.openstreetmap.org/copyright

O CSV usa ponto e vírgula como separador, data no formato `AAAA-MM-DD`, hora no
formato `HH:MM` e coordenadas com ponto como separador decimal.

- `acidentes_exemplo.csv`: contém apenas registros válidos.
- `acidentes_com_erros.csv`: mistura um registro válido com registros inválidos
  para demonstrar o descarte individual de linhas.
