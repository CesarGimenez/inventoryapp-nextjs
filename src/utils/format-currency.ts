export const formatCurrency = (value: number) => {

    return new Intl.NumberFormat("es-ES", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(
        !value ? 0 : Number(value)
    );
};