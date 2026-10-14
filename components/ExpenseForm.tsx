"use client";

import { useState } from "react";
import { paraCentavos } from "@/lib/formatar";
import { Section, Label, Input, Select, PrimaryButton } from "./ui";
import SplitFields from "./SplitFields";
import type { Grupo } from "./GroupList";

export default function ExpenseForm({
  grupo,
  aoLancar,
}: {
  grupo: Grupo;
  aoLancar: () => void;
}) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [pagadorId, setPagadorId] = useState(grupo.membros[0]?.id ?? 0);
  const [marcados, setMarcados] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(grupo.membros.map((m) => [m.id, true]))
  );

  async function lancar() {
    const resposta = await fetch("/api/despesas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grupoId: grupo.id,
        descricao,
        valorCentavos: paraCentavos(valor),
        pagadorId,
        tipoRateio: "igual",
        participantes: grupo.membros
          .filter((m) => marcados[m.id])
          .map((m) => ({ id: m.id })),
      }),
    });

    if (!resposta.ok) return;

    setDescricao("");
    setValor("");
    aoLancar();
  }

  return (
    <Section>
      <Label>Descrição</Label>
      <Input
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Ex.: Jantar"
      />

      <Label>Valor (R$)</Label>
      <Input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Ex.: 100,00"
      />

      <Label>Quem pagou</Label>
      <Select
        value={pagadorId}
        onChange={(e) => setPagadorId(Number(e.target.value))}
      >
        {grupo.membros.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nome}
          </option>
        ))}
      </Select>

      <SplitFields
        membros={grupo.membros}
        marcados={marcados}
        aoMarcar={(id, v) => setMarcados({ ...marcados, [id]: v })}
      />

      <PrimaryButton type="button" onClick={lancar}>
        Lançar despesa
      </PrimaryButton>
    </Section>
  );
}