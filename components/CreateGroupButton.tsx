"use client";

import styled from "styled-components";


export default function CreateGroupButton() {
  return ( 
    <Button>
      CRIAR UM GRUPO NOVO
    </Button>
  )
}

const Button = styled.button`
  padding: 12px 24px;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  background: #059669;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #047857;
  }
`;