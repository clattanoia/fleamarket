import Taro, { memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.scss'

interface InProps {
  icon: string,
  title: string,
  count: number,
}

function OperationItem(props: InProps) {
  return (
    <View className='operation-item'>
      <View className='left-container'>
        <AtIcon prefixClass='iconfont' value={props.icon} size="22" color='#999898'></AtIcon>
        <Text className='title'>{props.title}</Text>
      </View>
      <View className='right-container'>
        <Text className='count'>{props.count}</Text>
        <AtIcon prefixClass='iconfont' value='iconright' size="22" color='#999898'></AtIcon>
      </View>
    </View>
  )
}

export default memo(OperationItem)
