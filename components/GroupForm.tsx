"use client";

import styled from "styled-components";
import { useState } from "react";
import Card from "./Card"

export default function GroupForm() {
  const [nome, setNome] = useState("");
  const [participantes, setParticipantes] = useState(["", ""]);
  const [erroNome, setErroNome] = useState("");

  async function criarGrupo() {
    if (nome.trim() === "") {
      setErroNome("Por favor, escolha um nome para o grupo.");
      return;
    }

    setErroNome("");

    const resposta = await fetch("/api/grupos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, participantes }),
    });

    const dados = await resposta.json();
    console.log(resposta.status, dados);
  }
  
  return (
    <Card>
      <Title>NOVO GRUPO</Title>

      <Field>
        <Label htmlFor="nome-grupo">Nome do grupo</Label>
        <Input
          id="nome-grupo"
          placeholder="Ex.: Viagem para a praia"
          value={nome || ""}
          onChange={(e) => setNome(e.target.value)}
        />
        {erroNome && <Hint>{erroNome}</Hint>}
      </Field>

      <Field>
        <Label htmlFor="participantes">Participantes</Label>

        {participantes.map((participante, index) => (
          <Input
            key={index}
            id={`participante-${index}`}
            placeholder="Nome do participante"
            value={participante}
            onChange={(e) => {
              const novaLista = [...participantes];
              novaLista[index] = e.target.value;
              setParticipantes(novaLista);
            }}
          />
        ))}

        <Hint>Um grupo precisa de pelo menos dois participantes.</Hint>
      </Field>

      <AddButton
        type="button"
        onClick={() => {
          setParticipantes([...participantes, ""]);
        }}
      >
        Adicionar participante
      </AddButton>
      <SubmitButton
        type="button"
        onClick={criarGrupo}
      >
        Criar grupo
      </SubmitButton>
    </Card>
  );
}

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #f3f4f6;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 17px;
  font-weight: 600;
  color: #f3f4f6;
`;

const Hint = styled.p`
  margin: 0;
  font-size: 13px;
  color: #a5a8c4;
`;

const Input = styled.input`
  padding: 12px 14px;
  font-size: 16px;
  color: #f3f4f6;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 8px;
  outline: none;
  margin-bottom: 18px;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;

  &:focus {
    border-color: #8b7dff;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(139, 125, 255, 0.3);
  }

  &::placeholder {
    color: #a5a8c4;
  }
`;

const AddButton = styled.button`
  align-self: flex-start;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #8b7dff;
  background: transparent;
  border: 1px dashed #8b7dff;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: rgba(139, 125, 255, 0.15);
    color: #f3f4f6;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #5b4bdb;
  border: none;
  text-transform: uppercase;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #6c5ce7;
  }
`;