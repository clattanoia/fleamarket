import Taro, { memo } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'

import './index.scss'

interface InProps {
  userId: string;
  avatarUrl: string;
  avatarSize?: number;
  style?: {
    [key: string]: string
  };
  onClick?: (event: ITouchEvent) => any;
}

function Avatar(props: InProps) {
  const defaultSize = 100
  return (
    <View className="avatar" onClick={props.onClick ? props.onClick : () => {}} data-id={props.userId}>
      <Image
        style={{
          width: `${props.avatarSize || defaultSize}rpx`,
          height: `${props.avatarSize || defaultSize}rpx`,
        }}
        className="image" src={props.avatarUrl}
      />
    </View>
  )
}

export default memo(Avatar)
