import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import SeachSection from '../../../components/search'

interface InProps {
  productTypes: Search.SelectLayout[]
  hasFetchSearch: boolean
  onSetVal: (key, value) => void
}

function SearchPage(props: InProps) {
  const { productTypes, hasFetchSearch, onSetVal } = props

  return (
    <View>
      <SeachSection
        productTypes={productTypes}
        hasFetchSearch={hasFetchSearch}
        onSetVal={onSetVal}
      />
    </View>
  )
}

export default memo(SearchPage)
