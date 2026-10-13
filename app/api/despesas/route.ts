import { pool } from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  calcularRateio,
  calcularRateioPorcentagem,
  validarValorDespesa,
  validarSomaPartes,
} from "./rateio";

type Item = { id: number; porcentagem?: number; valorCentavos?: number };

export async function POST(request: Request) {
  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return Response.json(
      { erro: "O corpo do pedido não é um JSON válido." },
      { status: 400 }
    );
  }

  const grupoId = Number(corpo?.grupoId);
  const descricao =
    typeof corpo?.descricao === "string" ? corpo.descricao.trim() : "";
  const valorCentavos = corpo?.valorCentavos;
  const pagadorId = corpo?.pagadorId;
  const tipoRateio = corpo?.tipoRateio;
  const itens: Item[] = Array.isArray(corpo?.participantes)
    ? corpo.participantes
    : [];

  if (descricao === "") {
    return Response.json(
      { erro: "A descrição da despesa é obrigatória." },
      { status: 400 }
    );
  }

  const [membros] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM participante WHERE grupo_id = ?",
    [grupoId]
  );
  const idsDoGrupo = new Set<number>(membros.map((m) => m.id));

  if (idsDoGrupo.size === 0) {
    return Response.json({ erro: "Grupo não encontrado." }, { status: 404 });
  }

  let partes: number[] = [];
  try {
    validarValorDespesa(valorCentavos);

    if (!idsDoGrupo.has(pagadorId)) {
      throw new Error("O pagador não pertence a este grupo.");
    }
    if (itens.length === 0) {
      throw new Error("É necessário pelo menos um participante no rateio.");
    }
    if (itens.some((item) => !idsDoGrupo.has(item.id))) {
      throw new Error("Há participantes que não pertencem ao grupo.");
    }
    if (new Set(itens.map((item) => item.id)).size !== itens.length) {
      throw new Error("Há participantes repetidos no rateio.");
    }

    if (tipoRateio === "igual") {
      partes = calcularRateio(valorCentavos, itens.length);
    } else if (tipoRateio === "porcentagem") {
      partes = calcularRateioPorcentagem(
        valorCentavos,
        itens.map((item) => item.porcentagem ?? NaN)
      );
    } else if (tipoRateio === "valor_fixo") {
      partes = itens.map((item) => item.valorCentavos ?? NaN);
    } else {
      throw new Error("Tipo de rateio inválido.");
    }

    validarSomaPartes(valorCentavos, partes);
  } catch (erro) {
    return Response.json(
      { erro: erro instanceof Error ? erro.message : "Dados inválidos." },
      { status: 400 }
    );
  }

  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();

    const [resultado] = await conexao.query<ResultSetHeader>(
      "INSERT INTO despesa (grupo_id, participante_pagador_id, descricao, valor_centavos, tipo_rateio) VALUES (?, ?, ?, ?, ?)",
      [grupoId, pagadorId, descricao, valorCentavos, tipoRateio]
    );
    const despesaId = resultado.insertId;

    const linhas = itens.map((item, i) => [
      despesaId,
      item.id,
      partes[i],
      tipoRateio === "porcentagem" ? item.porcentagem : null,
    ]);
    await conexao.query(
      "INSERT INTO parte_despesa (despesa_id, participante_id, valor_centavos, porcentagem) VALUES ?",
      [linhas]
    );

    await conexao.commit();
    return Response.json({ id: despesaId }, { status: 201 });
  } catch (erro) {
    console.error(erro);
    await conexao.rollback();
    return Response.json(
      { erro: "Não foi possível salvar a despesa." },
      { status: 500 }
    );
  } finally {
    conexao.release();
  }
}

export async function GET(request: Request) {
  const grupoId = Number(new URL(request.url).searchParams.get("grupoId"));

  if (!Number.isInteger(grupoId) || grupoId <= 0) {
    return Response.json(
      { erro: "Informe o grupoId na URL." },
      { status: 400 }
    );
  }

  const [despesas] = await pool.query<RowDataPacket[]>(
    `SELECT d.id, d.descricao, d.valor_centavos, d.tipo_rateio,
            d.participante_pagador_id, p.nome AS pagador_nome
       FROM despesa d
       JOIN participante p ON p.id = d.participante_pagador_id
      WHERE d.grupo_id = ?
      ORDER BY d.id DESC`,
    [grupoId]
  );

  const [partes] = await pool.query<RowDataPacket[]>(
    `SELECT pd.despesa_id, pd.participante_id, p.nome, pd.valor_centavos
       FROM parte_despesa pd
       JOIN participante p ON p.id = pd.participante_id
       JOIN despesa d ON d.id = pd.despesa_id
      WHERE d.grupo_id = ?`,
    [grupoId]
  );

  const resultado = despesas.map((d) => ({
    id: d.id,
    descricao: d.descricao,
    valorCentavos: d.valor_centavos,
    tipoRateio: d.tipo_rateio,
    pagadorId: d.participante_pagador_id,
    pagadorNome: d.pagador_nome,
    partes: partes
      .filter((p) => p.despesa_id === d.id)
      .map((p) => ({
        participanteId: p.participante_id,
        nome: p.nome,
        valorCentavos: p.valor_centavos,
      })),
  }));

  return Response.json(resultado);
}