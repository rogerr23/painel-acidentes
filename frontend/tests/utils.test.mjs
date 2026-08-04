import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { before, test } from "node:test";
import { transformWithEsbuild } from "vite";

async function carregarModulo(caminho) {
  const codigo = await readFile(new URL(caminho, import.meta.url), "utf8");
  const transformado = await transformWithEsbuild(codigo, caminho, {
    loader: "ts",
    format: "esm",
  });
  const modulo = `data:text/javascript;base64,${Buffer.from(transformado.code).toString("base64")}`;
  return import(modulo);
}

let coordenadas;
let formatadores;
let gravidades;

before(async () => {
  [coordenadas, formatadores, gravidades] = await Promise.all([
    carregarModulo("../src/utils/coordinates.ts"),
    carregarModulo("../src/utils/formatters.ts"),
    carregarModulo("../src/utils/severity.ts"),
  ]);
});

test("aceita coordenadas válidas", () => {
  assert.deepEqual(
    coordenadas.validarCoordenadas(-22.905411, -43.17758),
    [-22.905411, -43.17758],
  );
});

test("rejeita coordenadas fora dos intervalos", () => {
  assert.equal(coordenadas.validarCoordenadas(-91, 0), null);
  assert.equal(coordenadas.validarCoordenadas(91, 0), null);
  assert.equal(coordenadas.validarCoordenadas(0, -181), null);
  assert.equal(coordenadas.validarCoordenadas(0, 181), null);
});

test("rejeita NaN e valores infinitos", () => {
  assert.equal(coordenadas.validarCoordenadas(Number.NaN, 0), null);
  assert.equal(coordenadas.validarCoordenadas(0, Number.POSITIVE_INFINITY), null);
  assert.equal(coordenadas.validarCoordenadas(Number.NEGATIVE_INFINITY, 0), null);
});

test("mapeia as gravidades conhecidas para classes seguras", () => {
  assert.equal(gravidades.obterClasseGravidade("Leve"), "severity--light");
  assert.equal(gravidades.obterClasseGravidade("Moderado"), "severity--moderate");
  assert.equal(gravidades.obterClasseGravidade("Grave"), "severity--severe");
  assert.equal(gravidades.obterClasseGravidade("Fatal"), "severity--fatal");
});

test("normaliza caixa, acentos e espaços e protege valores desconhecidos", () => {
  assert.equal(gravidades.obterClasseGravidade("  FÁTAL  "), "severity--fatal");
  assert.equal(gravidades.obterClasseGravidade("Muito   Grave"), "severity--unknown");
  assert.equal(gravidades.obterClasseGravidade("Crítica"), "severity--unknown");
});

test("formata uma data válida sem conversão de fuso horário", () => {
  assert.equal(formatadores.formatarData("2026-01-10"), "10/01/2026");
});

test("formata horas com e sem segundos", () => {
  assert.equal(formatadores.formatarHora("08:30:00"), "08:30");
  assert.equal(formatadores.formatarHora("21:05"), "21:05");
});

test("usa fallback para datas e horas ausentes ou inválidas", () => {
  assert.equal(formatadores.formatarData(null), "Não informado");
  assert.equal(formatadores.formatarData(""), "Não informado");
  assert.equal(formatadores.formatarData("2026-02-30"), "Não informado");
  assert.equal(formatadores.formatarHora(undefined), "Não informado");
  assert.equal(formatadores.formatarHora(""), "Não informado");
  assert.equal(formatadores.formatarHora("25:70:00"), "Não informado");
});
