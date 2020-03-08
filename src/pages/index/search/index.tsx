import Taro, { memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSearchBar }  from 'taro-ui'
import { useDispatch } from '@tarojs/redux'

import { SET_PRODUCT_SEARCH } from '../../../constants/actionTypes'

import './index.scss'
import { placeholderText } from '../../../constants/search'
import { INITIAL_STATE }  from '../../../reducers/global'


function SeachSection() {
  const dispatch = useDispatch()

  const goToSearch = () => {
    dispatch({ type: SET_PRODUCT_SEARCH, payload: INITIAL_STATE.productSearch })
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
