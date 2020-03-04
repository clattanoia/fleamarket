import Taro, { memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSearchBar }  from 'taro-ui'

import './index.scss'
import { placeholderText } from '../../../constants/search'


function SeachSection() {

  const goToSearch = () => {
    Taro.redirectTo({
      url: '/pages/search/index',
    })
  }
  const onChange = () => {}

  return (
    <View className="search" onClick={goToSearch}>
      <View className="searchLeft">
        <AtSearchBar
          disabled
          value=""
          placeholder={placeholderText}
          onChange={onChange}
        />
      </View>
      <Text className="searchBtn">搜索</Text>
    </View>
  )

}


export default memo(SeachSection)
