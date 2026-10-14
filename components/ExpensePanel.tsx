"use client";

import { useEffect, useState } from "react";
import { Panel, Title, Subtitle, GhostButton } from "./ui";
import ExpenseList, { type Despesa } from "./ExpenseList";
import type { Grupo } from "./GroupList";

export default function ExpensePanel({
  grupo,
  aoFechar,
}: {
  grupo: Grupo;
  aoFechar: () => void;
}) {
  const [despesas, setDespesas] = useState<Despesa[]>([]);

  async function carregar() {
    const resposta = await fetch(`/api/despesas?grupoId=${grupo.id}`);
    setDespesas(await resposta.json());
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Panel>
      <Title>Despesas: {grupo.nome}</Title>
      <Subtitle>Despesas do grupo</Subtitle>
      <ExpenseList despesas={despesas} />
      <GhostButton type="button" onClick={aoFechar}>
        Voltar
      </GhostButton>
    </Panel>
  );
}