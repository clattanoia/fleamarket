import Taro, { memo, useState, useEffect } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { useSelector, useDispatch } from '@tarojs/redux'


import styles from './index.module.scss'

import { placeholderText } from '../../../constants/search'
import SelectLayout from '../../../components/selectLayout'
import { SET_PRODUCT_SEARCH } from '../../../constants/actionTypes'
import { RefreshDataType } from '../../../constants/enums'

interface InProps {
  productTypes: Search.SelectLayout[]
  refreshData: (type: RefreshDataType) => void
  onSetVal: (key, value) => void
}

function SeachListSection(props: InProps) {
  const productSearch = useSelector((state: any) => {
    return state.global.productSearch
  })
  const { productTypes, onSetVal, refreshData } = props

  const dispatch = useDispatch()
  const { currentProductType, title } = productSearch
  const [forceHiddenFloatLayout, setForceHiddenFloatLayout] = useState(false)
  const [currentSelectInfo, setCurrentSelectInfo] = useState(productTypes && productTypes[0])

  const setSearch = (search) => {
    dispatch({ type: SET_PRODUCT_SEARCH, payload: search })
  }

  const setCurrentSelectInfoHandle = (id) => {
    const info = productTypes.find(item => item.id === id)
    setCurrentSelectInfo(info)
  }

  useEffect(() => {
    setCurrentSelectInfoHandle(currentProductType)
  }, [currentProductType, setCurrentSelectInfoHandle])

  const cancleHandle = () => {
    Taro.reLaunch({
      url: '/pages/index/index',
    })
  }

  const changeType = (type) => {
    const typeCurrent = type.id
    if(typeCurrent!==currentProductType){
      setSearch({ currentProductType: typeCurrent })
      refreshData(RefreshDataType.RESET_PAGE)
    }
  }

  const showSearchPage = () => {
    onSetVal('showResult', false)
    setForceHiddenFloatLayout(false)
  }

  const resetForceHiddenFloatLayout = (val) => {
    setForceHiddenFloatLayout(val)
  }

  return (
    <View className={styles.searchBody}>
      <View className={styles.search} style={{ paddingBottom: '5px' }}>
        <View className={styles.searchLeft}>
          <View className={styles.searchType}>
            <SelectLayout
              list={productTypes}
              current={currentSelectInfo}
              onChangeSelect={changeType}
              textBottom={10}
              forceHiddenFloatLayout={forceHiddenFloatLayout}
              resetForceHiddenFloatLayout={resetForceHiddenFloatLayout}
            />
          </View>
          <View className={styles.searchText} onClick={showSearchPage}>
            <Input
              className={styles.searchInput}
              name='keyword'
              type='text'
              maxLength={10}
              placeholder={placeholderText}
              value={title}
              disabled
            />
          </View>
        </View>
        <Text className={styles.searchBtn} onClick={cancleHandle}>返回</Text>
      </View>
    </View>
  )

}


export default memo(SeachListSection)
