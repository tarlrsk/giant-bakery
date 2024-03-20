export function fCurrency(x: number) {
  if (x === null || x === undefined) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
