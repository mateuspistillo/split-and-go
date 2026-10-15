import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";
import { simplificarSaldos, type Saldo } from "@/lib/saldo";

export async function GET(request: Request) {
    const grupoId = Number(new URL(request.url).searchParams.get("grupoId"));

    if (!Number.isInteger(grupoId) || grupoId <= 0) {
        return Response.json(
            { erro: "Informe o grupoId na URL." },
            { status: 400 }
        );
    }

    const [linhas] = await pool.query<RowDataPacket[]>(
        `SELECT p.id, p.nome,
        COALESCE((SELECT SUM(d.valor_centavos) FROM despesa d
            WHERE d.participante_pagador_id = p.id), 0) AS pago,
        COALESCE((SELECT SUM(pd.valor_centavos) FROM parte_despesa pd
            WHERE pd.participante_id = p.id), 0) AS devido
        FROM participante p
        WHERE p.grupo_id = ?`,
        [grupoId]
    );

    if (linhas.length === 0) {
        return Response.json({ erro: "Grupo não encontrado." }, { status: 404 });
    }

    const saldos: Saldo[] = linhas.map((l) => ({
        id: l.id,
        nome: l.nome,
        pago: Number(l.pago),
        devido: Number(l.devido),
        saldo: Number(l.pago) - Number(l.devido),
    }));

    const somaSaldos = saldos.reduce((soma, s) => soma + s.saldo, 0);
    const pagamentos = simplificarSaldos(saldos);

    return Response.json({ saldos, somaSaldos, pagamentos });
}
