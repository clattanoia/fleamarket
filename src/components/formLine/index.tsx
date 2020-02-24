import { ReactNodeLike } from 'prop-types'
import Taro, { memo } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'

import './index.scss'


interface InProps {
  title: string,
  children: ReactNodeLike,
}

function FormLine(props: InProps) {
  return (
    <View className='form_line'>
      <View>
        <Text className='form_line_required'>*</Text>
        <Text className='form_line_label'>{props.title}</Text>
      </View>
      <View className='form_line_content'>
        {props.children}
      </View>
    </View>
  )
}

export default memo(FormLine)
