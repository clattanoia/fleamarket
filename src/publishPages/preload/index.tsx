import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'

import styles from './index.module.scss'

function PublishPreload() {
  return (
    <View className={styles.preload}>
      <View className={classNames(styles.title, styles.animation, styles.bar)}></View>
      <View className={classNames(styles.price, styles.animation, styles.bar)}></View>
      <View className={classNames(styles.detail, styles.animation, styles.bar)}></View>
      <View className={classNames(styles.pictures, styles.animation, styles.bar)}></View>
      <View className={classNames(styles.category, styles.animation, styles.bar)}></View>
      <View className={classNames(styles.contacts, styles.animation, styles.bar)}></View>
    </View>
  )
}

export default memo(PublishPreload)
