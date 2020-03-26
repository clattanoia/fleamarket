import Taro, { memo, useEffect, useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import SeachSection from '../components/search'
import SeachHistory from '../components/searchHistory'
import { RefreshDataType } from '../../constants/enums'

interface InProps {
  productTypes: Search.SelectLayout[]
  hasFetchSearch: boolean
  onSetVal: (key, value) => void
  refreshData: (type: RefreshDataType) => void
}

function SearchPage(props: InProps) {
  const { productTypes, hasFetchSearch, onSetVal, refreshData } = props
  const [searchHistory, setSearchHistory] = useState([])

  useEffect(() => {
    const searchHistory = Taro.getStorageSync('searchHistory')
    setSearchHistory(searchHistory || [])
  }, [])

  const clearHistory = () => {
    Taro.removeStorageSync('searchHistory')
    setSearchHistory([])
  }

  return (
    <View>
      <SeachSection
        productTypes={productTypes}
        hasFetchSearch={hasFetchSearch}
        onSetVal={onSetVal}
        refreshData={refreshData}
        searchHistory={searchHistory}
      />
      <SeachHistory
        searchHistory={searchHistory}
        onClearHistory={clearHistory}
        refreshData={refreshData}
      />
    </View>
  )
}

export default memo(SearchPage)
