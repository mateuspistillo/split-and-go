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
