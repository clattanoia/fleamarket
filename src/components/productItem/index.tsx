import Taro, { memo } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import styles from './index.module.scss'
import defaultProductCover from '../../assets/default_product_cover.png'
import ExtendedContainer from '../extendedContainer'

interface InProps {
  productData: Global.Goods
}

function ProductItem(props: InProps) {
  const { productData = { owner: {}}} = props

  return (
    <View className={styles.productItem}>
      <View className={styles.goodsImage}>
        <Image className={styles.goodsImg} mode="widthFix" src={productData.coverUrl || defaultProductCover} />
      </View>
      <View className={styles.goodsName}>
        <ExtendedContainer content={productData.title} maxLine={2} showSwitch={false} />
      </View>
      <View className={styles.detail}>
        <Text className={styles.goodsPrice}><Text className='unit'>￥</Text>{productData.price}</Text>
        <Text className={styles.goodsTag}>{productData.categoryName}</Text>
      </View>
      <View className={styles.userInfo}>
        <AtAvatar circle size="small" image={productData.owner.avatarUrl}></AtAvatar>
        <Text className={styles.name}>{productData.owner.nickname}</Text>
      </View>
    </View>
  )

}


export default memo(ProductItem)
