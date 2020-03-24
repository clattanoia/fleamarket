import Taro, { memo } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

function Feedback() {
  Taro.setNavigationBarTitle({
    title: '建议/反馈',
  })

  return (
    <WebView src="https://jinshuju.2hj.com.cn/f/xcpEai" />
  )
}

export default memo(Feedback)
