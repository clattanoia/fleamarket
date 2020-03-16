import Taro, { memo } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'

import './index.scss'
import certificateIcon from '../../assets/certificate-1.png'

interface InProps {
  userId: string;
  avatarUrl: string;
  avatarSize?: number;
  certificate?: boolean,
  style?: {
    [key: string]: string
  };
  onClick?: (event: ITouchEvent) => any;
}

function Avatar({
  userId = '',
  avatarUrl = '',
  avatarSize = 100,
  onClick = () => {},
  certificate = false,
}: InProps) {
  return (
    <View className="avatar" onClick={onClick} data-id={userId}>
      <Image
        style={{
          width: `${avatarSize}rpx`,
          height: `${avatarSize}rpx`,
        }}
        className="image" src={avatarUrl}
      />
      {
        certificate ?
          <Image className="certificate" src={certificateIcon} />
          : null
      }
    </View>
  )
}

export default memo(Avatar)
