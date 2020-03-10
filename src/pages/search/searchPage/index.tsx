import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import SeachSection from '../components/search'
import { RefreshDataType } from '../../../constants/enums'

interface InProps {
  productTypes: Search.SelectLayout[]
  hasFetchSearch: boolean
  onSetVal: (key, value) => void
  refreshData: (type: RefreshDataType) => void
}

function SearchPage(props: InProps) {
  const { productTypes, hasFetchSearch, onSetVal, refreshData } = props


  return (
    <View>
      <SeachSection
        productTypes={productTypes}
        hasFetchSearch={hasFetchSearch}
        onSetVal={onSetVal}
        refreshData={refreshData}
      />
    </View>
  )
}

export default memo(SearchPage)
