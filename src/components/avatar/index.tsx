import Taro, { memo } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'

import './index.scss'
import certificateIcon from '../../assets/certification.png'

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
  const style = {
    width: `${avatarSize}rpx`,
    height: `${avatarSize}rpx`,
  }
  let avatar = avatarUrl
  if(avatar.indexOf('qiniu.2hj.com.cn') > -1) {
    avatar = avatar + '?imageMogr2/thumbnail/120x120'
  }
  return (
    <View className="avatar" onClick={onClick} data-id={userId} style={style}>
      <Image
        style={style}
        className="image" src={avatar}
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
