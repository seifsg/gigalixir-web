const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})
export const formatMoney = (cents: number): string => {
  return formatter.format(cents / 100.0)
}

export default formatMoney
