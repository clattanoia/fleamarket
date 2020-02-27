export function getLineText(publishValue){
  const valueText = publishValue.replace(/<br\/>/g, '\n')
  return valueText
}


export function setLineCode(value) {
  const publishValue = value.replace(/\r{0,}\n/g, '<br/>')
  return publishValue
}

