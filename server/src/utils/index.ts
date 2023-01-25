export function toSQLDate(date: Date) {
  const now = new Date();
  date.setFullYear(now.getFullYear());
  date.setMonth(now.getMonth());
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getRandom<T>(array: T[]) {
  const id = Math.round(Math.random() * (array.length - 1));
  if (id < 0 || id >= array.length) {
    throw new Error("id is wrong");
  }
  return array[id];
}

export function getInstances<T>(func: () => T, count: number) {
  return Array(count)
    .fill(null)
    .map(() => func());
}
