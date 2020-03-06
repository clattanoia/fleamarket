import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface InProps {
  closeFloat: () => void
  visible: boolean
  type?: string
  children: any
}

function FloatLayout(props: InProps) {
  const { visible, closeFloat, type = '', children } = props

  const closeHandle = () => {
    closeFloat()
  }

  return (
    <View className={styles.floatBody} style={{ 'display': visible ? 'block' : 'none' }}>
      <View className={classnames(styles.floatContent, { 'fullScreen': type === 'search' })}>
        {children}
      </View>
      <View className={styles.shadow} onClick={closeHandle}></View>
    </View>
  )

}


export default memo(FloatLayout)
