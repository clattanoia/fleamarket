import Taro, { memo, useState } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtButton, AtModal, AtToast } from 'taro-ui'

import { Product } from '../../../../interfaces/product'
import Tag from '../../../../components/tag'
import { Status, ProductType } from '../../../../constants/enums'
import ExtendedContainer from '../../../../components/extendedContainer'

import styles from './index.module.scss'
import defaultProductCover from '../../../../assets/default_product_cover.png'
import { unCollectMutation } from '../../../../query/collect'
import client from '../../../../graphql-client'

interface InProps {
  item: Product,
  onClick: () => void,
  productType: ProductType
}

const STATUS_MAPPING = {
  [Status.FOR_SALE]: '未下架',
  [Status.SALE_OUT]: '已下架',
  [Status.FREEZE]: '已冻结',
}

function ProductListItem(props: InProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [isToastOpened, setIsToastOpened] = useState(false)
  const [toastText, setToastText] = useState('')
  const { item = {}} = props
  const tagName = STATUS_MAPPING[item.status as Status]

  const cancleCollect = (e) => {
    e.stopPropagation()
    setIsOpened(true)
  }

  const handleConfirm = async() => {
    const { productType, item } = this.props
    const collectInput = {
      productId: item.id,
      productType,
    }
    try {
      await client.mutate({
        mutation: unCollectMutation,
        variables: { collectInput },
      })
    } catch (err){
      console.log(err)
      setToastText('操作失败，请稍后重试')
      setIsToastOpened(true)
    } finally {
      setIsOpened(false)
    }
  }

  const handleClose = () => {
    setIsOpened(false)
  }

  const handleCancel = () => {
    setIsOpened(false)
  }

  const handleCloseToast = () => {
    setToastText('')
    setIsToastOpened(false)
  }

  return (
    <View>
      <View className={styles.item}>
        <Image className={styles.cover} mode="aspectFill" src={item.coverUrl as string || defaultProductCover}  onClick={props.onClick} />
        <View className={styles.info}>
          <ExtendedContainer maxLine={2} content={(item.title as string)} showSwitch={false} />
          <Tag tagName={tagName} />
          <View className={styles.price}><Text className={styles.priceUnit}>￥</Text>{item.price}</View>
          <View className={styles.operate}>
            <View className={styles.readCount}>浏览次数：{item.readCount}</View>
            <View>
              <AtButton size="small" onClick={cancleCollect}>取消收藏</AtButton>
            </View>
          </View>
        </View>
      </View>
      <AtModal
        isOpened={isOpened}
        title='确认取消收藏该”二货“吗？'
        cancelText='取消'
        confirmText='确认'
        onClose={handleClose}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <AtToast
        isOpened={isToastOpened}
        hasMask
        text={toastText}
        onClose={handleCloseToast}
      >
      </AtToast>
    </View>
  )
}

export default memo(ProductListItem)
