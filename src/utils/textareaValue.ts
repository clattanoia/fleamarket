export function getLineText(publishValue){
  if(typeof publishValue !== 'string'){
    return ''
  }
  const valueText = publishValue.replace(/<br\/>/g, '\n').replace(/&nbsp;/g, ' ')
  return valueText
}


export function setLineCode(value) {
  const publishValue = value.replace(/\r{0,}\n/g, '<br/>').replace(/\s/g, '&nbsp;')
  return publishValue
}

