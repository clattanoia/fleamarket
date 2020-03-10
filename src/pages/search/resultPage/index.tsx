import Taro, { memo, useEffect, useState } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtLoadMore } from 'taro-ui'

import SeachListSection from '../components/searchList'
import ProductList from '../../../components/productList'
import { ProductType, RefreshDataType } from '../../../constants/enums'

import styles from './index.module.scss'

interface InProps {
  onSetVal: (key, value) => void
  refreshData: (type: RefreshDataType) => void
  productTypes: Search.SelectLayout[]
  searchListResult: any[]
  productType: ProductType
  showNoMore: boolean
  isLoading: boolean
}

function ResultPage(props: InProps) {
  const { productTypes, onSetVal, refreshData, searchListResult, productType, showNoMore= false, isLoading=false } = props
  const [width, setWidth]=useState(0)

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        console.log(res)
        setWidth(res.windowHeight - 50)
      },
    })
  }, [])

  const scrollStyle = {
    height: `${width}px`,
  }
  const onScrollToLower = () => {
    if(isLoading || showNoMore){
      return
    }
    refreshData(RefreshDataType.ADD_PAGE)
  }

  return (
    <View className={styles.container}>
      <View className={styles.search}>
        <SeachListSection
          onSetVal={onSetVal}
          productTypes={productTypes}
          refreshData={refreshData}
        />
      </View>
      <View className={styles.scrollSection}>
        <ScrollView
          className={styles.scrollview}
          scrollY
          scrollWithAnimation
          style={scrollStyle}
          lowerThreshold={20}
          upperThreshold={20}
          onScrollToLower={onScrollToLower}
        >
          <View className={styles.list}>
            <ProductList productListData={searchListResult} productType={productType} />
          </View>
          <View className={styles.noMore}>
            { isLoading ? <AtLoadMore status="loading" /> : (
              showNoMore && <AtLoadMore status="noMore" noMoreTextStyle="color: #c8c8c8" />
            )
            }
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default memo(ResultPage)
