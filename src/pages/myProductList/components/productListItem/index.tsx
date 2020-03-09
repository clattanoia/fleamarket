import Taro, { memo } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import classNames from 'classnames'

import { Product } from '../../../../interfaces/product'
import Tag from '../../../../components/tag'
import { Status } from '../../../../constants/enums'
import ExtendedContainer from '../../../../components/extendedContainer'

import styles from './index.module.scss'

interface InProps {
  item: Product,
  onClick: () => void,
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
    <View className={styles.item} onClick={props.onClick}>
      {
        item.coverUrl ?
          <Image className={styles.cover} mode="aspectFill" src={item.coverUrl as string} />
          : <View className={classNames(styles.defaultCover, styles.cover)} />
      }
      <View className={styles.info}>
        <ExtendedContainer maxLine={2} content={(item.title as string)} showSwitch={false} />
        {/*<View className={styles.title}><Text>{item.title}</Text></View>*/}
        <Tag tagName={tagName} />
        <View className={styles.price}><Text className={styles.priceUnit}>￥</Text>{item.price}</View>
        <View className={styles.readCount}>浏览次数：{item.readCount}</View>
      </View>
    </View>
  )
}

export default memo(ProductListItem)
