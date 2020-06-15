import { navigateTo, getCurrentPages, redirectTo } from '@tarojs/taro'
import get from 'lodash/get'
import isPlainObject from 'lodash/isPlainObject'
import { Location, DistrictInfo } from '../interfaces/detail'

const MAX_ROUTE_LENGTH  = 10
const SpecialAreaPrefix = ['11', '12', '31', '50', '81', '82']

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

export const delay = (millisecond: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), millisecond)
  })
}

export const navigateWithFallback = (option: navigateTo.Option) => {
  try {
    const { length } = getCurrentPages()

    if(length < MAX_ROUTE_LENGTH) {
      return navigateTo(option)
    } else {
      return redirectTo(option)
    }
  } catch (e) {
    return redirectTo(option)
  }
}

export const isTypeLocationInfo = (loc: any): boolean => {
  try {
    if(!loc) return false
    if(!isPlainObject(loc)) return false

    const locationKeys = ['province', 'city']
    const objKeys = Object.keys(loc)

    return locationKeys.every(key => objKeys.includes(key))
  } catch (e) {
    return false
  }
}

export const isValidLocationInfo = (loc: Location | undefined): boolean => {
  try {
    if(!loc) return false

    const path = ['province.id', 'province.name', 'city.id', 'city.name']
    return path.every(p => get(loc, p, '').length > 0)
  } catch (e) {
    return false
  }
}

export const isValidDistrictInfo = (dis: DistrictInfo | undefined): boolean => {
  try {
    if(!dis) return false

    const path = ['id', 'name']
    return path.every(p => get(dis, p, '').length > 0)
  } catch (e) {
    return false
  }
}

export const isSpecialArea = (id: string): boolean =>  {
  try {
    if(!id) return false
    return SpecialAreaPrefix.includes(id.substring(0, 2))
  } catch (e) {
    return false
  }
}

export const getDisplayLocationText = (location?: Location): string => {
  if(!location) return ''
  const provinceId = location.province?.id || ''
  const provinceName = location.province?.name || ''
  const cityName = location.city?.name || ''

  if(isSpecialArea(provinceId)) {
    return provinceName
  } else {
    return `${provinceName} ${cityName}`
  }
}
