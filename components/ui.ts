"use client";

import styled from "styled-components";

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 620px;
  padding: 40px;
  background: rgba(139, 125, 255, 0.1);
  border: 1px solid rgba(139, 125, 255, 0.3);
  border-radius: 16px;
  color: #f3f4f6;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
`;

export const Subtitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
`;

export const Item = styled(Row)`
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
`;

export const Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Muted = styled.p`
  margin: 0;
  font-size: 13px;
  color: #a5a8c4;
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #fca5a5;
`;

export const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
`;

export const Input = styled.input`
  padding: 10px 12px;
  font-size: 15px;
  color: #f3f4f6;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 8px;
  outline: none;
`;

export const InputSmall = styled(Input)`
  width: 110px;
`;

export const Select = styled.select`
  padding: 10px 12px;
  font-size: 15px;
  color: #f3f4f6;
  background: #1c1a36;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 8px;
`;

export const PrimaryButton = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #5b4bdb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

export const GhostButton = styled.button`
  align-self: flex-start;
  padding: 8px 12px;
  font-size: 14px;
  color: #8b7dff;
  background: transparent;
  border: 1px dashed #8b7dff;
  border-radius: 8px;
  cursor: pointer;
`;