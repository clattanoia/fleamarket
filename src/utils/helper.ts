
export function cleanArrayEmpty<T>(arg: Array<T>): Array<T> {
  const output: Array<T> = []
  arg.forEach(item => item && output.push(item))

  return output
}
