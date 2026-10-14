import { pool } from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export async function GET() {
  const [grupos] = await pool.query<RowDataPacket[]>(
    "SELECT id, nome FROM grupo ORDER BY id DESC"
  );
  const [participantes] = await pool.query<RowDataPacket[]>(
    "SELECT id, grupo_id, nome FROM participante ORDER by id"
  );

  const resultado = grupos.map((g) => {
    const membros = participantes
    .filter((p) => p.grupo_id === g.id)
    .map((p) => ({ id: p.id, nome: p.nome }));
    return {
      id: g.id,
      nome: g.nome,
      participantes: membros.map((m) => m.nome),
    };

  });

  return Response.json(resultado);
}

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

  const nomeBruto = corpo?.nome;
  const nome = typeof nomeBruto === "string" ? nomeBruto.trim() : "";

  const participantesBrutos = corpo?.participantes;
  const participantes = Array.isArray(participantesBrutos)
    ? participantesBrutos
        .filter((p) => typeof p === "string")
        .map((p) => p.trim())
        .filter((p) => p !== "")
    : [];

  if (nome === "") {
    return Response.json(
      { erro: "O nome do grupo é obrigatório." },
      { status: 400 }
    );
  }

  if (participantes.length < 2) {
    return Response.json(
      { erro: "Um grupo precisa de pelo menos dois participantes." },
      { status: 400 }
    );
  }

  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO grupo (nome) VALUES (?)",
    [nome]
  );

  const grupoId = resultado.insertId;

  for (const nomeParticipante of participantes) {
    await pool.query(
      "INSERT INTO participante (grupo_id, nome) VALUES (?, ?)",
      [grupoId, nomeParticipante]
    );
  }

  return Response.json({ id: grupoId }, { status: 201 });
}