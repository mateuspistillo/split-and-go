"use client";

import styled from "styled-components";
import type { ReactNode } from "react";

export default function PageContainer(
    { children }: { children: ReactNode }
) {
  return (
    <Container>
        {children}
    </Container>
  )
}

const Container = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0d0c16;
`;