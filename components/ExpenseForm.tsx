"use client";

import { useState } from "react";
import { paraCentavos } from "@/lib/formatar";
import { Section, Label, Input, Select, PrimaryButton, ErrorText } from "./ui";
import SplitFields from "./SplitFields";
import type { Grupo } from "./GroupList";

// Os três jeitos de repartir uma despesa. O "valor" é o que a API espera receber no campo tipoRateio, e o "rotulo" é o texto mostrado na tela.
const TIPOS = [
  { valor: "igual", rotulo: "Igual" },
  { valor: "porcentagem", rotulo: "Porcentagem" },
  { valor: "valor_fixo", rotulo: "Valor fixo" },
];

// Converte o texto digitado ("12,5") em número, aceitando vírgula.
function paraNumero(texto: string) {
  return Number(texto.replace(",", "."));
}

export default function ExpenseForm({
  grupo,
  aoLancar,
}: {
  grupo: Grupo;
  aoLancar: () => void; // avisa o componente pai para recarregar a lista de despesas
}) {
  
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [pagadorId, setPagadorId] = useState(grupo.membros[0]?.id ?? 0);
  const [tipo, setTipo] = useState("igual");

  // Quem divide a despesa: começa com todos os membros marcados
  const [marcados, setMarcados] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(grupo.membros.map((m) => [m.id, true]))
  );

  // O que foi digitado ao lado de cada pessoa (% ou R$), usado só nos modos "porcentagem" e "valor fixo"
  const [campos, setCampos] = useState<Record<number, string>>({});

  // Mensagem de erro devolvida pela API (validação feita no servidor)
  const [erro, setErro] = useState("");

  // Monta a lista de participantes no formato que a API espera, de acordo com o tipo de rateio escolhido
  function montarParticipantes() {
    return grupo.membros
      .filter((m) => marcados[m.id])
      .map((m) => {
        const texto = campos[m.id] ?? "";

        if (tipo === "porcentagem") {
          return { id: m.id, porcentagem: paraNumero(texto) };
        }

        // Valor fixo: quanto essa pessoa fica devendo desta despesa
        if (tipo === "valor_fixo") {
          return { id: m.id, valorCentavos: paraCentavos(texto) };
        }

        // Rateio igual: não precisa de valor, quem calcula é a API
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
        // O pagador é sempre o escolhido no select, em qualquer modo
        pagadorId,
        tipoRateio: tipo,
        participantes: montarParticipantes(),
      }),
    });

    const json = await resposta.json();

    // Se a API recusou, mostra a mensagem dela
    if (!resposta.ok) {
      setErro(json.erro);
      return;
    }

    // Deu certo: limpa o formulário e avisa para atualizar a lista
    setErro("");
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

      {/* Fica visível em todos os modos: a despesa sempre tem um pagador */}
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

      {/* Lista de quem divide, com campo de % ou R$ conforme o tipo */}
      <SplitFields
        membros={grupo.membros}
        tipo={tipo}
        marcados={marcados}
        campos={campos}
        aoMarcar={(id, v) => setMarcados({ ...marcados, [id]: v })}
        aoDigitar={(id, texto) => setCampos({ ...campos, [id]: texto })}
      />

      {erro && <ErrorText>{erro}</ErrorText>}

      <PrimaryButton type="button" onClick={lancar}>
        Lançar despesa
      </PrimaryButton>
    </Section>
  );
}