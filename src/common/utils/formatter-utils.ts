// 금액(숫자 콤마)
export function costFormatter(num: string): string {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
}
