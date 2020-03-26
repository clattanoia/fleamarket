import Taro, { memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'



function Feedback() {

  return (
    <View className={styles.feedback}>
      <View className={styles.feedbackHeader}>
        反馈/建议链接
      </View>
      <View className={styles.feedbackTips}>
        由于小程序限制，请复制下面的链接，在浏览器打开
      </View>
      <View>
        {/* <Navigator url="https://jinshuju.net/f/xcpEai">链接</Navigator> */}
        <Text selectable>https://jinshuju.net/f/xcpEai</Text>
      </View>
    </View>
  )
}

Feedback.config = {
  navigationBarTitleText: '反馈/建议',
}

export default memo(Feedback)
