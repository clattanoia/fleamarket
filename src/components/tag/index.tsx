import Taro, { memo } from '@tarojs/taro'
import { Text } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'
import './index.scss'

interface InProps {
  tagName: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: {
    [key: string]: string
  };
  onClick?: (event: ITouchEvent) => any;
}

function Tag(props: InProps) {
  const defaultSize = '24'
  const defaultColor = '#e51c23'
  const defaultBgColor = '#ffe8e8'
  const style = {
    color: props.color || defaultColor,
    backgroundColor: props.backgroundColor || defaultBgColor,
    fontSize: `${props.size || defaultSize}rpx`,
    ...props.style
  }
  // TODO: classnames
  return (
    <Text className="flea-tag" style={style}>{props.tagName}</Text>
  )
}

export default memo(Tag)
