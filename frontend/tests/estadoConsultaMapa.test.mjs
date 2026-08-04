import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { before, test } from "node:test";
import { transformWithEsbuild } from "vite";

let estado;

before(async () => {
  const codigo = await readFile(
    new URL("../src/hooks/estadoConsultaMapa.ts", import.meta.url),
    "utf8",
  );
  const transformado = await transformWithEsbuild(codigo, "estadoConsultaMapa.ts", {
    loader: "ts",
    format: "esm",
  });
  const modulo = `data:text/javascript;base64,${Buffer.from(transformado.code).toString("base64")}`;
  estado = await import(modulo);
});

const acidente = {
  id: 1,
  data: "2026-01-01",
  hora: "08:30:00",
  tipo: "Colisão",
  gravidade: "Leve",
  bairro: "Centro",
  latitude: "-22.905411",
  longitude: "-43.177580",
};

test("inicia carregando, sem erro, vazio ou marcadores antigos", () => {
  const anterior = {
    acidentes: [acidente],
    carregando: false,
    erro: "Falha anterior",
  };

  assert.deepEqual(estado.reduzirEstadoConsultaMapa(anterior, { tipo: "iniciar" }), {
    acidentes: [],
    carregando: true,
    erro: null,
  });
});

test("registra a falha sem manter carregamento ou acidentes", () => {
  const resultado = estado.reduzirEstadoConsultaMapa(
    estado.estadoInicialConsultaMapa,
    { tipo: "falha", erro: "Não foi possível conectar à API." },
  );

  assert.deepEqual(resultado, {
    acidentes: [],
    carregando: false,
    erro: "Não foi possível conectar à API.",
  });
});

test("representa uma consulta concluída sem resultados", () => {
  const resultado = estado.reduzirEstadoConsultaMapa(
    estado.estadoInicialConsultaMapa,
    { tipo: "sucesso", acidentes: [] },
  );

  assert.deepEqual(resultado, {
    acidentes: [],
    carregando: false,
    erro: null,
  });
});

test("mantém os acidentes quando a consulta retorna dados", () => {
  const resultado = estado.reduzirEstadoConsultaMapa(
    estado.estadoInicialConsultaMapa,
    { tipo: "sucesso", acidentes: [acidente] },
  );

  assert.deepEqual(resultado, {
    acidentes: [acidente],
    carregando: false,
    erro: null,
  });
});

test("uma nova consulta e um sucesso posterior limpam o erro anterior", () => {
  const comErro = { acidentes: [], carregando: false, erro: "Falha anterior" };
  const reiniciado = estado.reduzirEstadoConsultaMapa(comErro, { tipo: "iniciar" });
  const sucesso = estado.reduzirEstadoConsultaMapa(reiniciado, {
    tipo: "sucesso",
    acidentes: [acidente],
  });

  assert.equal(reiniciado.erro, null);
  assert.equal(reiniciado.carregando, true);
  assert.deepEqual(sucesso, {
    acidentes: [acidente],
    carregando: false,
    erro: null,
  });
});

test("carregamento tem precedência e não é apresentado como vazio", () => {
  assert.equal(estado.obterEstadoVisualMapa(true, null, 0), "carregando");
});

test("erro tem precedência sobre dados e impede a apresentação do mapa", () => {
  assert.equal(
    estado.obterEstadoVisualMapa(false, "Falha ao consultar", 1),
    "erro",
  );
});

test("sucesso vazio e sucesso com dados têm apresentações distintas", () => {
  assert.equal(estado.obterEstadoVisualMapa(false, null, 0), "vazio");
  assert.equal(estado.obterEstadoVisualMapa(false, null, 1), "dados");
});

test("normaliza falhas desconhecidas sem expor objetos", () => {
  assert.equal(
    estado.obterMensagemErroMapa({ detail: "erro interno" }),
    "Não foi possível carregar os acidentes no mapa.",
  );
  assert.equal(
    estado.obterMensagemErroMapa(new Error("Não foi possível conectar à API.")),
    "Não foi possível conectar à API.",
  );
});
