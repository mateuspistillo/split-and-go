"use client";

import { Section, Label } from "./ui";

export default function SplitFields({
  membros,
  marcados,
  aoMarcar,
}: {
  membros: { id: number; nome: string }[];
  marcados: Record<number, boolean>;
  aoMarcar: (id: number, valor: boolean) => void;
}) {
  return (
    <Section>
      <Label>Entre quem</Label>
      {membros.map((m) => (
        <label key={m.id}>
          <input
            type="checkbox"
            checked={!!marcados[m.id]}
            onChange={(e) => aoMarcar(m.id, e.target.checked)}
          />{" "}
          {m.nome}
        </label>
      ))}
    </Section>
  );
}