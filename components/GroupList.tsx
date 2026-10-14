"use client";

import styled from "styled-components";

export type Grupo = { id: number; nome: string; participantes: string[]; membros: { id: number; nome: string }[]; };

export default function GroupList({ 
  grupos,
  aoVerAcerto,
  aoVerDespesas, 
}: { 
  grupos: Grupo[];
  aoVerAcerto: (grupo: Grupo) => void;
  aoVerDespesas: (grupo: Grupo) => void;
 }) {
  if (grupos.length === 0) {
    return <Empty>Nenhum grupo criado ainda.</Empty>;
  }

  return (
    <List>
      {grupos.map((g) => (
        <Item key={g.id}>
          <Name>{g.nome}</Name>
          <Members>{g.participantes.join(", ")}</Members>
        </Item>
      ))}
    </List>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 620px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  padding: 16px 20px;
  background: rgba(139, 125, 255, 0.1);
  border: 1px solid rgba(139, 125, 255, 0.3);
  border-radius: 12px;
`;

const Name = styled.p`
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 600;
  color: #f3f4f6;
`;

const Members = styled.p`
  margin: 0;
  font-size: 14px;
  color: #a5a8c4;
`;

const Empty = styled.p`
  margin: 0;
  font-size: 14px;
  color: #a5a8c4;
`;