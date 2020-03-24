import Taro, { memo } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

function Feedback() {
  Taro.setNavigationBarTitle({
    title: '建议/反馈',
  })

  return (
    <WebView src="https://jinshuju.net/f/xcpEai" />
  )
}

export default memo(Feedback)
