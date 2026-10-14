"use client";

import styled from "styled-components";

export type Grupo = { id: number; nome: string; participantes: string[] };

export default function GroupList({
  grupos,
  aoVerAcerto, 
}: { 
  grupos: Grupo[];
  aoVerAcerto: (grupo: Grupo) => void;
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
                    <SettleButton type="button" onClick={() => aoVerAcerto(g)}>
            Ver acerto de contas
          </SettleButton>
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
  margin: 0 0 12px;
  font-size: 14px;
  color: #a5a8c4;
`;

const Empty = styled.p`
  margin: 0;
  font-size: 14px;
  color: #a5a8c4;
`;

const SettleButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #8b7dff;
  background: transparent;
  border: 1px dashed #8b7dff;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(139, 125, 255, 0.15);
    color: #f3f4f6;
  }
`;
