"use client";

import { formatarReais } from "@/lib/formatar";
import { Section, Item, Muted } from "./ui";

export type Despesa = {
  id: number;
  descricao: string;
  valorCentavos: number;
  pagadorNome: string;
  partes: { participanteId: number; nome: string; valorCentavos: number }[];
};

export default function ExpenseList({ despesas }: { despesas: Despesa[] }) {
  if (despesas.length === 0) {
    return <Muted>Nenhuma despesa lançada ainda.</Muted>;
  }

  return (
    <Section>
      {despesas.map((d) => (
        <Item key={d.id}>
          <strong>
            {d.descricao} · {formatarReais(d.valorCentavos)}
          </strong>
          <Muted>Pago por {d.pagadorNome}</Muted>
          <Muted>
            {d.partes
              .map((p) => `${p.nome} ${formatarReais(p.valorCentavos)}`)
              .join(" · ")}
          </Muted>
        </Item>
      ))}
    </Section>
  );
}