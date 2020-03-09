import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { Product } from '../../../../interfaces/product'
import styles from './index.module.scss'

interface InProps {
  item: Product,
}

function ProductListItem(props: InProps) {
  console.log(styles)
  const { item } = props
  return (
    <View className={styles.item}>
      {item.title}
    </View>
  )
}

export default memo(ProductListItem)
