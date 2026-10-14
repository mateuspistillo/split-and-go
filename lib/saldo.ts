export type Saldo = { id: number, nome: string, saldo: number };

export type Pagamento = {
    deId: number; 
    de: string;
    paraId: number;
    para: string;
    valorCentavos: number;
};

function maiorCredor(lista: Saldo[]): Saldo | null {
    let melhor: Saldo | null = null;
    for (const s of lista) {
        if (s.saldo > 0 && (melhor === null || s.saldo > melhor.saldo)) {
            melhor = s;
        }
    }
    return melhor;
}

function maiorDevedor(lista: Saldo[]): Saldo | null {
    let melhor: Saldo | null = null;
    for (const s of lista) {
        if (s.saldo < 0 && (melhor === null || s.saldo < melhor.saldo)) {
            melhor = s;
        }
    }
    return melhor;
}

export function simplificarSaldos(saldos: Saldo[]): Pagamento[] {
    const restantes = saldos.map((s) => ({ ...s }));
    const pagamentos: Pagamento[] = [];
    
    let credor = maiorCredor(restantes);
    let devedor = maiorDevedor(restantes);

    while (credor && devedor) {
        const valor = Math.min(credor.saldo, -devedor.saldo);

        pagamentos.push({
            deId: devedor.id,
            de: devedor.nome,
            paraId: credor.id,
            para: credor.nome,
            valorCentavos: valor,
        });

        credor.saldo -= valor;
        devedor.saldo += valor;

        credor = maiorCredor(restantes);
        devedor = maiorDevedor(restantes);
    }
    return pagamentos;
}
