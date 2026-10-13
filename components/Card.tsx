"use client";

import styled from "styled-components";
import type { ReactNode } from "react";

export default function Card(
    { children }: { children: ReactNode }
) {
  return (
    <CardArea>
        {children}
    </CardArea>
  )
}

const CardArea = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 620px;
  padding: 50px;
  background: rgba(139, 125, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(139, 125, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
`;