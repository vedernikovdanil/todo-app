export function toSQLDate(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
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
