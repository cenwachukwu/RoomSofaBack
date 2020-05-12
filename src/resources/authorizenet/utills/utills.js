export async function getAmount() {
  return (Math.random() * 100 + 1).toFixed(2);
}
export async function getDate() {
  return new Date().toISOString().substring(0, 10);
}
