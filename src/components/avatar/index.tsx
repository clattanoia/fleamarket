import Taro, { memo } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'

import './index.scss'

interface InProps {
  userId: string;
  avatarUrl: string;
  nickname: string;
  avatarSize?: number;
  nameSize?: number;
  style?: {
    [key: string]: string
  };
  onClick?: (event: ITouchEvent) => any;
}

function Avatar(props: InProps) {
  const defaultSize = 100
  const defaultNameSize = 36
  return (
    <View className="avatar" onClick={props.onClick ? props.onClick : () => {}} data-id={props.userId}>
      <Image
        style={{
          width: `${props.avatarSize || defaultSize}rpx`,
          height: `${props.avatarSize || defaultSize}rpx`,
        }}
        className="image" src={props.avatarUrl}
      />
      <Text
        className="nickname"
        style={{
          fontSize: `${props.nameSize || defaultNameSize}rpx`,
        }}
      >{props.nickname}</Text>
    </View>
  )
}

export default memo(Avatar)
