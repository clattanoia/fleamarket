import Taro, { memo } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import classNames from 'classnames'

import { Product } from '../../../../interfaces/product'
import Tag from '../../../../components/tag'
import { Status } from '../../../../constants/enums'

import styles from './index.module.scss'

interface InProps {
  item: Product,
}

const STATUS_MAPPING = {
  [Status.FOR_SALE]: '未下架',
  [Status.SALE_OUT]: '已下架',
  [Status.FREEZE]: '已冻结',
}

function ProductListItem(props: InProps) {
  const { item } = props

  const tagName = STATUS_MAPPING[item.status as Status]
  return (
    <View className={styles.item}>
      {
        item.coverUrl ?
          <Image className={styles.cover} mode="aspectFill" src={item.coverUrl as string} />
          : <View className={classNames(styles.defaultCover, styles.cover)} />
      }
      <View className={styles.info}>
        <View>{item.title}</View>
        <Tag tagName={tagName} />
        <View className={styles.price}><Text className={styles.priceUnit}>￥</Text>{item.price}</View>
        <View className={styles.readCount}>浏览次数：{item.readCount}</View>
      </View>
    </View>
  )
}

export default memo(ProductListItem)
