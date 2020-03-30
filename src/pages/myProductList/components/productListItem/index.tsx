import Taro, { memo, useState } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtButton, AtModal, AtToast } from 'taro-ui'
import { useDispatch } from '@tarojs/redux'

import { Product } from '../../../../interfaces/product'
import Tag from '../../../../components/tag'
import { Status, ProductType, Origin } from '../../../../constants/enums'
import ExtendedContainer from '../../../../components/extendedContainer'

import styles from './index.module.scss'
import defaultProductCover from '../../../../assets/default_product_cover.png'
import { unCollectMutation } from '../../../../query/collect'
import client from '../../../../graphql-client'
import { DELETE_MY_COLLECT_LIST_DATA } from '../../../../constants/actionTypes'

interface InProps {
  item: Product,
  onClick: () => void,
  productType?: ProductType
  origin?: Origin
}

const STATUS_MAPPING = {
  [Status.FOR_SALE]: '未下架',
  [Status.SALE_OUT]: '已下架',
  [Status.FREEZE]: '已冻结',
}

function ProductListItem(props: InProps) {
  const dispatch = useDispatch()

  const [isOpened, setIsOpened] = useState(false)
  const [isToastOpened, setIsToastOpened] = useState(false)
  const [toastText, setToastText] = useState('')
  const { item = {}} = props
  const tagName = STATUS_MAPPING[item.status as Status]

  const cancleCollect = () => {
    setIsOpened(true)
  }

  const handleConfirm = async() => {
    const { productType, item } = this.props
    const productId = item.id
    const collectInput = {
      productId,
      productType,
    }
    try {
      await client.mutate({
        mutation: unCollectMutation,
        variables: { collectInput },
      })
      dispatch({ type: DELETE_MY_COLLECT_LIST_DATA, payload: productId })
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

  const cover = (item.coverUrl || '').indexOf('qiniu.2hj.com.cn') > -1 ?
    `${item.coverUrl}?imageMogr2/thumbnail/300x300`
    : item.coverUrl

  return (
    <View className={styles.itemWrapper}>
      <View>
        {this.props.origin === Origin.COLLECT && <View className={styles.collectBtn}><AtButton size="small" onClick={cancleCollect}>取消收藏</AtButton></View>}
      </View>
      <View className={styles.item} onClick={props.onClick}>
        <Image className={styles.cover} mode="aspectFill" src={cover || defaultProductCover} />
        <View className={styles.info}>
          <ExtendedContainer maxLine={2} content={(item.title as string)} showSwitch={false} />
          <Tag tagName={tagName} />
          <View className={styles.price}><Text className={styles.priceUnit}>￥</Text>{item.price}</View>
          <View>
            <View className={styles.readCount}>浏览次数：{item.readCount}</View>
          </View>
        </View>
      </View>
      <AtModal
        isOpened={isOpened}
        title='确认取消收藏该“二”货吗？'
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
    // <View className={styles.item} onClick={props.onClick}>
    //   <Image className={styles.cover} mode="aspectFill" src={item.coverUrl as string || defaultProductCover} />
    //   <View className={styles.info}>
    //     <ExtendedContainer maxLine={2} content={(item.title as string)} showSwitch={false} />
    //     <Tag tagName={tagName} />
    //     <View className={styles.price}><Text className={styles.priceUnit}>￥</Text>{item.price}</View>
    //     <View className={styles.readCount}>浏览次数：{item.readCount}</View>
    //   </View>
    // </View>
  )
}

export default memo(ProductListItem)
