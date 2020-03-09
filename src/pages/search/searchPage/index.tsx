import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import SeachSection from '../../../components/search'

interface InProps {
  productTypes: Search.SelectLayout[]
  hasFetchSearch: boolean
  onSetVal: (key, value) => void
  fetchSearch: () => void
}

function SearchPage(props: InProps) {
  const { productTypes, hasFetchSearch, onSetVal, fetchSearch } = props

  return (
    <View>
      <SeachSection
        productTypes={productTypes}
        hasFetchSearch={hasFetchSearch}
        onSetVal={onSetVal}
        fetchSearch={fetchSearch}
      />
    </View>
  )
}

export default memo(SearchPage)
