import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import SeachListSection from '../../../components/searchList'

interface InProps {
  onSetVal: (key, value) => void
  fetchSearch: () => void
  productTypes: Search.SelectLayout[]
  searchListResult: any[]
}

function ResultPage(props: InProps) {
  const { productTypes, onSetVal, fetchSearch } = props

  return (
    <View>
      <SeachListSection
        onSetVal={onSetVal}
        productTypes={productTypes}
        fetchSearch={fetchSearch}
      />
      11
    </View>
  )
}

export default memo(ResultPage)
