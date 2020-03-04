import Taro, { memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.scss'

interface InProps {
  icon: string,
  title: string,
  count?: number,
  hasDivision?: boolean
  iconColor: string,
  handleClick: () => any,
}

function OperationItem(props: InProps) {
  return (
    <View className='operation-item' style={props.hasDivision ? {
      borderBottom: '1px solid #c8c8c8',
    } : ''}
    >
      <View className='left-container'>
        <AtIcon prefixClass='iconfont' value={props.icon} size="22" color={props.iconColor}></AtIcon>
        <Text className='title'>{props.title}</Text>
      </View>
      <View className='right-container' onClick={props.handleClick}>
        {props.count !== null && <Text className='count'>{props.count}</Text>}
        <AtIcon prefixClass='iconfont' value='iconright' size="22" color='#999898'></AtIcon>
      </View>
    </View>
  )
}

export default memo(OperationItem)
