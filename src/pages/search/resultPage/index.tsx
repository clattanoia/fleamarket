import Taro, { memo, useEffect, useState } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import SeachListSection from '../../../components/searchList'
import ProductList from '../../../components/productList'
import { ProductType, RefreshDataType } from '../../../constants/enums'

import styles from './index.module.scss'

interface InProps {
  onSetVal: (key, value) => void
  refreshData: (type: RefreshDataType) => void
  productTypes: Search.SelectLayout[]
  searchListResult: any[]
  productType: ProductType
}

function ResultPage(props: InProps) {
  const { productTypes, onSetVal, refreshData, searchListResult, productType } = props
  const [width, setWidth]=useState(0)

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        setWidth(res.screenHeight - 50)
      },
    })
  }, [])

  const scrollStyle = {
    height: `${width}px`,
  }
  const onScrollToLower = (e) => {
    console.log('--------onScrollToLower----------------------')
    console.log(e)
    refreshData(RefreshDataType.ADD_PAGE)
  }

  return (
    <View className={styles.container}>
      <view className={styles.searchConntainer}>
        <SeachListSection
          onSetVal={onSetVal}
          productTypes={productTypes}
          refreshData={refreshData}
        />
      </view>
      <View className={styles.scrollSection}>
        <ScrollView
          className={styles.scrollview}
          scrollY
          scrollWithAnimation
          style={scrollStyle}
          lowerThreshold={20}
          onScrollToLower={onScrollToLower}
        >
          <ProductList productListData={searchListResult} productType={productType} />
        </ScrollView>
      </View>
    </View>
  )
}

export default memo(ResultPage)
