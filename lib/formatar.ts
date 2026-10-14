export function formatarReais(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function paraCentavos(texto: string): number {
  return Math.round(Number(texto.replace(",", ".")) * 100);
}