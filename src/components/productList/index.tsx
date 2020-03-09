import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import ProductItem from '../productItem'
import { ProductType } from '../../constants/enums'

import styles from './index.module.scss'

interface InProps {
  productListData: Global.Goods[]
}

function ProductList(props: InProps) {
  const { productListData } = props


  const onClickEvent = (id: string) => () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}&productType=${ProductType.GOODS}`,
    })
  }

  return (
    <View className={styles.wrapperList}>
      {productListData.map(item =>
        <View className={styles.listItem} key={item.id} onClick={onClickEvent(item.id)}>
          <ProductItem productData={item} />
        </View>
      )}
    </View>
  )

}


export default memo(ProductList)
