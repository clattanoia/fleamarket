import Taro, { memo, useState, useEffect } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { useSelector, useDispatch } from '@tarojs/redux'


import styles from './index.module.scss'

import { placeholderText } from '../../constants/search'
import SelectLayout from '../selectLayout'
import { SET_PRODUCT_SEARCH } from '../../constants/actionTypes'

interface InProps {
  productTypes: Search.SelectLayout[]
  onSetVal: (key, value) => void
}

function SeachListSection(props: InProps) {
  const productSearch = useSelector((state: any) => {
    return state.global.productSearch
  })
  const { productTypes, onSetVal } = props

  const dispatch = useDispatch()
  const { currentProductType, title } = productSearch

  const [forceHiddenFloatLayout, setForceHiddenFloatLayout] = useState(false)
  const [currentSelectInfo, setCurrentSelectInfo] = useState(productTypes[0])

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
    Taro.redirectTo({
      url: '/pages/index/index',
    })
  }

  const changeType = (type) => {
    setCurrentSelectInfo(type)
    setSearch({ currentProductType: type.id })
  }

  const showSearchPage = () => {
    onSetVal('showResult', false)
    setForceHiddenFloatLayout(false)
  }

  return (
    <View className={styles.searchBody}>
      <View className={styles.search}>
        <View className={styles.searchLeft}>
          <View className={styles.searchType}>
            <SelectLayout
              list={productTypes}
              current={currentSelectInfo}
              onChangeSelect={changeType}
              textBottom={10}
              forceHiddenFloatLayout={forceHiddenFloatLayout}
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
        <Text className={styles.searchBtn} onClick={cancleHandle}>取消</Text>
      </View>
    </View>
  )

}


export default memo(SeachListSection)
