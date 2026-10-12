import { pool } from "@/lib/db";
import type { ResultSetHeader } from "mysql2/promise";

export async function GET() {
  const [linhas] = await pool.query("SELECT * FROM grupo");
  return Response.json(linhas);
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

  return Response.json({ id: resultado.insertId }, { status: 201 });
}