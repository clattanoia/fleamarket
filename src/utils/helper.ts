
export function cleanArrayEmpty<T>(arg: Array<T>): Array<T> {
  const output: Array<T> = []
  arg.forEach(item => item && output.push(item))

  return output
}

export function desensitizationContact(type, content) {
  let maskContent
  if(type === 'EMAIL') {
    maskContent = content.replace(/(^[a-zA-Z0-9_\\.-]+)(@[a-zA-Z0-9_\\.-]+$)/, '****$2')
  } else if(type === 'PHONE') {
    maskContent = content.replace(/(\d{4})(\d{4}$)/, '****$2')
  } else if(type === 'WECHAT') {
    maskContent = content.replace(/(^[\w-]{4})([\w-]+$)/, '$1****')
  }

  return maskContent
}
