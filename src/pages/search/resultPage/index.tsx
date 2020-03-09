import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import SeachListSection from '../../../components/searchList'
import ProductList from '../../../components/productList'
import { ProductType } from '../../../constants/enums'

interface InProps {
  onSetVal: (key, value) => void
  fetchSearch: () => void
  productTypes: Search.SelectLayout[]
  searchListResult: any[]
  productType: ProductType
}

function ResultPage(props: InProps) {
  const { productTypes, onSetVal, fetchSearch, searchListResult, productType } = props

  return (
    <View>
      <SeachListSection
        onSetVal={onSetVal}
        productTypes={productTypes}
        fetchSearch={fetchSearch}
      />
      <ProductList productListData={searchListResult} productType={productType} />
    </View>
  )
}

export default memo(ResultPage)
