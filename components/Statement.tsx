"use client";

import { formatarReais } from "@/lib/formatar";
import { Section, Subtitle, Item, Muted } from "./ui";

export type SaldoExtrato = {
  id: number;
  nome: string;
  pago: number;
  devido: number;
  saldo: number;
};

export type DespesaExtrato = {
  id: number;
  descricao: string;
  valorCentavos: number;
  pagadorId: number;
  partes: { participanteId: number; valorCentavos: number }[];
};

// Traduz o saldo em uma frase para o usuário.
function situacao(saldo: number) {
  if (saldo > 0) return `recebe ${formatarReais(saldo)}`;
  if (saldo < 0) return `deve ${formatarReais(-saldo)}`;
  return "está quite";
}

export default function Statement({
  saldos,
  despesas,
}: {
  saldos: SaldoExtrato[];
  despesas: DespesaExtrato[];
}) {
  return (
    <Section>
      <Subtitle>Extrato individual</Subtitle>

      {saldos.map((s) => (
        <Item key={s.id}>
          <strong>{s.nome}</strong>

          {/* Uma linha por despesa em que a pessoa pagou ou tem parte */}
          {despesas.map((d) => {
            const pagou = d.pagadorId === s.id ? d.valorCentavos : 0;
            const parte =
              d.partes.find((p) => p.participanteId === s.id)?.valorCentavos ??
              0;

            if (pagou === 0 && parte === 0) return null;

            return (
              <Muted key={d.id}>
                {d.descricao}
                {pagou > 0 && ` · pagou ${formatarReais(pagou)}`}
                {parte > 0 && ` · parte ${formatarReais(parte)}`}
              </Muted>
            );
          })}

          <Muted>
            Total: pagou {formatarReais(s.pago)} · parte{" "}
            {formatarReais(s.devido)} · {situacao(s.saldo)}
          </Muted>
        </Item>
      ))}
    </Section>
  );
}
