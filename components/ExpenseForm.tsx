"use client";

import { useState } from "react";
import { paraCentavos } from "@/lib/formatar";
import { Section, Label, Input, Select, PrimaryButton } from "./ui";
import SplitFields from "./SplitFields";
import type { Grupo } from "./GroupList";

const TIPOS = [
  { valor: "igual", rotulo: "Igual" },
  { valor: "porcentagem", rotulo: "Porcentagem" },
  { valor: "valor_fixo", rotulo: "Valor fixo" },
];

function paraNumero(texto: string) {
  return Number(texto.replace(",", "."));
}

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
  const [tipo, setTipo] = useState("igual");
  const [marcados, setMarcados] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(grupo.membros.map((m) => [m.id, true]))
  );
  const [campos, setCampos] = useState<Record<number, string>>({});

  function montarParticipantes() {
    return grupo.membros
      .filter((m) => marcados[m.id])
      .map((m) => {
        const texto = campos[m.id] ?? "";
        if (tipo === "porcentagem") {
          return { id: m.id, porcentagem: paraNumero(texto) };
        }
        if (tipo === "valor_fixo") {
          return { id: m.id, valorCentavos: paraCentavos(texto) };
        }
        return { id: m.id };
      });
  }

  async function lancar() {
    const resposta = await fetch("/api/despesas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grupoId: grupo.id,
        descricao,
        valorCentavos: paraCentavos(valor),
        pagadorId,
        tipoRateio: tipo,
        participantes: montarParticipantes(),
      }),
    });

    if (!resposta.ok) return;

    setDescricao("");
    setValor("");
    setCampos({});
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

      <Label>Como dividir</Label>
      <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        {TIPOS.map((t) => (
          <option key={t.valor} value={t.valor}>
            {t.rotulo}
          </option>
        ))}
      </Select>

      <SplitFields
        membros={grupo.membros}
        tipo={tipo}
        marcados={marcados}
        campos={campos}
        aoMarcar={(id, v) => setMarcados({ ...marcados, [id]: v })}
        aoDigitar={(id, texto) => setCampos({ ...campos, [id]: texto })}
      />

      <PrimaryButton type="button" onClick={lancar}>
        Lançar despesa
      </PrimaryButton>
    </Section>
  );
}