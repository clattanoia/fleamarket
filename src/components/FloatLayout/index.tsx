import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'

import styles from './index.module.scss'

interface InProps {
  closeFloat: () => void
  visible: boolean
  children: any
}

function FloatLayout(props: InProps) {
  const { visible, closeFloat } = props

  const closeHandle = () => {
    closeFloat()
  }

  return (
    <View className={styles.floatBody} style={{ 'display': visible ? 'block' : 'none' }}>
      <View className={styles.floatContent}>
        {props.children}
      </View>
      <View className={styles.shadow} onClick={closeHandle}></View>
    </View>
  )

}


export default memo(FloatLayout)
