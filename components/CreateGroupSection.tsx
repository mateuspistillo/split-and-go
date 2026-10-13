"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import CreateGroupButton from "./CreateGroupButton";
import GroupForm from "./GroupForm";
import GroupList, { type Grupo } from "./GroupList";

export default function CreateGroupSection() {
  const [aberto, setAberto] = useState(false);
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  async function carregar() {
    const resposta = await fetch("/api/grupos");
    setGrupos(await resposta.json());
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Wrapper>
      {aberto ? (
        <GroupForm aoCriar={carregar} />
      ) : (
        <CreateGroupButton onClick={() => setAberto(true)} />
      )}
      <GroupList grupos={grupos} />
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