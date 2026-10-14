"use client";

import { Section, Label, Line, InputSmall } from "./ui";

export default function SplitFields({
  membros,
  tipo,
  marcados,
  campos,
  aoMarcar,
  aoDigitar,
}: {
  membros: { id: number; nome: string }[];
  tipo: string;
  marcados: Record<number, boolean>;
  campos: Record<number, string>;
  aoMarcar: (id: number, valor: boolean) => void;
  aoDigitar: (id: number, texto: string) => void;
}) {
  return (
    <Section>
      <Label>Entre quem</Label>
      {membros.map((m) => (
        <Line key={m.id}>
          <label>
            <input
              type="checkbox"
              checked={!!marcados[m.id]}
              onChange={(e) => aoMarcar(m.id, e.target.checked)}
            />{" "}
            {m.nome}
          </label>
          {tipo !== "igual" && marcados[m.id] && (
            <InputSmall
              value={campos[m.id] ?? ""}
              onChange={(e) => aoDigitar(m.id, e.target.value)}
              placeholder={tipo === "porcentagem" ? "%" : "R$"}
            />
          )}
        </Line>
      ))}
    </Section>
  );
}