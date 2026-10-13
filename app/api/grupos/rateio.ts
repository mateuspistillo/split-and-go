export function calcularRateio( valorTotalCentavos: number, quantidadeParticipantes: number) : number[] {
    if (!Number.isInteger(valorTotalCentavos) || valorTotalCentavos <= 0) {
        throw new Error("O valor da despesa deve ser positivo em centavos");
    } 

    if (
        !Number.isInteger(quantidadeParticipantes) || quantidadeParticipantes <= 0
    ) {
        throw new Error("É necessário pelo menos um participante");
    }

    const valorBase = Math.floor(
        valorTotalCentavos / quantidadeParticipantes
    );

    const centavosRestantes = valorTotalCentavos % quantidadeParticipantes;

    return Array.from(
        {length: quantidadeParticipantes},
        (_, indice) => valorBase + (indice < centavosRestantes ? 1 : 0)
    );
}

export function calcularRateioPorcentagem(
    valorTotalCentavos: number, porcentagens: number[]
): number[] {
    if (!Number.isInteger(valorTotalCentavos) || valorTotalCentavos <= 0) {
        throw new Error("O valor da despesa deve ser positivo e em centavos");
    }

    if (porcentagens.length === 0 || porcentagens.some((p) => !Number.isFinite(p) || p < 0 || p > 100) ) {
        throw new Error("As porcentagens informadas são inválidas");
    }

    const somaPorcentagens = porcentagens.reduce(
        (soma, porcentagem) => soma + porcentagem,
        0
    );

    if (Math.abs(somaPorcentagens - 100) > 0.000001) {
        throw new Error("As porcentagens devem somar 100%");
    }

    const valoresExatos = porcentagens.map(
        (porcentagem) => (valorTotalCentavos * porcentagem) / 100
    );

    const valoresFinais = valoresExatos.map(Math.floor);

    let centavosRestantes = 
    valorTotalCentavos -
    valoresFinais.reduce((soma, valor) => soma + valor, 0);

    const indicesOrdenados = valoresExatos
    .map((valor, indice) => ({
        indice,
        resto: valor - Math.floor(valor),
    }))

    .sort((a, b) => b.resto - a.resto);

    for (let i = 0; i < centavosRestantes; i++) {
        valoresFinais[indicesOrdenados[i].indice]++;
    }

    return valoresFinais;
}

export function validarValorDespesa(valorTotalCentavos: number): void {
    if (
        !Number.isInteger(valorTotalCentavos) ||
        valorTotalCentavos <= 0
    ) {
        throw new Error("O valor da despesa deve ser positivo em centavos.");
    }
}

export function validarPagador(
    grupoIdDespesa: number,
    grupoIdPagador: number
): void {
    // O grupo do pagador precisa ser o mesmo da despesa
    if (grupoIdDespesa !== grupoIdPagador) {
        throw new Error("O pagador não pertence a este grupo.");
    }
}

export function validarParticipantesRateio (
    quantidadeParticipantes: number
): void {
    // Não se pode dividir uma despesa sem participantes
    if (!Number.isInteger(quantidadeParticipantes) || quantidadeParticipantes <= 0) {
        throw new Error(
            "É necessário pelo menos um participante no rateio"
        );
    }
}