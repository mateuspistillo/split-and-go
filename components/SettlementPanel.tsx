"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { formatarReais } from "@/lib/formatar";
import { Panel, Title, Subtitle, Section, Row, Muted, GhostButton } from "./ui";

type Saldo = { id: number; nome: string; saldo: number };
type Pagamento = { de: string; para: string; valorCentavos: number };
type Liquidacao = {
    saldos: Saldo[];
    somaSaldos: number;
    pagamentos: Pagamento[];
};

const Valor = styled.strong<{ $positivo: boolean }>`
    color: ${(p) => (p.$positivo ? "#6ee7b7" : "#fca5a5")};
`;

export default function SettlementPanel({
    grupoId,
    grupoNome,
    aoFechar,
}: {
    grupoId: number;
    grupoNome: string;
    aoFechar: () => void;
}) {
    const [dados, setDados] = useState<Liquidacao | null>(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
        const resposta = await fetch(`/api/liquidacao?grupoId=${grupoId}`);
        const json = await resposta.json();
        if (!resposta.ok) {
            setErro(json.erro);
            return;
        }
        setDados(json);
        }
        carregar();
    }, [grupoId]);

    return (
        <Panel>
            <Title>Acerto de contas: {grupoNome}</Title>

            {erro && <Muted>{erro}</Muted>}
            {!dados && !erro && <Muted>Carregando...</Muted>}

            {dados && (
                <>
                    <Section>
                        <Subtitle>Saldo de cada pessoa</Subtitle>
                        {dados.saldos.map((s) => (
                        <Row key={s.id}>
                            <span>{s.nome}</span>
                            <Valor $positivo={s.saldo >= 0}>
                            {s.saldo >= 0 ? "recebe " : "deve "}
                            {formatarReais(Math.abs(s.saldo))}
                            </Valor>
                        </Row>
                        ))}
                        <Muted>Soma dos saldos: {formatarReais(dados.somaSaldos)}</Muted>
                    </Section>

                    <Section>
                        <Subtitle>Quem paga quem</Subtitle>
                        {dados.pagamentos.length === 0 ? (
                            <Muted>
                                Nada para acertar: não há despesas, ou todos estão quites.
                            </Muted>
                        ) : (
                            <>
                                {dados.pagamentos.map((p, i) => (
                                    <Row key={i}>
                                        <span>
                                        {p.de} paga a {p.para}
                                        </span>
                                        <strong>{formatarReais(p.valorCentavos)}</strong>
                                    </Row>
                                ))}
                                <Muted>{dados.pagamentos.length} pagamento(s) no total</Muted>
                            </>
                        )}
                    </Section>
                </>
            )}

            <GhostButton type="button" onClick={aoFechar}>
                Voltar
            </GhostButton>
        </Panel>
    );
}