import Taro, { memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'

function PublishLocation() {
  return (
    <View className='publish-location'>
      <View className='location-wrapper'>
        <AtIcon value='map-pin' size='16' color='#FE5155' />
        <Text className='text'>
        所在地：未知
        </Text>
      </View>
    </View>
  )
}

export default memo(PublishLocation)

