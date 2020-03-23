import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'

import styles from './index.module.scss'

function ProductListPreload() {
  return (
    <View>
      {[1, 2, 3, 4].map(index => {
        return (
          <View className={styles.preload} key={index}>
            <View className={styles.cover}>
            </View>
            <View className={styles.info}>
              <View className={classNames(styles.title, styles.animation, styles.bar)}></View>
              <View className={classNames(styles.title, styles.animation, styles.bar)}></View>
              <View className={classNames(styles.tag, styles.animation, styles.bar)}></View>
              <View className={classNames(styles.price, styles.animation, styles.bar)}></View>
              <View className={classNames(styles.readCount, styles.animation, styles.bar)}></View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default memo(ProductListPreload)
