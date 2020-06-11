import Taro, { memo } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import Avatar from '../avatar'
import ExtendedContainer from '../extendedContainer'
import defaultProductCover from '../../assets/default_product_cover.png'
import { CertifyEmail } from '../../constants/enums'

import styles from './index.module.scss'


interface InProps {
  productData: Global.Goods
}

function ProductItem(props: InProps) {
  const { productData = { owner: {}, location: {}}} = props

  const coverUrl = (productData.coverUrl || '').indexOf('qiniu.2hj.com.cn') > -1 ?
    `${productData.coverUrl}?imageMogr2/thumbnail/300x300`
    : productData.coverUrl

  return (
    <View className={styles.productItem}>
      <View className={styles.goodsImage}>
        <Image className={styles.goodsImg} mode="widthFix" src={coverUrl || defaultProductCover} />
      </View>
      <View className={styles.goodsName}>
        <ExtendedContainer content={productData.title} maxLine={2} showSwitch={false} />
      </View>
      <View className={styles.detail}>
        <Text className={styles.goodsPrice}><Text className='unit'>￥</Text>{productData.price}</Text>
        <Text className={styles.goodsTag}>{productData.categoryName}</Text>
      </View>
      <View className={styles.userInfo}>
        <Avatar
          certificate={productData.owner.certification === CertifyEmail.CERTIFIED}
          userId={productData.owner.id}
          avatarUrl={productData.owner.avatarUrl}
          avatarSize={64}
        />
        <Text className={styles.name}>{productData.owner.nickname}</Text>
        <Text className={styles.location}>{productData.location.city.name || ''}</Text>
      </View>
    </View>
  )

}


export default memo(ProductItem)
