"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import CreateGroupButton from "./CreateGroupButton";
import GroupForm from "./GroupForm";
import GroupList, { type Grupo } from "./GroupList";
import SettlementPanel from "./SettlementPanel";
import ExpensePanel from "./ExpensePanel";

export default function CreateGroupSection() {
  const [aberto, setAberto] = useState(false);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [acerto, setAcerto] = useState<Grupo | null>(null);
  const [despesas, setDespesas] = useState<Grupo | null>(null);

  async function carregar() {
    const resposta = await fetch("/api/grupos");
    setGrupos(await resposta.json());
  }

  useEffect(() => {
    carregar();
  }, []);

  if (acerto) {
    return (
      <Wrapper>
        <SettlementPanel
          grupoId={acerto.id}
          grupoNome={acerto.nome}
          aoFechar={() => setAcerto(null)}
        />
      </Wrapper>
    );
  }

  if (despesas) {
    return (
      <Wrapper>
        <ExpensePanel grupo={despesas} aoFechar={() => setDespesas(null)} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {aberto ? (
        <GroupForm aoCriar={carregar} />
      ) : (
        <CreateGroupButton onClick={() => setAberto(true)} />
      )}
      <GroupList grupos={grupos} aoVerAcerto={setAcerto} aoVerDespesas={setDespesas} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  padding: 40px 16px;
`;
