import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'

import styles from './index.module.scss'

function ProductListPreload() {
  return (
    <View className={styles.wrapperList}>
      {[1, 2, 3, 4].map(index => {
        return (
          <View className={classNames(styles.listItem, styles.preload)} key={index}>
            <View className={classNames(styles.cover)}>
            </View>
            <View className={classNames(styles.title, styles.animation, styles.bar)}></View>
            <View className={classNames(styles.title, styles.animation, styles.bar)}></View>
            <View className={classNames(styles.title, styles.animation, styles.bar)}></View>
          </View>
        )
      })}
    </View>
  )
}

export default memo(ProductListPreload)
