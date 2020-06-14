import Taro, { memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useDispatch } from '@tarojs/redux'
import cls from 'classnames'
import { AtIcon } from 'taro-ui'
import './index.scss'
import { Location } from '../../interfaces/detail'
import { setLocationSelect } from '../../actions/global'
import { isValidLocationInfo } from '../../utils/helper'

interface Props {
  location?: Location
}

function PublishLocation(props: Props) {
  const dispatch = useDispatch()
  const { location } = props
  const provinceName = location?.province?.name || ''
  const cityName = location?.city?.name || ''
  const classname = cls({
    'publish-location': true,
    'unknown-location': !location,
  })

  const handleClick = () => {
    isValidLocationInfo(location) && dispatch(setLocationSelect(location))

    Taro.navigateTo({
      url: '/pages/locationSelect/index',
    })
  }

  return (
    <View className={classname}>
      <View className='location-wrapper' onClick={handleClick}>
        <AtIcon value='map-pin' size='16' color='#FE5155' />
        <Text className='text'>
          { isValidLocationInfo(location) ? `${provinceName} ${cityName}` : '点击选择地址'}
        </Text>
      </View>
    </View>
  )
}

export default memo(PublishLocation)

