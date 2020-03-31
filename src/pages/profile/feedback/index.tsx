import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import styles from './index.module.scss'


function Feedback() {

  const getPaste = () => {
    Taro.setClipboardData({
      data: 'https://jinshuju.net/f/xcpEai',
      success(res) {
        console.log(res)
      },
    })
  }

  return (
    <View className={styles.feedback}>
      <View className={styles.feedbackHeader}>
        反馈/建议链接
      </View>
      <View className={styles.feedbackTips}>
        由于小程序限制，请复制下面的按钮获取连接，在浏览器打开
      </View>
      {/* <View>
        <Text selectable>https://jinshuju.net/f/xcpEai</Text>
      </View> */}
      <View>
        <AtButton
          type="primary"
          onClick={getPaste}
        >获取链接</AtButton>
      </View>
    </View>
  )
}

Feedback.config = {
  navigationBarTitleText: '反馈/建议',
}

export default memo(Feedback)
