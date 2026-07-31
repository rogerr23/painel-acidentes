# Dados de exemplo

Os arquivos desta pasta contêm acidentes fictícios para desenvolvimento.
Os nomes das vias, bairros e coordenadas representam locais reais do município
do Rio de Janeiro, mas não indicam que acidentes reais ocorreram nesses pontos.

As referências geográficas foram consultadas no OpenStreetMap:
https://www.openstreetmap.org/copyright

O CSV usa ponto e vírgula como separador, data no formato `AAAA-MM-DD`, hora no
formato `HH:MM` e coordenadas com ponto como separador decimal.

- `acidentes_exemplo.csv`: contém 50 registros válidos, distribuídos entre
  janeiro de 2025 e julho de 2026.
- `acidentes_com_erros.csv`: contém 12 registros, sendo 3 válidos e 9 inválidos,
  para demonstrar o descarte individual de linhas.
